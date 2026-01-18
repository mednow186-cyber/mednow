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
exports.UpdateQuestionRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const question_raw_response_dto_1 = require("./question-raw-response.dto");
class UpdateQuestionRequestDto {
}
exports.UpdateQuestionRequestDto = UpdateQuestionRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL da imagem da questão',
        required: false,
        example: 'https://example.com/image.png',
    }),
    __metadata("design:type", String)
], UpdateQuestionRequestDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo da fonte',
        enum: ['image', 'pdf'],
        required: false,
        example: 'image',
    }),
    __metadata("design:type", String)
], UpdateQuestionRequestDto.prototype, "sourceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payload original da requisição',
        type: Object,
        required: false,
        example: {
            imageUrl: 'https://example.com/image.png',
            content: 'Conteúdo atualizado',
            notes: 'Notas atualizadas',
        },
    }),
    __metadata("design:type", Object)
], UpdateQuestionRequestDto.prototype, "originalPayload", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Resposta do GPT processada',
        type: Object,
        required: false,
    }),
    __metadata("design:type", question_raw_response_dto_1.GptResponseDto)
], UpdateQuestionRequestDto.prototype, "gptResponse", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status da questão',
        enum: ['pending_review', 'approved'],
        required: false,
        example: 'pending_review',
    }),
    __metadata("design:type", String)
], UpdateQuestionRequestDto.prototype, "status", void 0);
//# sourceMappingURL=update-question-request.dto.js.map