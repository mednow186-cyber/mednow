import { Result } from '../../../../../building-blocks/result/result';
import { QuestionsRawRepositoryPort, QuestionRaw } from '../ports/questions-raw-repository.port';
export interface UpdateQuestionRequest {
    id: string;
    imageUrl?: string;
    sourceType?: 'image' | 'pdf';
    originalPayload?: Record<string, unknown>;
    gptResponse?: unknown;
    status?: 'pending_review' | 'approved';
}
export declare class UpdateQuestionUseCase {
    private readonly questionsRawRepository;
    constructor(questionsRawRepository: QuestionsRawRepositoryPort);
    execute(request: UpdateQuestionRequest): Promise<Result<QuestionRaw>>;
}
