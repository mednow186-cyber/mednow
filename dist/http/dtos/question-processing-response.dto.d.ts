export declare class AlternativeDto {
    letter: string;
    text: string;
}
export declare class QuestionItemDto {
    questionNumber: number;
    type: 'multiple_choice' | 'descriptive';
    question: {
        text: string;
        alternatives: AlternativeDto[];
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
}
export declare class ProcessingStatusDto {
    status: 'pending' | 'classified' | 'partial';
    classifiedAt?: string;
    model?: string;
}
export declare class QuestionProcessingResponseDto {
    _id: string;
    source: string;
    raw_text: string;
    processing: ProcessingStatusDto;
    questions: QuestionItemDto[];
}
