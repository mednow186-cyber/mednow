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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionRawResponseDto = exports.GptResponseDto = exports.AnswerExplanationDto = exports.QuestionDto = exports.ChoiceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ChoiceDto {
}
exports.ChoiceDto = ChoiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Letra da opção', example: 'A' }),
    __metadata("design:type", String)
], ChoiceDto.prototype, "option", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Texto da opção',
        example: 'Haemophilus influenzae (3%)',
    }),
    __metadata("design:type", String)
], ChoiceDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica se a opção está correta',
        required: false,
        example: false,
    }),
    __metadata("design:type", Boolean)
], ChoiceDto.prototype, "correct", void 0);
class QuestionDto {
}
exports.QuestionDto = QuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Texto da questão',
        example: 'Investigators study the prevalence of respiratory pathogens...',
    }),
    __metadata("design:type", String)
], QuestionDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descrição do gráfico',
        example: 'Graph showing the percentage of individuals colonized...',
    }),
    __metadata("design:type", String)
], QuestionDto.prototype, "graph_description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Legenda da imagem',
        example: '<2 2-5 6-10 11-17 18-24 25-34 35-44 ≥ 45 Percentage of individuals Age (years)',
    }),
    __metadata("design:type", String)
], QuestionDto.prototype, "image_caption", void 0);
class AnswerExplanationDto {
}
exports.AnswerExplanationDto = AnswerExplanationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Explicação da resposta',
        example: 'Pseudomonas aeruginosa is the leading respiratory pathogen...',
    }),
    __metadata("design:type", String)
], AnswerExplanationDto.prototype, "text", void 0);
class GptResponseDto {
}
exports.GptResponseDto = GptResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: QuestionDto }),
    __metadata("design:type", QuestionDto)
], GptResponseDto.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ChoiceDto] }),
    __metadata("design:type", Array)
], GptResponseDto.prototype, "choices", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Destaque da questão',
        example: 'The pathogen, once acquired, often switches into mucoid phenotype...',
    }),
    __metadata("design:type", String)
], GptResponseDto.prototype, "highlight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AnswerExplanationDto }),
    __metadata("design:type", AnswerExplanationDto)
], GptResponseDto.prototype, "answer_explanation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notas adicionais',
        type: [String],
        example: [
            'Educational Objective: Pseudomonas aeruginosa is the leading respiratory pathogen...',
        ],
    }),
    __metadata("design:type", Array)
], GptResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tempo decorrido',
        example: '04 mins, 02 secs',
    }),
    __metadata("design:type", String)
], GptResponseDto.prototype, "time_elapsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Percentual de respostas corretas',
        example: '76%',
    }),
    __metadata("design:type", String)
], GptResponseDto.prototype, "percent_answered_correctly", void 0);
class QuestionRawResponseDto {
}
exports.QuestionRawResponseDto = QuestionRawResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único do documento',
        example: '696d15d7d5eb39e8296e120b',
    }),
    __metadata("design:type", String)
], QuestionRawResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de correlação da requisição',
        example: '8501d2c5-2305-40c9-b2c8-c1e94e5eecee',
    }),
    __metadata("design:type", String)
], QuestionRawResponseDto.prototype, "correlationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL da imagem processada',
        example: 'https://sqjffocugqnngfquahlb.supabase.co/storage/v1/object/public/ocr-questions-056/image.png',
    }),
    __metadata("design:type", String)
], QuestionRawResponseDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo da fonte',
        enum: ['image', 'pdf'],
        example: 'image',
    }),
    __metadata("design:type", String)
], QuestionRawResponseDto.prototype, "sourceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payload original da requisição',
        type: Object,
        example: {
            imageUrl: 'https://example.com/image.png',
            content: 'Conteúdo opcional',
            notes: 'Notas opcionais',
            metadata: {
                correlationId: '8501d2c5-2305-40c9-b2c8-c1e94e5eecee',
                receivedAt: '2026-01-18T17:17:59.990Z',
                module: 'questions',
            },
        },
    }),
    __metadata("design:type", Object)
], QuestionRawResponseDto.prototype, "originalPayload", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: GptResponseDto }),
    __metadata("design:type", GptResponseDto)
], QuestionRawResponseDto.prototype, "gptResponse", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status da questão',
        enum: ['pending_review', 'approved'],
        example: 'pending_review',
    }),
    __metadata("design:type", String)
], QuestionRawResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de criação',
        example: '2026-01-18T17:18:15.074Z',
    }),
    __metadata("design:type", String)
], QuestionRawResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Versão do documento',
        required: false,
        example: 0,
    }),
    __metadata("design:type", Number)
], QuestionRawResponseDto.prototype, "__v", void 0);
//# sourceMappingURL=question-raw-response.dto.js.map