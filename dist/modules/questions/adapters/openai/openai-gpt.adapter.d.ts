import { GptServicePort, GptProcessRequest, GptResponse } from '../../core/application/ports/gpt-service.port';
import { Logger } from '../../../../building-blocks/observability/logger.interface';
export declare class OpenAiGptAdapter implements GptServicePort {
    private readonly logger;
    private readonly client;
    private readonly model;
    private readonly timeout;
    constructor(logger: Logger);
    processQuestion(request: GptProcessRequest): Promise<GptResponse>;
}
