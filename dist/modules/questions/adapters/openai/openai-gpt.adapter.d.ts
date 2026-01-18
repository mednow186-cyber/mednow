import { GptServicePort, GptProcessRequest, GptResponse } from '../../core/application/ports/gpt-service.port';
export declare class OpenAiGptAdapter implements GptServicePort {
    private readonly client;
    private readonly model;
    private readonly timeout;
    constructor();
    processQuestion(request: GptProcessRequest): Promise<GptResponse>;
}
