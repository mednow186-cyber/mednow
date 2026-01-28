import { Inject } from '@nestjs/common';
import { QueueMessage } from '../ports/queue.port';
import { GptServicePort, FileType } from '../ports/gpt-service.port';
import {
  QuestionsRawRepositoryPort,
  SourceType,
} from '../ports/questions-raw-repository.port';
import {
  QuestionsProcessingRepositoryPort,
  QuestionItem,
} from '../ports/questions-processing-repository.port';
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
    private readonly rawRepository: QuestionsRawRepositoryPort,
    @Inject('QuestionsProcessingRepositoryPort')
    private readonly processingRepository: QuestionsProcessingRepositoryPort,
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

      await this.rawRepository.save({
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

      const rawText = this.extractRawText(gptResponse.content);
      const questions = this.extractQuestions(gptResponse.content);

      await this.processingRepository.save({
        source: message.imageUrl,
        raw_text: rawText,
        processing: {
          status: 'pending',
        },
        questions: questions,
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

  private extractRawText(gptContent: unknown): string {
    if (typeof gptContent === 'object' && gptContent !== null) {
      const content = gptContent as Record<string, unknown>;
      if (typeof content.raw_text === 'string') {
        return content.raw_text;
      }
      if (typeof content.text === 'string') {
        return content.text;
      }
      return JSON.stringify(gptContent);
    }
    if (typeof gptContent === 'string') {
      return gptContent;
    }
    return String(gptContent);
  }

  private extractQuestions(gptContent: unknown): QuestionItem[] {
    if (typeof gptContent !== 'object' || gptContent === null) {
      return [];
    }

    const content = gptContent as Record<string, unknown>;

    if (Array.isArray(content.questions)) {
      return content.questions.map((q: unknown, index: number) => {
        const question = q as Record<string, unknown>;
        return {
          questionNumber:
            typeof question.questionNumber === 'number'
              ? question.questionNumber
              : index + 1,
          type:
            question.type === 'descriptive'
              ? 'descriptive'
              : 'multiple_choice',
          question: (() => {
            const questionObj = question.question as Record<string, unknown> | undefined;
            const questionText =
              questionObj && typeof questionObj.text === 'string'
                ? questionObj.text
                : typeof question.text === 'string'
                  ? question.text
                  : '';
            
            const alternatives = Array.isArray(question.alternatives)
              ? question.alternatives
              : questionObj && Array.isArray(questionObj.alternatives)
                ? questionObj.alternatives
                : [];

            return {
              text: questionText,
              alternatives: alternatives.map((alt: unknown) => {
                const alternative = alt as Record<string, unknown>;
                return {
                  letter:
                    typeof alternative.letter === 'string'
                      ? alternative.letter
                      : '',
                  text:
                    typeof alternative.text === 'string'
                      ? alternative.text
                      : '',
                };
              }),
            };
          })(),
          answer: (() => {
            const answerObj = question.answer as
              | Record<string, unknown>
              | string
              | undefined;
            
            if (typeof answerObj === 'string') {
              return {
                letter: answerObj,
                text: null,
                explanation: null,
                source: 'not_found' as const,
              };
            }

            if (answerObj && typeof answerObj === 'object') {
              return {
                letter:
                  typeof answerObj.letter === 'string'
                    ? answerObj.letter
                    : null,
                text:
                  typeof answerObj.text === 'string'
                    ? answerObj.text
                    : null,
                explanation:
                  typeof answerObj.explanation === 'string'
                    ? answerObj.explanation
                    : null,
                source:
                  typeof answerObj.source === 'string' &&
                  (answerObj.source === 'official_gabarito' ||
                    answerObj.source === 'not_found')
                    ? (answerObj.source as 'official_gabarito' | 'not_found')
                    : ('not_found' as const),
              };
            }

            return {
              letter: null,
              text: null,
              explanation: null,
              source: 'not_found' as const,
            };
          })(),
          classification: (() => {
            const classificationObj = question.classification as
              | Record<string, unknown>
              | undefined;

            if (!classificationObj || typeof classificationObj !== 'object') {
              return undefined;
            }

            return {
              area:
                typeof classificationObj.area === 'string'
                  ? classificationObj.area
                  : undefined,
              subarea:
                typeof classificationObj.subarea === 'string'
                  ? classificationObj.subarea
                  : undefined,
              theme:
                typeof classificationObj.theme === 'string'
                  ? classificationObj.theme
                  : undefined,
              difficulty:
                classificationObj.difficulty === 'easy' ||
                classificationObj.difficulty === 'medium' ||
                classificationObj.difficulty === 'hard'
                  ? (classificationObj.difficulty as 'easy' | 'medium' | 'hard')
                  : undefined,
              keywords: Array.isArray(classificationObj.keywords)
                ? (classificationObj.keywords as unknown[]).filter(
                    (k: unknown): k is string => typeof k === 'string',
                  )
                : undefined,
            };
          })(),
          processing: (() => {
            const processingObj = question.processing as
              | Record<string, unknown>
              | undefined;

            return {
              status:
                processingObj &&
                typeof processingObj === 'object' &&
                processingObj.status === 'classification_error'
                  ? ('classification_error' as const)
                  : ('classified' as const),
              error:
                processingObj &&
                typeof processingObj === 'object' &&
                typeof processingObj.error === 'string'
                  ? processingObj.error
                  : null,
            };
          })(),
        };
      });
    }

    return [];
  }
}
