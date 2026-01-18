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
exports.ProcessQuestionsUseCase = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const result_1 = require("../../../../../building-blocks/result/result");
const MAX_ITEMS = 10;
let ProcessQuestionsUseCase = class ProcessQuestionsUseCase {
    constructor(queuePort) {
        this.queuePort = queuePort;
    }
    async execute(request) {
        if (!request.items || !Array.isArray(request.items)) {
            return result_1.Result.fail(new Error('Items must be a valid array'));
        }
        if (request.items.length === 0) {
            return result_1.Result.fail(new Error('Items array cannot be empty'));
        }
        if (request.items.length > MAX_ITEMS) {
            return result_1.Result.fail(new Error(`Maximum ${MAX_ITEMS} items allowed per request`));
        }
        const correlationId = (0, crypto_1.randomUUID)();
        const receivedAt = new Date().toISOString();
        const messages = request.items.map((item) => {
            if (!item.imageUrl || typeof item.imageUrl !== 'string') {
                throw new Error('imageUrl is required and must be a string');
            }
            return {
                imageUrl: item.imageUrl,
                content: item.content,
                notes: item.notes,
                metadata: {
                    correlationId,
                    receivedAt,
                    module: 'questions',
                },
            };
        });
        try {
            for (const message of messages) {
                await this.queuePort.send(message);
            }
            return result_1.Result.ok(messages.length);
        }
        catch (error) {
            return result_1.Result.fail(error instanceof Error
                ? error
                : new Error('Failed to send messages to queue'));
        }
    }
};
exports.ProcessQuestionsUseCase = ProcessQuestionsUseCase;
exports.ProcessQuestionsUseCase = ProcessQuestionsUseCase = __decorate([
    __param(0, (0, common_1.Inject)('QueuePort')),
    __metadata("design:paramtypes", [Object])
], ProcessQuestionsUseCase);
//# sourceMappingURL=process-questions.use-case.js.map