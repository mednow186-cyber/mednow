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
exports.ConsumeQuestionsUseCase = void 0;
const common_1 = require("@nestjs/common");
function identifyFileType(imageUrl) {
    try {
        const url = new URL(imageUrl);
        const pathname = url.pathname.toLowerCase();
        const extension = pathname.substring(pathname.lastIndexOf('.') + 1);
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (imageExtensions.includes(extension)) {
            return 'image';
        }
        if (extension === 'pdf') {
            return 'pdf';
        }
        throw new Error(`Unsupported file type: ${extension}`);
    }
    catch (error) {
        if (error instanceof TypeError) {
            throw new Error(`Invalid URL: ${imageUrl}`);
        }
        throw error;
    }
}
let ConsumeQuestionsUseCase = class ConsumeQuestionsUseCase {
    constructor(gptService, repository, logger) {
        this.gptService = gptService;
        this.repository = repository;
        this.logger = logger;
    }
    async execute(message) {
        const { correlationId, receivedAt, module: moduleName } = message.metadata;
        try {
            const fileType = identifyFileType(message.imageUrl);
            const sourceType = fileType;
            this.logger.info(`Processing question: correlationId=${correlationId}, fileType=${fileType}`, 'ConsumeQuestionsUseCase');
            const gptResponse = await this.gptService.processQuestion({
                imageUrl: message.imageUrl,
                fileType,
                content: message.content,
                notes: message.notes,
            });
            await this.repository.save({
                correlationId,
                imageUrl: message.imageUrl,
                sourceType,
                originalPayload: {
                    imageUrl: message.imageUrl,
                    content: message.content,
                    notes: message.notes,
                    metadata: {
                        correlationId,
                        receivedAt,
                        module: moduleName,
                    },
                },
                gptResponse: gptResponse.content,
                status: 'pending_review',
                createdAt: new Date(),
            });
            this.logger.info(`Question processed successfully: correlationId=${correlationId}`, 'ConsumeQuestionsUseCase');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorContext = error instanceof Error && error.stack ? error.stack : undefined;
            const isUnsupportedFileType = errorMessage.includes('Unsupported file type');
            const isInvalidUrl = errorMessage.includes('Invalid URL');
            if (isUnsupportedFileType || isInvalidUrl) {
                this.logger.warn(`Skipping message with unrecoverable error: correlationId=${correlationId}, error=${errorMessage}`, 'ConsumeQuestionsUseCase');
                return;
            }
            if (errorMessage.includes('GPT') ||
                errorMessage.includes('OpenAI') ||
                errorMessage.includes('timeout') ||
                errorMessage.includes('rate limit')) {
                this.logger.error(`GPT error processing question: correlationId=${correlationId}, error=${errorMessage}`, errorContext, 'ConsumeQuestionsUseCase');
            }
            else {
                this.logger.error(`Infrastructure error processing question: correlationId=${correlationId}, error=${errorMessage}`, errorContext, 'ConsumeQuestionsUseCase');
            }
            throw error;
        }
    }
};
exports.ConsumeQuestionsUseCase = ConsumeQuestionsUseCase;
exports.ConsumeQuestionsUseCase = ConsumeQuestionsUseCase = __decorate([
    __param(0, (0, common_1.Inject)('GptServicePort')),
    __param(1, (0, common_1.Inject)('QuestionsRawRepositoryPort')),
    __param(2, (0, common_1.Inject)('Logger')),
    __metadata("design:paramtypes", [Object, Object, Object])
], ConsumeQuestionsUseCase);
//# sourceMappingURL=consume-questions.use-case.js.map