import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { QueueConsumerPort } from './core/application/ports/queue-consumer.port';
import { ConsumeQuestionsUseCase } from './core/application/use-cases/consume-questions.use-case';

@Injectable()
export class QuestionsConsumerService implements OnModuleInit {
  constructor(
    @Inject('QueueConsumerPort')
    private readonly queueConsumer: QueueConsumerPort,
    private readonly consumeQuestionsUseCase: ConsumeQuestionsUseCase,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.queueConsumer.consume(async (message) => {
      await this.consumeQuestionsUseCase.execute(message);
    });
  }
}
