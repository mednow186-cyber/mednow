import { Model } from 'mongoose';
import { QuestionsProcessingRepositoryPort, QuestionProcessing } from '../../core/application/ports/questions-processing-repository.port';
import { QuestionProcessingDocument } from './schemas/question-processing.schema';
export declare class MongoQuestionsProcessingRepositoryAdapter implements QuestionsProcessingRepositoryPort {
    private readonly questionProcessingModel;
    constructor(questionProcessingModel: Model<QuestionProcessingDocument>);
    save(questionProcessing: QuestionProcessing): Promise<void>;
    findAll(): Promise<QuestionProcessing[]>;
    findById(id: string): Promise<QuestionProcessing | null>;
    update(id: string, updates: Partial<QuestionProcessing>): Promise<QuestionProcessing | null>;
    private mapDocumentToQuestionProcessing;
}
