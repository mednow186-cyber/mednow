import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestionsRawRepositoryPort, QuestionRaw } from '../../core/application/ports/questions-raw-repository.port';
import {
  QuestionRawDocument,
  QuestionRaw as QuestionRawEntity,
} from './schemas/question-raw.schema';

export class MongoQuestionsRawRepositoryAdapter
  implements QuestionsRawRepositoryPort
{
  constructor(
    @InjectModel(QuestionRawEntity.name)
    private readonly questionRawModel: Model<QuestionRawDocument>,
  ) {}

  async save(questionRaw: QuestionRaw): Promise<void> {
    const document = new this.questionRawModel({
      correlationId: questionRaw.correlationId,
      imageUrl: questionRaw.imageUrl,
      sourceType: questionRaw.sourceType,
      originalPayload: questionRaw.originalPayload,
      gptResponse: questionRaw.gptResponse,
      status: questionRaw.status,
      createdAt: questionRaw.createdAt,
    });

    await document.save();
  }

  async findAll(): Promise<QuestionRaw[]> {
    const documents = await this.questionRawModel.find().exec();
    return documents.map((doc) => this.mapDocumentToQuestionRaw(doc));
  }

  async findById(id: string): Promise<QuestionRaw | null> {
    const document = await this.questionRawModel.findById(id).exec();
    if (!document) {
      return null;
    }
    return this.mapDocumentToQuestionRaw(document);
  }

  private mapDocumentToQuestionRaw(doc: QuestionRawDocument): QuestionRaw {
    return {
      _id: doc._id.toString(),
      correlationId: doc.correlationId,
      imageUrl: doc.imageUrl,
      sourceType: doc.sourceType,
      originalPayload: doc.originalPayload,
      gptResponse: doc.gptResponse,
      status: doc.status,
      createdAt: doc.createdAt,
    };
  }
}
