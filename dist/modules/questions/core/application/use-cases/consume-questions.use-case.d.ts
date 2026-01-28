import { QueueMessage } from '../ports/queue.port';
import { GptServicePort } from '../ports/gpt-service.port';
import { QuestionsRawRepositoryPort } from '../ports/questions-raw-repository.port';
import { QuestionsProcessingRepositoryPort } from '../ports/questions-processing-repository.port';
import { Logger } from '../../../../../building-blocks/observability/logger.interface';
export declare class ConsumeQuestionsUseCase {
    private readonly gptService;
    private readonly rawRepository;
    private readonly processingRepository;
    private readonly logger;
    constructor(gptService: GptServicePort, rawRepository: QuestionsRawRepositoryPort, processingRepository: QuestionsProcessingRepositoryPort, logger: Logger);
    execute(message: QueueMessage): Promise<void>;
    private extractRawText;
    private extractQuestions;
}
