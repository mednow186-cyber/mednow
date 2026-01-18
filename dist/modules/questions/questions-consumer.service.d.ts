import { OnModuleInit } from '@nestjs/common';
import { QueueConsumerPort } from './core/application/ports/queue-consumer.port';
import { ConsumeQuestionsUseCase } from './core/application/use-cases/consume-questions.use-case';
export declare class QuestionsConsumerService implements OnModuleInit {
    private readonly queueConsumer;
    private readonly consumeQuestionsUseCase;
    constructor(queueConsumer: QueueConsumerPort, consumeQuestionsUseCase: ConsumeQuestionsUseCase);
    onModuleInit(): Promise<void>;
}
