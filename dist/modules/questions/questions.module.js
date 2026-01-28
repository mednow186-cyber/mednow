"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const process_questions_use_case_1 = require("./core/application/use-cases/process-questions.use-case");
const consume_questions_use_case_1 = require("./core/application/use-cases/consume-questions.use-case");
const get_questions_use_case_1 = require("./core/application/use-cases/get-questions.use-case");
const update_question_use_case_1 = require("./core/application/use-cases/update-question.use-case");
const amqp_queue_adapter_1 = require("./adapters/amqp/amqp-queue.adapter");
const amqp_queue_consumer_adapter_1 = require("./adapters/amqp/amqp-queue-consumer.adapter");
const openai_gpt_adapter_1 = require("./adapters/openai/openai-gpt.adapter");
const mongo_questions_raw_repository_adapter_1 = require("./adapters/mongo/mongo-questions-raw-repository.adapter");
const mongo_questions_processing_repository_adapter_1 = require("./adapters/mongo/mongo-questions-processing-repository.adapter");
const nest_logger_adapter_1 = require("./adapters/logger/nest-logger.adapter");
const question_raw_schema_1 = require("./adapters/mongo/schemas/question-raw.schema");
const question_processing_schema_1 = require("./adapters/mongo/schemas/question-processing.schema");
const questions_consumer_service_1 = require("./questions-consumer.service");
let QuestionsModule = class QuestionsModule {
};
exports.QuestionsModule = QuestionsModule;
exports.QuestionsModule = QuestionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: question_raw_schema_1.QuestionRaw.name, schema: question_raw_schema_1.QuestionRawSchema },
            ]),
            mongoose_1.MongooseModule.forFeature([{ name: question_processing_schema_1.QuestionProcessing.name, schema: question_processing_schema_1.QuestionProcessingSchema }], 'questions_db'),
        ],
        providers: [
            process_questions_use_case_1.ProcessQuestionsUseCase,
            consume_questions_use_case_1.ConsumeQuestionsUseCase,
            get_questions_use_case_1.GetQuestionsUseCase,
            update_question_use_case_1.UpdateQuestionUseCase,
            questions_consumer_service_1.QuestionsConsumerService,
            {
                provide: 'QueuePort',
                useClass: amqp_queue_adapter_1.AmqpQueueAdapter,
            },
            {
                provide: 'QueueConsumerPort',
                useFactory: (logger) => {
                    return new amqp_queue_consumer_adapter_1.AmqpQueueConsumerAdapter(logger);
                },
                inject: ['Logger'],
            },
            {
                provide: 'GptServicePort',
                useFactory: (logger) => {
                    return new openai_gpt_adapter_1.OpenAiGptAdapter(logger);
                },
                inject: ['Logger'],
            },
            {
                provide: 'QuestionsRawRepositoryPort',
                useClass: mongo_questions_raw_repository_adapter_1.MongoQuestionsRawRepositoryAdapter,
            },
            {
                provide: 'QuestionsProcessingRepositoryPort',
                useClass: mongo_questions_processing_repository_adapter_1.MongoQuestionsProcessingRepositoryAdapter,
            },
            {
                provide: 'Logger',
                useFactory: () => new nest_logger_adapter_1.NestLoggerAdapter('QuestionsModule'),
            },
        ],
        exports: [process_questions_use_case_1.ProcessQuestionsUseCase, get_questions_use_case_1.GetQuestionsUseCase, update_question_use_case_1.UpdateQuestionUseCase],
    })
], QuestionsModule);
//# sourceMappingURL=questions.module.js.map