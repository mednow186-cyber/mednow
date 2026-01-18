import { QueueMessage } from '../ports/queue.port';
import { GptServicePort } from '../ports/gpt-service.port';
import { QuestionsRawRepositoryPort } from '../ports/questions-raw-repository.port';
import { Logger } from '../../../../../building-blocks/observability/logger.interface';
export declare class ConsumeQuestionsUseCase {
    private readonly gptService;
    private readonly repository;
    private readonly logger;
    constructor(gptService: GptServicePort, repository: QuestionsRawRepositoryPort, logger: Logger);
    execute(message: QueueMessage): Promise<void>;
}
