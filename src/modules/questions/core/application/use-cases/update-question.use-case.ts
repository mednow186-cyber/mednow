import { Inject, Injectable } from '@nestjs/common';
import { Result } from '../../../../../building-blocks/result/result';
import {
  QuestionsRawRepositoryPort,
  QuestionRaw,
} from '../ports/questions-raw-repository.port';

export interface UpdateQuestionRequest {
  id: string;
  imageUrl?: string;
  sourceType?: 'image' | 'pdf';
  originalPayload?: Record<string, unknown>;
  gptResponse?: unknown;
  status?: 'pending_review' | 'approved';
}

@Injectable()
export class UpdateQuestionUseCase {
  constructor(
    @Inject('QuestionsRawRepositoryPort')
    private readonly questionsRawRepository: QuestionsRawRepositoryPort,
  ) {}

  async execute(
    request: UpdateQuestionRequest,
  ): Promise<Result<QuestionRaw>> {
    if (!request.id || typeof request.id !== 'string') {
      return Result.fail(new Error('Invalid id provided'));
    }

    const existingQuestion = await this.questionsRawRepository.findById(
      request.id,
    );

    if (!existingQuestion) {
      return Result.fail(new Error('Question not found'));
    }

    const updates: Partial<QuestionRaw> = {};

    if (request.imageUrl !== undefined) {
      if (typeof request.imageUrl !== 'string') {
        return Result.fail(new Error('imageUrl must be a string'));
      }
      updates.imageUrl = request.imageUrl;
    }

    if (request.sourceType !== undefined) {
      if (!['image', 'pdf'].includes(request.sourceType)) {
        return Result.fail(
          new Error('sourceType must be either "image" or "pdf"'),
        );
      }
      updates.sourceType = request.sourceType;
    }

    if (request.originalPayload !== undefined) {
      if (typeof request.originalPayload !== 'object') {
        return Result.fail(new Error('originalPayload must be an object'));
      }
      updates.originalPayload = request.originalPayload;
    }

    if (request.gptResponse !== undefined) {
      updates.gptResponse = request.gptResponse;
    }

    if (request.status !== undefined && request.status !== null) {
      if (typeof request.status !== 'string') {
        return Result.fail(
          new Error('status must be a string'),
        );
      }
      if (request.status.trim() === '') {
        return Result.fail(
          new Error('status cannot be empty'),
        );
      }
      if (!['pending_review', 'approved'].includes(request.status)) {
        return Result.fail(
          new Error('status must be either "pending_review" or "approved"'),
        );
      }
      updates.status = request.status as 'pending_review' | 'approved';
    }

    try {
      const updatedQuestion = await this.questionsRawRepository.update(
        request.id,
        updates,
      );

      if (!updatedQuestion) {
        return Result.fail(new Error('Failed to update question'));
      }

      return Result.ok(updatedQuestion);
    } catch (error) {
      return Result.fail(
        error instanceof Error
          ? error
          : new Error('Failed to update question'),
      );
    }
  }
}
