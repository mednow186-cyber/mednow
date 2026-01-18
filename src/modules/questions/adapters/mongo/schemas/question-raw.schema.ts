import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionRawDocument = QuestionRaw & Document;

@Schema({ collection: 'questions_raw' })
export class QuestionRaw {
  @Prop({ required: true, index: true })
  correlationId: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true, enum: ['image', 'pdf'] })
  sourceType: 'image' | 'pdf';

  @Prop({ required: true, type: Object })
  originalPayload: Record<string, unknown>;

  @Prop({ required: true, type: Object })
  gptResponse: unknown;

  @Prop({ required: true, enum: ['pending_review', 'approved'], index: true })
  status: 'pending_review' | 'approved';

  @Prop({ required: true, index: true })
  createdAt: Date;
}

export const QuestionRawSchema = SchemaFactory.createForClass(QuestionRaw);
