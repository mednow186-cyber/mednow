import { Document } from 'mongoose';
export type QuestionRawDocument = QuestionRaw & Document;
export declare class QuestionRaw {
    correlationId: string;
    imageUrl: string;
    sourceType: 'image' | 'pdf';
    originalPayload: Record<string, unknown>;
    gptResponse: unknown;
    status: 'pending_review' | 'approved';
    createdAt: Date;
}
export declare const QuestionRawSchema: import("mongoose").Schema<QuestionRaw, import("mongoose").Model<QuestionRaw, any, any, any, Document<unknown, any, QuestionRaw, any, {}> & QuestionRaw & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, QuestionRaw, Document<unknown, {}, import("mongoose").FlatRecord<QuestionRaw>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<QuestionRaw> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
