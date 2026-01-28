export declare class ProcessingStatusUpdateDto {
    status?: 'pending' | 'classified' | 'partial';
    classifiedAt?: Date;
    model?: string;
}
export declare class UpdateQuestionRequestDto {
    source?: string;
    raw_text?: string;
    processing?: ProcessingStatusUpdateDto;
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
