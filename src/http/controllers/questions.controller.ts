import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
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
import { QuestionRaw } from '../../modules/questions/core/application/ports/questions-raw-repository.port';
import { CreateQuestionsRequestDto } from '../dtos/create-questions-request.dto';
import { CreateQuestionsResponseDto } from '../dtos/create-questions-response.dto';
import { QuestionRawResponseDto } from '../dtos/question-raw-response.dto';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly processQuestionsUseCase: ProcessQuestionsUseCase,
    private readonly getQuestionsUseCase: GetQuestionsUseCase,
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
    description: 'Retorna todas as questões processadas e persistidas',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de questões retornada com sucesso',
    type: [QuestionRawResponseDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async findAll(): Promise<QuestionRawResponseDto[]> {
    const result = await this.getQuestionsUseCase.findAll();

    if (result.isFailure()) {
      throw new HttpException(
        result.getError().message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const questions = result.getValue();
    return questions.map((question: QuestionRaw) => this.mapToResponseDto(question));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar questão por ID',
    description: 'Retorna uma questão específica pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da questão',
    example: '696d15d7d5eb39e8296e120b',
  })
  @ApiResponse({
    status: 200,
    description: 'Questão encontrada com sucesso',
    type: QuestionRawResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Questão não encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async findById(@Param('id') id: string): Promise<QuestionRawResponseDto> {
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

  private mapToResponseDto(question: QuestionRaw): QuestionRawResponseDto {
    return {
      _id: question._id || '',
      correlationId: question.correlationId,
      imageUrl: question.imageUrl,
      sourceType: question.sourceType,
      originalPayload: question.originalPayload,
      gptResponse: question.gptResponse as QuestionRawResponseDto['gptResponse'],
      status: question.status,
      createdAt: question.createdAt.toISOString(),
    };
  }
}
