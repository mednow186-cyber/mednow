import { ProcessQuestionsUseCase } from '../../modules/questions/core/application/use-cases/process-questions.use-case';
import { GetQuestionsUseCase } from '../../modules/questions/core/application/use-cases/get-questions.use-case';
import { UpdateQuestionUseCase } from '../../modules/questions/core/application/use-cases/update-question.use-case';
import { CreateQuestionsRequestDto } from '../dtos/create-questions-request.dto';
import { CreateQuestionsResponseDto } from '../dtos/create-questions-response.dto';
import { UpdateQuestionRequestDto } from '../dtos/update-question-request.dto';
import { QuestionProcessingResponseDto } from '../dtos/question-processing-response.dto';
export declare class QuestionsController {
    private readonly processQuestionsUseCase;
    private readonly getQuestionsUseCase;
    private readonly updateQuestionUseCase;
    constructor(processQuestionsUseCase: ProcessQuestionsUseCase, getQuestionsUseCase: GetQuestionsUseCase, updateQuestionUseCase: UpdateQuestionUseCase);
    create(request: CreateQuestionsRequestDto): Promise<CreateQuestionsResponseDto>;
    findAll(): Promise<QuestionProcessingResponseDto[]>;
    findById(id: string): Promise<QuestionProcessingResponseDto>;
    update(id: string, updateDto: UpdateQuestionRequestDto): Promise<QuestionProcessingResponseDto>;
    private mapToResponseDto;
}
