import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProcessQuestionsUseCase } from './core/application/use-cases/process-questions.use-case';
import { ConsumeQuestionsUseCase } from './core/application/use-cases/consume-questions.use-case';
import { GetQuestionsUseCase } from './core/application/use-cases/get-questions.use-case';
import { AmqpQueueAdapter } from './adapters/amqp/amqp-queue.adapter';
import { AmqpQueueConsumerAdapter } from './adapters/amqp/amqp-queue-consumer.adapter';
import { OpenAiGptAdapter } from './adapters/openai/openai-gpt.adapter';
import { MongoQuestionsRawRepositoryAdapter } from './adapters/mongo/mongo-questions-raw-repository.adapter';
import { NestLoggerAdapter } from './adapters/logger/nest-logger.adapter';
import { QueuePort } from './core/application/ports/queue.port';
import { QueueConsumerPort } from './core/application/ports/queue-consumer.port';
import { GptServicePort } from './core/application/ports/gpt-service.port';
import { QuestionsRawRepositoryPort } from './core/application/ports/questions-raw-repository.port';
import { Logger } from '../../building-blocks/observability/logger.interface';
import {
  QuestionRaw,
  QuestionRawSchema,
} from './adapters/mongo/schemas/question-raw.schema';
import { QuestionsConsumerService } from './questions-consumer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuestionRaw.name, schema: QuestionRawSchema },
    ]),
  ],
  providers: [
    ProcessQuestionsUseCase,
    ConsumeQuestionsUseCase,
    GetQuestionsUseCase,
    QuestionsConsumerService,
    {
      provide: 'QueuePort',
      useClass: AmqpQueueAdapter,
    },
    {
      provide: 'QueueConsumerPort',
      useClass: AmqpQueueConsumerAdapter,
    },
    {
      provide: 'GptServicePort',
      useClass: OpenAiGptAdapter,
    },
    {
      provide: 'QuestionsRawRepositoryPort',
      useClass: MongoQuestionsRawRepositoryAdapter,
    },
    {
      provide: 'Logger',
      useFactory: () => new NestLoggerAdapter('QuestionsModule'),
    },
  ],
  exports: [ProcessQuestionsUseCase, GetQuestionsUseCase],
})
export class QuestionsModule {}
