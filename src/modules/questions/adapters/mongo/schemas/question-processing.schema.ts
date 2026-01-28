import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionProcessingDocument = QuestionProcessing & Document;

@Schema({ collection: 'questions_processing' })
export class QuestionProcessing {
  @Prop({ required: true })
  source: string;

  @Prop({ required: true })
  raw_text: string;

  @Prop({
    type: {
      status: {
        type: String,
        enum: ['pending', 'classified', 'partial'],
        required: true,
      },
      classifiedAt: Date,
      model: String,
    },
    required: true,
  })
  processing: {
    status: 'pending' | 'classified' | 'partial';
    classifiedAt?: Date;
    model?: string;
  };

  @Prop({
    type: [
      {
        questionNumber: { type: Number, required: true },
        type: {
          type: String,
          enum: ['multiple_choice', 'descriptive'],
          required: true,
        },
        question: {
          text: { type: String, required: true },
          alternatives: [
            {
              letter: { type: String, required: true },
              text: { type: String, required: true },
            },
          ],
        },
        answer: {
          letter: { type: String, default: null },
          text: { type: String, default: null },
          explanation: { type: String, default: null },
          source: {
            type: String,
            enum: ['official_gabarito', 'not_found'],
            required: true,
          },
        },
        classification: {
          area: String,
          subarea: String,
          theme: String,
          difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
          },
          keywords: [String],
        },
        processing: {
          status: {
            type: String,
            enum: ['classified', 'classification_error'],
            required: true,
          },
          error: { type: String, default: null },
        },
      },
    ],
    default: [],
  })
  questions: Array<{
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

export const QuestionProcessingSchema =
  SchemaFactory.createForClass(QuestionProcessing);
