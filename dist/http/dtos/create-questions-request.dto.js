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
exports.CreateQuestionsRequestDto = exports.QuestionItem = void 0;
const swagger_1 = require("@nestjs/swagger");
class QuestionItem {
}
exports.QuestionItem = QuestionItem;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL da imagem da questão',
        example: 'https://example.com/image.png',
    }),
    __metadata("design:type", String)
], QuestionItem.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Conteúdo opcional do item',
        required: false,
        example: 'Conteúdo opcional do item 1',
    }),
    __metadata("design:type", String)
], QuestionItem.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notas opcionais do item',
        required: false,
        example: 'Notas opcionais do item 1',
    }),
    __metadata("design:type", String)
], QuestionItem.prototype, "notes", void 0);
class CreateQuestionsRequestDto {
}
exports.CreateQuestionsRequestDto = CreateQuestionsRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de itens de questões para processar',
        type: [QuestionItem],
    }),
    __metadata("design:type", Array)
], CreateQuestionsRequestDto.prototype, "items", void 0);
//# sourceMappingURL=create-questions-request.dto.js.map