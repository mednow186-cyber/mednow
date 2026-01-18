export declare class ChoiceDto {
    option: string;
    text: string;
    correct?: boolean;
}
export declare class QuestionDto {
    text: string;
    graph_description: string;
    image_caption: string;
}
export declare class AnswerExplanationDto {
    text: string;
}
export declare class GptResponseDto {
    question: QuestionDto;
    choices: ChoiceDto[];
    highlight: string;
    answer_explanation: AnswerExplanationDto;
    notes: string[];
    time_elapsed: string;
    percent_answered_correctly: string;
}
export declare class QuestionRawResponseDto {
    _id: string;
    correlationId: string;
    imageUrl: string;
    sourceType: 'image' | 'pdf';
    originalPayload: Record<string, unknown>;
    gptResponse: GptResponseDto;
    status: 'pending_review' | 'approved';
    createdAt: string;
    __v?: number;
}
