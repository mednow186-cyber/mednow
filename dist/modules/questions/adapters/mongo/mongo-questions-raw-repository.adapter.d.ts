import { Model } from 'mongoose';
import { QuestionsRawRepositoryPort, QuestionRaw } from '../../core/application/ports/questions-raw-repository.port';
import { QuestionRawDocument } from './schemas/question-raw.schema';
export declare class MongoQuestionsRawRepositoryAdapter implements QuestionsRawRepositoryPort {
    private readonly questionRawModel;
    constructor(questionRawModel: Model<QuestionRawDocument>);
    save(questionRaw: QuestionRaw): Promise<void>;
    findAll(): Promise<QuestionRaw[]>;
    findById(id: string): Promise<QuestionRaw | null>;
    update(id: string, updates: Partial<QuestionRaw>): Promise<QuestionRaw | null>;
    private mapDocumentToQuestionRaw;
}
