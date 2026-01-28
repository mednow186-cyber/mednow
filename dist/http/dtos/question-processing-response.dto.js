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
exports.QuestionProcessingResponseDto = exports.ProcessingStatusDto = exports.QuestionItemDto = exports.AlternativeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AlternativeDto {
}
exports.AlternativeDto = AlternativeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Letra da alternativa', example: 'A' }),
    __metadata("design:type", String)
], AlternativeDto.prototype, "letter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Texto da alternativa',
        example: 'Haemophilus influenzae (3%)',
    }),
    __metadata("design:type", String)
], AlternativeDto.prototype, "text", void 0);
class QuestionItemDto {
}
exports.QuestionItemDto = QuestionItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Número da questão', example: 1 }),
    __metadata("design:type", Number)
], QuestionItemDto.prototype, "questionNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo da questão',
        enum: ['multiple_choice', 'descriptive'],
        example: 'multiple_choice',
    }),
    __metadata("design:type", String)
], QuestionItemDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dados da questão',
        type: Object,
        example: {
            text: 'Investigators study the prevalence of respiratory pathogens...',
            alternatives: [
                { letter: 'A', text: 'Option A' },
                { letter: 'B', text: 'Option B' },
            ],
        },
    }),
    __metadata("design:type", Object)
], QuestionItemDto.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Resposta da questão',
        type: Object,
        example: {
            letter: 'C',
            text: null,
            explanation: 'Explanation text',
            source: 'official_gabarito',
        },
    }),
    __metadata("design:type", Object)
], QuestionItemDto.prototype, "answer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Classificação da questão',
        required: false,
        type: Object,
        example: {
            area: 'Medicine',
            subarea: 'Infectious Diseases',
            theme: 'Respiratory Pathogens',
            difficulty: 'medium',
            keywords: ['pathogen', 'respiratory'],
        },
    }),
    __metadata("design:type", Object)
], QuestionItemDto.prototype, "classification", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status do processamento da questão',
        type: Object,
        example: {
            status: 'classified',
            error: null,
        },
    }),
    __metadata("design:type", Object)
], QuestionItemDto.prototype, "processing", void 0);
class ProcessingStatusDto {
}
exports.ProcessingStatusDto = ProcessingStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status do processamento',
        enum: ['pending', 'classified', 'partial'],
        example: 'pending',
    }),
    __metadata("design:type", String)
], ProcessingStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de classificação',
        required: false,
        example: '2026-01-18T17:18:15.074Z',
    }),
    __metadata("design:type", String)
], ProcessingStatusDto.prototype, "classifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Modelo usado para classificação',
        required: false,
        example: 'gpt-4o',
    }),
    __metadata("design:type", String)
], ProcessingStatusDto.prototype, "model", void 0);
class QuestionProcessingResponseDto {
}
exports.QuestionProcessingResponseDto = QuestionProcessingResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único do documento',
        example: '696d15d7d5eb39e8296e120b',
    }),
    __metadata("design:type", String)
], QuestionProcessingResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fonte da questão (URL da imagem)',
        example: 'https://sqjffocugqnngfquahlb.supabase.co/storage/v1/object/public/ocr-questions-056/image.png',
    }),
    __metadata("design:type", String)
], QuestionProcessingResponseDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Texto bruto extraído',
        example: 'Raw text extracted from the image...',
    }),
    __metadata("design:type", String)
], QuestionProcessingResponseDto.prototype, "raw_text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status do processamento',
        type: ProcessingStatusDto,
    }),
    __metadata("design:type", ProcessingStatusDto)
], QuestionProcessingResponseDto.prototype, "processing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de questões processadas',
        type: [QuestionItemDto],
    }),
    __metadata("design:type", Array)
], QuestionProcessingResponseDto.prototype, "questions", void 0);
//# sourceMappingURL=question-processing-response.dto.js.map