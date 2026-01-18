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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAiGptAdapter = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = __importDefault(require("openai"));
let OpenAiGptAdapter = class OpenAiGptAdapter {
    constructor(logger) {
        this.logger = logger;
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY environment variable is required');
        }
        this.model = process.env.OPENAI_MODEL || 'gpt-4o';
        this.timeout = parseInt(process.env.OPENAI_TIMEOUT_MS || '60000', 10);
        this.client = new openai_1.default({
            apiKey,
            timeout: this.timeout,
            maxRetries: 0,
        });
        this.logger.info(`OpenAI GPT adapter initialized: model=${this.model}, timeout=${this.timeout}ms`, 'OpenAiGptAdapter');
    }
    async processQuestion(request) {
        const { imageUrl, fileType, content, notes } = request;
        const startTime = Date.now();
        this.logger.debug(`Processing question with GPT: model=${this.model}, fileType=${fileType}, imageUrl=${imageUrl}, hasContent=${!!content}, hasNotes=${!!notes}`, 'OpenAiGptAdapter');
        const promptParts = [
            `Analise este arquivo ${fileType === 'image' ? 'de imagem' : 'PDF'} e extraia os dados da questão em formato JSON estruturado.`,
        ];
        if (content) {
            promptParts.push(`\n\nConteúdo adicional:\n${content}`);
        }
        if (notes) {
            promptParts.push(`\n\nNotas:\n${notes}`);
        }
        promptParts.push('\n\nRetorne a resposta em formato JSON válido com todos os dados extraídos da questão.');
        const messages = [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: promptParts.join(''),
                    },
                    {
                        type: 'image_url',
                        image_url: {
                            url: imageUrl,
                        },
                    },
                ],
            },
        ];
        try {
            this.logger.debug(`Calling OpenAI API: model=${this.model}, promptLength=${promptParts.join('').length}`, 'OpenAiGptAdapter');
            const completion = await this.client.chat.completions.create({
                model: this.model,
                messages,
                response_format: { type: 'json_object' },
            });
            const responseContent = completion.choices[0]?.message?.content;
            if (!responseContent) {
                const error = new Error('Empty response from GPT');
                this.logger.error(`OpenAI returned empty response: model=${this.model}, completionId=${completion.id || 'unknown'}`, undefined, 'OpenAiGptAdapter');
                throw error;
            }
            let parsedContent;
            try {
                parsedContent = JSON.parse(responseContent);
            }
            catch (parseError) {
                const parseErrorMessage = parseError instanceof Error
                    ? parseError.message
                    : 'Unknown parse error';
                this.logger.error(`Failed to parse GPT response as JSON: model=${this.model}, responseLength=${responseContent.length}, error=${parseErrorMessage}`, parseError instanceof Error ? parseError.stack : undefined, 'OpenAiGptAdapter');
                throw new Error(`Invalid JSON response from GPT: ${parseErrorMessage}`);
            }
            const processingTime = Date.now() - startTime;
            this.logger.info(`GPT processing completed successfully: model=${this.model}, processingTime=${processingTime}ms, completionId=${completion.id || 'unknown'}, responseLength=${responseContent.length}`, 'OpenAiGptAdapter');
            return {
                content: parsedContent,
            };
        }
        catch (error) {
            const processingTime = Date.now() - startTime;
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error && error.stack ? error.stack : undefined;
            if (error instanceof openai_1.default.APIError) {
                this.logger.error(`OpenAI API error: model=${this.model}, status=${error.status}, code=${error.code || 'unknown'}, message=${error.message}, processingTime=${processingTime}ms`, errorStack, 'OpenAiGptAdapter');
                throw new Error(`OpenAI API error: ${error.message} (status: ${error.status})`);
            }
            if (error instanceof Error) {
                if (error.message.includes('timeout')) {
                    this.logger.error(`GPT request timeout: model=${this.model}, timeout=${this.timeout}ms, processingTime=${processingTime}ms`, errorStack, 'OpenAiGptAdapter');
                    throw new Error(`GPT timeout after ${this.timeout}ms`);
                }
                if (error.message.includes('JSON')) {
                    this.logger.error(`GPT response parsing error: model=${this.model}, processingTime=${processingTime}ms`, errorStack, 'OpenAiGptAdapter');
                }
                else {
                    this.logger.error(`Unexpected error calling GPT: model=${this.model}, error=${errorMessage}, processingTime=${processingTime}ms`, errorStack, 'OpenAiGptAdapter');
                }
                throw error;
            }
            this.logger.error(`Unknown error calling GPT: model=${this.model}, processingTime=${processingTime}ms`, undefined, 'OpenAiGptAdapter');
            throw new Error('Unknown error calling GPT');
        }
    }
};
exports.OpenAiGptAdapter = OpenAiGptAdapter;
exports.OpenAiGptAdapter = OpenAiGptAdapter = __decorate([
    __param(0, (0, common_1.Inject)('Logger')),
    __metadata("design:paramtypes", [Object])
], OpenAiGptAdapter);
//# sourceMappingURL=openai-gpt.adapter.js.map