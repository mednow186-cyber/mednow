import { Inject } from '@nestjs/common';
import { QueueMessage } from '../ports/queue.port';
import { GptServicePort, FileType } from '../ports/gpt-service.port';
import {
  QuestionsRawRepositoryPort,
  SourceType,
} from '../ports/questions-raw-repository.port';
import { Logger } from '../../../../../building-blocks/observability/logger.interface';

function identifyFileType(imageUrl: string): FileType {
  try {
    const url = new URL(imageUrl);
    const pathname = url.pathname.toLowerCase();
    const extension = pathname.substring(pathname.lastIndexOf('.') + 1);

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (imageExtensions.includes(extension)) {
      return 'image';
    }

    if (extension === 'pdf') {
      return 'pdf';
    }

    throw new Error(`Unsupported file type: ${extension}`);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Invalid URL: ${imageUrl}`);
    }
    throw error;
  }
}

export class ConsumeQuestionsUseCase {
  constructor(
    @Inject('GptServicePort')
    private readonly gptService: GptServicePort,
    @Inject('QuestionsRawRepositoryPort')
    private readonly repository: QuestionsRawRepositoryPort,
    @Inject('Logger')
    private readonly logger: Logger,
  ) {}

  async execute(message: QueueMessage): Promise<void> {
    const { correlationId, receivedAt, module: moduleName } = message.metadata;

    try {
      const fileType = identifyFileType(message.imageUrl);
      const sourceType: SourceType = fileType;

      this.logger.info(
        `Processing question: correlationId=${correlationId}, fileType=${fileType}`,
        'ConsumeQuestionsUseCase',
      );

      const gptResponse = await this.gptService.processQuestion({
        imageUrl: message.imageUrl,
        fileType,
        content: message.content,
        notes: message.notes,
      });

      await this.repository.save({
        correlationId,
        imageUrl: message.imageUrl,
        sourceType,
        originalPayload: {
          imageUrl: message.imageUrl,
          content: message.content,
          notes: message.notes,
          metadata: {
            correlationId,
            receivedAt,
            module: moduleName,
          },
        },
        gptResponse: gptResponse.content,
        status: 'pending_review',
        createdAt: new Date(),
      });

      this.logger.info(
        `Question processed successfully: correlationId=${correlationId}`,
        'ConsumeQuestionsUseCase',
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorContext =
        error instanceof Error && error.stack ? error.stack : undefined;

      const isUnsupportedFileType = errorMessage.includes('Unsupported file type');
      const isInvalidUrl = errorMessage.includes('Invalid URL');

      if (isUnsupportedFileType || isInvalidUrl) {
        this.logger.warn(
          `Skipping message with unrecoverable error: correlationId=${correlationId}, error=${errorMessage}`,
          'ConsumeQuestionsUseCase',
        );
        return;
      }

      if (
        errorMessage.includes('GPT') ||
        errorMessage.includes('OpenAI') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('rate limit')
      ) {
        this.logger.error(
          `GPT error processing question: correlationId=${correlationId}, error=${errorMessage}`,
          errorContext,
          'ConsumeQuestionsUseCase',
        );
      } else {
        this.logger.error(
          `Infrastructure error processing question: correlationId=${correlationId}, error=${errorMessage}`,
          errorContext,
          'ConsumeQuestionsUseCase',
        );
      }

      throw error;
    }
  }
}
