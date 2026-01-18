import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Result } from '../../../../../building-blocks/result/result';
import { QueuePort, QueueMessage } from '../ports/queue.port';

const MAX_ITEMS = 10;

export interface ProcessQuestionsRequest {
  items: Array<{
    imageUrl: string;
    content?: string;
    notes?: string;
  }>;
}

export class ProcessQuestionsUseCase {
  constructor(
    @Inject('QueuePort') private readonly queuePort: QueuePort,
  ) {}

  async execute(
    request: ProcessQuestionsRequest,
  ): Promise<Result<number>> {
    if (!request.items || !Array.isArray(request.items)) {
      return Result.fail(
        new Error('Items must be a valid array'),
      );
    }

    if (request.items.length === 0) {
      return Result.fail(new Error('Items array cannot be empty'));
    }

    if (request.items.length > MAX_ITEMS) {
      return Result.fail(
        new Error(`Maximum ${MAX_ITEMS} items allowed per request`),
      );
    }

    const correlationId = randomUUID();
    const receivedAt = new Date().toISOString();

    const messages: QueueMessage[] = request.items.map((item) => {
      if (!item.imageUrl || typeof item.imageUrl !== 'string') {
        throw new Error('imageUrl is required and must be a string');
      }

      return {
        imageUrl: item.imageUrl,
        content: item.content,
        notes: item.notes,
        metadata: {
          correlationId,
          receivedAt,
          module: 'questions',
        },
      };
    });

    try {
      for (const message of messages) {
        await this.queuePort.send(message);
      }

      return Result.ok(messages.length);
    } catch (error) {
      return Result.fail(
        error instanceof Error
          ? error
          : new Error('Failed to send messages to queue'),
      );
    }
  }
}
