import { Result } from '../../../../../building-blocks/result/result';
import { QuestionsRawRepositoryPort, QuestionRaw } from '../ports/questions-raw-repository.port';
export declare class GetQuestionsUseCase {
    private readonly questionsRawRepository;
    constructor(questionsRawRepository: QuestionsRawRepositoryPort);
    findAll(): Promise<Result<QuestionRaw[]>>;
    findById(id: string): Promise<Result<QuestionRaw | null>>;
}
