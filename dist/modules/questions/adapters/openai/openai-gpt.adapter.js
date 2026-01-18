"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAiGptAdapter = void 0;
const openai_1 = __importDefault(require("openai"));
class OpenAiGptAdapter {
    constructor() {
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
    }
    async processQuestion(request) {
        const { imageUrl, fileType, content, notes } = request;
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
            const completion = await this.client.chat.completions.create({
                model: this.model,
                messages,
                response_format: { type: 'json_object' },
            });
            const responseContent = completion.choices[0]?.message?.content;
            if (!responseContent) {
                throw new Error('Empty response from GPT');
            }
            const parsedContent = JSON.parse(responseContent);
            return {
                content: parsedContent,
            };
        }
        catch (error) {
            if (error instanceof openai_1.default.APIError) {
                throw new Error(`OpenAI API error: ${error.message} (status: ${error.status})`);
            }
            if (error instanceof Error) {
                if (error.message.includes('timeout')) {
                    throw new Error(`GPT timeout after ${this.timeout}ms`);
                }
                throw error;
            }
            throw new Error('Unknown error calling GPT');
        }
    }
}
exports.OpenAiGptAdapter = OpenAiGptAdapter;
//# sourceMappingURL=openai-gpt.adapter.js.map