export interface QuestionItem {
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
}
export interface QuestionProcessing {
    _id?: string;
    source: string;
    raw_text: string;
    processing: {
        status: 'pending' | 'classified' | 'partial';
        classifiedAt?: Date;
        model?: string;
    };
    questions: QuestionItem[];
}
export interface QuestionsProcessingRepositoryPort {
    save(questionProcessing: QuestionProcessing): Promise<void>;
    findAll(): Promise<QuestionProcessing[]>;
    findById(id: string): Promise<QuestionProcessing | null>;
    update(id: string, updates: Partial<QuestionProcessing>): Promise<QuestionProcessing | null>;
}
