import { Inject, Injectable } from '@nestjs/common';
import { Result } from '../../../../../building-blocks/result/result';
import {
  QuestionsProcessingRepositoryPort,
  QuestionProcessing,
} from '../ports/questions-processing-repository.port';

export interface UpdateQuestionRequest {
  id: string;
  source?: string;
  raw_text?: string;
  processing?: {
    status?: 'pending' | 'classified' | 'partial';
    classifiedAt?: Date;
    model?: string;
  };
  questions?: Array<{
    questionNumber: number;
    type: 'multiple_choice' | 'descriptive';
    question: {
      text: string;
      alternatives: Array<{
        letter: string;
        text: string;
      }>;
    };
    answer: {
      letter: string | null;
      text: string | null;
      explanation: string | null;
      source: 'official_gabarito' | 'not_found';
    };
    classification?: {
      area?: string;
      subarea?: string;
      theme?: string;
      difficulty?: 'easy' | 'medium' | 'hard';
      keywords?: string[];
    };
    processing: {
      status: 'classified' | 'classification_error';
      error: string | null;
    };
  }>;
}

@Injectable()
export class UpdateQuestionUseCase {
  constructor(
    @Inject('QuestionsProcessingRepositoryPort')
    private readonly questionsProcessingRepository: QuestionsProcessingRepositoryPort,
  ) {}

  async execute(
    request: UpdateQuestionRequest,
  ): Promise<Result<QuestionProcessing>> {
    if (!request.id || typeof request.id !== 'string') {
      return Result.fail(new Error('Invalid id provided'));
    }

    const existingQuestion = await this.questionsProcessingRepository.findById(
      request.id,
    );

    if (!existingQuestion) {
      return Result.fail(new Error('Question not found'));
    }

    const updates: Partial<QuestionProcessing> = {};

    if (request.source !== undefined) {
      if (typeof request.source !== 'string') {
        return Result.fail(new Error('source must be a string'));
      }
      updates.source = request.source;
    }

    if (request.raw_text !== undefined) {
      if (typeof request.raw_text !== 'string') {
        return Result.fail(new Error('raw_text must be a string'));
      }
      updates.raw_text = request.raw_text;
    }

    if (request.processing !== undefined) {
      if (typeof request.processing !== 'object') {
        return Result.fail(new Error('processing must be an object'));
      }
      updates.processing = {
        ...existingQuestion.processing,
        ...request.processing,
      };
    }

    if (request.questions !== undefined) {
      if (!Array.isArray(request.questions)) {
        return Result.fail(new Error('questions must be an array'));
      }
      updates.questions = request.questions;
    }

    try {
      const updatedQuestion = await this.questionsProcessingRepository.update(
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
