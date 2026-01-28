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
    constructor(gptService, rawRepository, processingRepository, logger) {
        this.gptService = gptService;
        this.rawRepository = rawRepository;
        this.processingRepository = processingRepository;
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
            await this.rawRepository.save({
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
            const rawText = this.extractRawText(gptResponse.content);
            const questions = this.extractQuestions(gptResponse.content);
            await this.processingRepository.save({
                source: message.imageUrl,
                raw_text: rawText,
                processing: {
                    status: 'pending',
                },
                questions: questions,
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
    extractRawText(gptContent) {
        if (typeof gptContent === 'object' && gptContent !== null) {
            const content = gptContent;
            if (typeof content.raw_text === 'string') {
                return content.raw_text;
            }
            if (typeof content.text === 'string') {
                return content.text;
            }
            return JSON.stringify(gptContent);
        }
        if (typeof gptContent === 'string') {
            return gptContent;
        }
        return String(gptContent);
    }
    extractQuestions(gptContent) {
        if (typeof gptContent !== 'object' || gptContent === null) {
            return [];
        }
        const content = gptContent;
        if (Array.isArray(content.questions)) {
            return content.questions.map((q, index) => {
                const question = q;
                return {
                    questionNumber: typeof question.questionNumber === 'number'
                        ? question.questionNumber
                        : index + 1,
                    type: question.type === 'descriptive'
                        ? 'descriptive'
                        : 'multiple_choice',
                    question: (() => {
                        const questionObj = question.question;
                        const questionText = questionObj && typeof questionObj.text === 'string'
                            ? questionObj.text
                            : typeof question.text === 'string'
                                ? question.text
                                : '';
                        const alternatives = Array.isArray(question.alternatives)
                            ? question.alternatives
                            : questionObj && Array.isArray(questionObj.alternatives)
                                ? questionObj.alternatives
                                : [];
                        return {
                            text: questionText,
                            alternatives: alternatives.map((alt) => {
                                const alternative = alt;
                                return {
                                    letter: typeof alternative.letter === 'string'
                                        ? alternative.letter
                                        : '',
                                    text: typeof alternative.text === 'string'
                                        ? alternative.text
                                        : '',
                                };
                            }),
                        };
                    })(),
                    answer: (() => {
                        const answerObj = question.answer;
                        if (typeof answerObj === 'string') {
                            return {
                                letter: answerObj,
                                text: null,
                                explanation: null,
                                source: 'not_found',
                            };
                        }
                        if (answerObj && typeof answerObj === 'object') {
                            return {
                                letter: typeof answerObj.letter === 'string'
                                    ? answerObj.letter
                                    : null,
                                text: typeof answerObj.text === 'string'
                                    ? answerObj.text
                                    : null,
                                explanation: typeof answerObj.explanation === 'string'
                                    ? answerObj.explanation
                                    : null,
                                source: typeof answerObj.source === 'string' &&
                                    (answerObj.source === 'official_gabarito' ||
                                        answerObj.source === 'not_found')
                                    ? answerObj.source
                                    : 'not_found',
                            };
                        }
                        return {
                            letter: null,
                            text: null,
                            explanation: null,
                            source: 'not_found',
                        };
                    })(),
                    classification: (() => {
                        const classificationObj = question.classification;
                        if (!classificationObj || typeof classificationObj !== 'object') {
                            return undefined;
                        }
                        return {
                            area: typeof classificationObj.area === 'string'
                                ? classificationObj.area
                                : undefined,
                            subarea: typeof classificationObj.subarea === 'string'
                                ? classificationObj.subarea
                                : undefined,
                            theme: typeof classificationObj.theme === 'string'
                                ? classificationObj.theme
                                : undefined,
                            difficulty: classificationObj.difficulty === 'easy' ||
                                classificationObj.difficulty === 'medium' ||
                                classificationObj.difficulty === 'hard'
                                ? classificationObj.difficulty
                                : undefined,
                            keywords: Array.isArray(classificationObj.keywords)
                                ? classificationObj.keywords.filter((k) => typeof k === 'string')
                                : undefined,
                        };
                    })(),
                    processing: (() => {
                        const processingObj = question.processing;
                        return {
                            status: processingObj &&
                                typeof processingObj === 'object' &&
                                processingObj.status === 'classification_error'
                                ? 'classification_error'
                                : 'classified',
                            error: processingObj &&
                                typeof processingObj === 'object' &&
                                typeof processingObj.error === 'string'
                                ? processingObj.error
                                : null,
                        };
                    })(),
                };
            });
        }
        return [];
    }
};
exports.ConsumeQuestionsUseCase = ConsumeQuestionsUseCase;
exports.ConsumeQuestionsUseCase = ConsumeQuestionsUseCase = __decorate([
    __param(0, (0, common_1.Inject)('GptServicePort')),
    __param(1, (0, common_1.Inject)('QuestionsRawRepositoryPort')),
    __param(2, (0, common_1.Inject)('QuestionsProcessingRepositoryPort')),
    __param(3, (0, common_1.Inject)('Logger')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ConsumeQuestionsUseCase);
//# sourceMappingURL=consume-questions.use-case.js.map