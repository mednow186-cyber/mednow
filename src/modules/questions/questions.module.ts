import { Module } from '@nestjs/common';
import { ProcessQuestionsUseCase } from './core/application/use-cases/process-questions.use-case';
import { AmqpQueueAdapter } from './adapters/amqp/amqp-queue.adapter';
import { QueuePort } from './core/application/ports/queue.port';

@Module({
  providers: [
    ProcessQuestionsUseCase,
    {
      provide: 'QueuePort',
      useClass: AmqpQueueAdapter,
    },
  ],
  exports: [ProcessQuestionsUseCase],
})
export class QuestionsModule {}
