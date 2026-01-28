import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ProcessQuestionsUseCase } from '../../modules/questions/core/application/use-cases/process-questions.use-case';
import { GetQuestionsUseCase } from '../../modules/questions/core/application/use-cases/get-questions.use-case';
import { UpdateQuestionUseCase } from '../../modules/questions/core/application/use-cases/update-question.use-case';
import { QuestionProcessing } from '../../modules/questions/core/application/ports/questions-processing-repository.port';
import { CreateQuestionsRequestDto } from '../dtos/create-questions-request.dto';
import { CreateQuestionsResponseDto } from '../dtos/create-questions-response.dto';
import { UpdateQuestionRequestDto } from '../dtos/update-question-request.dto';
import { QuestionProcessingResponseDto } from '../dtos/question-processing-response.dto';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly processQuestionsUseCase: ProcessQuestionsUseCase,
    private readonly getQuestionsUseCase: GetQuestionsUseCase,
    private readonly updateQuestionUseCase: UpdateQuestionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Processar questões',
    description: 'Envia questões para processamento via fila AMQP',
  })
  @ApiBody({ type: CreateQuestionsRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Questões enviadas para processamento com sucesso',
    type: CreateQuestionsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Requisição inválida',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
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

  @Get()
  @ApiOperation({
    summary: 'Listar todas as questões',
    description: 'Retorna todas as questões processadas da collection questions_processing',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de questões retornada com sucesso',
    type: [QuestionProcessingResponseDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async findAll(): Promise<QuestionProcessingResponseDto[]> {
    const result = await this.getQuestionsUseCase.findAll();

    if (result.isFailure()) {
      throw new HttpException(
        result.getError().message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const questions = result.getValue();
    return questions.map((question: QuestionProcessing) =>
      this.mapToResponseDto(question),
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar questão por ID',
    description: 'Retorna uma questão específica pelo seu ID da collection questions_processing',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da questão',
    example: '696d15d7d5eb39e8296e120b',
  })
  @ApiResponse({
    status: 200,
    description: 'Questão encontrada com sucesso',
    type: QuestionProcessingResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Questão não encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async findById(
    @Param('id') id: string,
  ): Promise<QuestionProcessingResponseDto> {
    const result = await this.getQuestionsUseCase.findById(id);

    if (result.isFailure()) {
      throw new HttpException(
        result.getError().message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const question = result.getValue();
    if (!question) {
      throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
    }

    return this.mapToResponseDto(question);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar questão',
    description: 'Atualiza uma questão existente pelo seu ID na collection questions_processing',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da questão a ser atualizada',
    example: '696d15d7d5eb39e8296e120b',
  })
  @ApiBody({ type: UpdateQuestionRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Questão atualizada com sucesso',
    type: QuestionProcessingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Questão não encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateQuestionRequestDto,
  ): Promise<QuestionProcessingResponseDto> {
    const result = await this.updateQuestionUseCase.execute({
      id,
      ...updateDto,
    });

    if (result.isFailure()) {
      const error = result.getError();
      if (error.message === 'Question not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    const updatedQuestion = result.getValue();
    return this.mapToResponseDto(updatedQuestion);
  }

  private mapToResponseDto(
    question: QuestionProcessing,
  ): QuestionProcessingResponseDto {
    return {
      _id: question._id || '',
      source: question.source,
      raw_text: question.raw_text,
      processing: {
        status: question.processing.status,
        classifiedAt: question.processing.classifiedAt?.toISOString(),
        model: question.processing.model,
      },
      questions: question.questions.map((q) => ({
        questionNumber: q.questionNumber,
        type: q.type,
        question: {
          text: q.question.text,
          alternatives: q.question.alternatives.map((alt) => ({
            letter: alt.letter,
            text: alt.text,
          })),
        },
        answer: {
          letter: q.answer.letter,
          text: q.answer.text,
          explanation: q.answer.explanation,
          source: q.answer.source,
        },
        classification: q.classification
          ? {
              area: q.classification.area,
              subarea: q.classification.subarea,
              theme: q.classification.theme,
              difficulty: q.classification.difficulty,
              keywords: q.classification.keywords,
            }
          : undefined,
        processing: {
          status: q.processing.status,
          error: q.processing.error,
        },
      })),
    };
  }
}
