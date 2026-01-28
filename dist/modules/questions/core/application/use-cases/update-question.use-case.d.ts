import { Result } from '../../../../../building-blocks/result/result';
import { QuestionsProcessingRepositoryPort, QuestionProcessing } from '../ports/questions-processing-repository.port';
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
export declare class UpdateQuestionUseCase {
    private readonly questionsProcessingRepository;
    constructor(questionsProcessingRepository: QuestionsProcessingRepositoryPort);
    execute(request: UpdateQuestionRequest): Promise<Result<QuestionProcessing>>;
}
