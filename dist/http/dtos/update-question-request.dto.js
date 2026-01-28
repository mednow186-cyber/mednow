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
exports.UpdateQuestionRequestDto = exports.ProcessingStatusUpdateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ProcessingStatusUpdateDto {
}
exports.ProcessingStatusUpdateDto = ProcessingStatusUpdateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status do processamento',
        enum: ['pending', 'classified', 'partial'],
        required: false,
        example: 'classified',
    }),
    __metadata("design:type", String)
], ProcessingStatusUpdateDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de classificação',
        required: false,
        example: '2026-01-18T17:18:15.074Z',
    }),
    __metadata("design:type", Date)
], ProcessingStatusUpdateDto.prototype, "classifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Modelo usado para classificação',
        required: false,
        example: 'gpt-4o',
    }),
    __metadata("design:type", String)
], ProcessingStatusUpdateDto.prototype, "model", void 0);
class UpdateQuestionRequestDto {
}
exports.UpdateQuestionRequestDto = UpdateQuestionRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fonte da questão (URL da imagem)',
        required: false,
        example: 'https://example.com/image.png',
    }),
    __metadata("design:type", String)
], UpdateQuestionRequestDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Texto bruto extraído',
        required: false,
        example: 'Raw text extracted from the image...',
    }),
    __metadata("design:type", String)
], UpdateQuestionRequestDto.prototype, "raw_text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status do processamento',
        type: ProcessingStatusUpdateDto,
        required: false,
    }),
    __metadata("design:type", ProcessingStatusUpdateDto)
], UpdateQuestionRequestDto.prototype, "processing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de questões processadas',
        type: Array,
        required: false,
    }),
    __metadata("design:type", Array)
], UpdateQuestionRequestDto.prototype, "questions", void 0);
//# sourceMappingURL=update-question-request.dto.js.map