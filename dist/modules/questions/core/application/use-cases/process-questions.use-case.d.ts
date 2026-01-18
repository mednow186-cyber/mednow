import { Result } from '../../../../../building-blocks/result/result';
import { QueuePort } from '../ports/queue.port';
export interface ProcessQuestionsRequest {
    items: Array<{
        imageUrl: string;
        content?: string;
        notes?: string;
    }>;
}
export declare class ProcessQuestionsUseCase {
    private readonly queuePort;
    constructor(queuePort: QueuePort);
    execute(request: ProcessQuestionsRequest): Promise<Result<number>>;
}
