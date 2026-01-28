import { Document } from 'mongoose';
export type QuestionProcessingDocument = QuestionProcessing & Document;
export declare class QuestionProcessing {
    source: string;
    raw_text: string;
    processing: {
        status: 'pending' | 'classified' | 'partial';
        classifiedAt?: Date;
        model?: string;
    };
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
export declare const QuestionProcessingSchema: import("mongoose").Schema<QuestionProcessing, import("mongoose").Model<QuestionProcessing, any, any, any, Document<unknown, any, QuestionProcessing, any, {}> & QuestionProcessing & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, QuestionProcessing, Document<unknown, {}, import("mongoose").FlatRecord<QuestionProcessing>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<QuestionProcessing> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
