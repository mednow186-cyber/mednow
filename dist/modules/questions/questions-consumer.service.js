"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsConsumerService = void 0;
const common_1 = require("@nestjs/common");
const consume_questions_use_case_1 = require("./core/application/use-cases/consume-questions.use-case");
let QuestionsConsumerService = class QuestionsConsumerService {
    constructor(queueConsumer, consumeQuestionsUseCase) {
        this.queueConsumer = queueConsumer;
        this.consumeQuestionsUseCase = consumeQuestionsUseCase;
    }
    async onModuleInit() {
        await this.queueConsumer.consume(async (message) => {
            await this.consumeQuestionsUseCase.execute(message);
        });
    }
};
exports.QuestionsConsumerService = QuestionsConsumerService;
exports.QuestionsConsumerService = QuestionsConsumerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('QueueConsumerPort')),
    __metadata("design:paramtypes", [Object, consume_questions_use_case_1.ConsumeQuestionsUseCase])
], QuestionsConsumerService);
//# sourceMappingURL=questions-consumer.service.js.map