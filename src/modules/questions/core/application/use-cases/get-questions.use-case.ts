import { Inject, Injectable } from '@nestjs/common';
import { Result } from '../../../../../building-blocks/result/result';
import { QuestionsRawRepositoryPort, QuestionRaw } from '../ports/questions-raw-repository.port';

@Injectable()
export class GetQuestionsUseCase {
  constructor(
    @Inject('QuestionsRawRepositoryPort')
    private readonly questionsRawRepository: QuestionsRawRepositoryPort,
  ) {}

  async findAll(): Promise<Result<QuestionRaw[]>> {
    try {
      const questions = await this.questionsRawRepository.findAll();
      return Result.ok(questions);
    } catch (error) {
      return Result.fail(
        error instanceof Error
          ? error
          : new Error('Failed to retrieve questions'),
      );
    }
  }

  async findById(id: string): Promise<Result<QuestionRaw | null>> {
    if (!id || typeof id !== 'string') {
      return Result.fail(new Error('Invalid id provided'));
    }

    try {
      const question = await this.questionsRawRepository.findById(id);
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
