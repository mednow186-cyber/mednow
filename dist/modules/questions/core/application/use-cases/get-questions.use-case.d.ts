import { Result } from '../../../../../building-blocks/result/result';
import { QuestionsProcessingRepositoryPort, QuestionProcessing } from '../ports/questions-processing-repository.port';
export declare class GetQuestionsUseCase {
    private readonly questionsProcessingRepository;
    constructor(questionsProcessingRepository: QuestionsProcessingRepositoryPort);
    findAll(): Promise<Result<QuestionProcessing[]>>;
    findById(id: string): Promise<Result<QuestionProcessing | null>>;
}
