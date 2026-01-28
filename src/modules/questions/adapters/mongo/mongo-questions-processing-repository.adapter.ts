import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  QuestionsProcessingRepositoryPort,
  QuestionProcessing,
} from '../../core/application/ports/questions-processing-repository.port';
import {
  QuestionProcessingDocument,
  QuestionProcessing as QuestionProcessingEntity,
} from './schemas/question-processing.schema';

export class MongoQuestionsProcessingRepositoryAdapter
  implements QuestionsProcessingRepositoryPort
{
  constructor(
    @InjectModel(QuestionProcessingEntity.name, 'questions_db')
    private readonly questionProcessingModel: Model<QuestionProcessingDocument>,
  ) {}

  async save(questionProcessing: QuestionProcessing): Promise<void> {
    const document = new this.questionProcessingModel({
      source: questionProcessing.source,
      raw_text: questionProcessing.raw_text,
      processing: questionProcessing.processing,
      questions: questionProcessing.questions,
    });

    await document.save();
  }

  async findAll(): Promise<QuestionProcessing[]> {
    const documents = await this.questionProcessingModel.find().exec();
    return documents.map((doc) => this.mapDocumentToQuestionProcessing(doc));
  }

  async findById(id: string): Promise<QuestionProcessing | null> {
    const document = await this.questionProcessingModel.findById(id).exec();
    if (!document) {
      return null;
    }
    return this.mapDocumentToQuestionProcessing(document);
  }

  async update(
    id: string,
    updates: Partial<QuestionProcessing>,
  ): Promise<QuestionProcessing | null> {
    const updateData: Partial<QuestionProcessing> = { ...updates };

    delete updateData._id;

    const document = await this.questionProcessingModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!document) {
      return null;
    }

    return this.mapDocumentToQuestionProcessing(document);
  }

  private mapDocumentToQuestionProcessing(
    doc: QuestionProcessingDocument,
  ): QuestionProcessing {
    return {
      _id: doc._id.toString(),
      source: doc.source,
      raw_text: doc.raw_text,
      processing: {
        status: doc.processing.status,
        classifiedAt: doc.processing.classifiedAt,
        model: doc.processing.model,
      },
      questions: doc.questions.map((q) => ({
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
