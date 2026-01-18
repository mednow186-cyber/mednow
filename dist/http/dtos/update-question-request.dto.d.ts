import { GptResponseDto } from './question-raw-response.dto';
export declare class UpdateQuestionRequestDto {
    imageUrl?: string;
    sourceType?: 'image' | 'pdf';
    originalPayload?: Record<string, unknown>;
    gptResponse?: GptResponseDto;
    status?: 'pending_review' | 'approved';
}
