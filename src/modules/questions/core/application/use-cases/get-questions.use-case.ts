import { Inject, Injectable } from '@nestjs/common';
import { Result } from '../../../../../building-blocks/result/result';
import {
  QuestionsProcessingRepositoryPort,
  QuestionProcessing,
} from '../ports/questions-processing-repository.port';

@Injectable()
export class GetQuestionsUseCase {
  constructor(
    @Inject('QuestionsProcessingRepositoryPort')
    private readonly questionsProcessingRepository: QuestionsProcessingRepositoryPort,
  ) {}

  async findAll(): Promise<Result<QuestionProcessing[]>> {
    try {
      const questions = await this.questionsProcessingRepository.findAll();
      return Result.ok(questions);
    } catch (error) {
      return Result.fail(
        error instanceof Error
          ? error
          : new Error('Failed to retrieve questions'),
      );
    }
  }

  async findById(id: string): Promise<Result<QuestionProcessing | null>> {
    if (!id || typeof id !== 'string') {
      return Result.fail(new Error('Invalid id provided'));
    }

    try {
      const question = await this.questionsProcessingRepository.findById(id);
      return Result.ok(question);
    } catch (error) {
      return Result.fail(
        error instanceof Error
          ? error
          : new Error('Failed to retrieve question'),
      );
    }
  }
}
