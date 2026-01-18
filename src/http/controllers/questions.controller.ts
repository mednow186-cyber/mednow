import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ProcessQuestionsUseCase } from '../../modules/questions/core/application/use-cases/process-questions.use-case';
import { CreateQuestionsRequestDto } from '../dtos/create-questions-request.dto';
import { CreateQuestionsResponseDto } from '../dtos/create-questions-response.dto';

@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly processQuestionsUseCase: ProcessQuestionsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() request: CreateQuestionsRequestDto,
  ): Promise<CreateQuestionsResponseDto> {
    const result = await this.processQuestionsUseCase.execute(request);

    if (result.isFailure()) {
      throw result.getError();
    }

    return {
      success: true,
      messagesCount: result.getValue(),
    };
  }
}
