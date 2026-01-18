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
exports.UpdateQuestionUseCase = void 0;
const common_1 = require("@nestjs/common");
const result_1 = require("../../../../../building-blocks/result/result");
let UpdateQuestionUseCase = class UpdateQuestionUseCase {
    constructor(questionsRawRepository) {
        this.questionsRawRepository = questionsRawRepository;
    }
    async execute(request) {
        if (!request.id || typeof request.id !== 'string') {
            return result_1.Result.fail(new Error('Invalid id provided'));
        }
        const existingQuestion = await this.questionsRawRepository.findById(request.id);
        if (!existingQuestion) {
            return result_1.Result.fail(new Error('Question not found'));
        }
        const updates = {};
        if (request.imageUrl !== undefined) {
            if (typeof request.imageUrl !== 'string') {
                return result_1.Result.fail(new Error('imageUrl must be a string'));
            }
            updates.imageUrl = request.imageUrl;
        }
        if (request.sourceType !== undefined) {
            if (!['image', 'pdf'].includes(request.sourceType)) {
                return result_1.Result.fail(new Error('sourceType must be either "image" or "pdf"'));
            }
            updates.sourceType = request.sourceType;
        }
        if (request.originalPayload !== undefined) {
            if (typeof request.originalPayload !== 'object') {
                return result_1.Result.fail(new Error('originalPayload must be an object'));
            }
            updates.originalPayload = request.originalPayload;
        }
        if (request.gptResponse !== undefined) {
            updates.gptResponse = request.gptResponse;
        }
        if (request.status !== undefined && request.status !== null) {
            if (typeof request.status !== 'string') {
                return result_1.Result.fail(new Error('status must be a string'));
            }
            if (request.status.trim() === '') {
                return result_1.Result.fail(new Error('status cannot be empty'));
            }
            if (!['pending_review', 'approved'].includes(request.status)) {
                return result_1.Result.fail(new Error('status must be either "pending_review" or "approved"'));
            }
            updates.status = request.status;
        }
        try {
            const updatedQuestion = await this.questionsRawRepository.update(request.id, updates);
            if (!updatedQuestion) {
                return result_1.Result.fail(new Error('Failed to update question'));
            }
            return result_1.Result.ok(updatedQuestion);
        }
        catch (error) {
            return result_1.Result.fail(error instanceof Error
                ? error
                : new Error('Failed to update question'));
        }
    }
};
exports.UpdateQuestionUseCase = UpdateQuestionUseCase;
exports.UpdateQuestionUseCase = UpdateQuestionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('QuestionsRawRepositoryPort')),
    __metadata("design:paramtypes", [Object])
], UpdateQuestionUseCase);
//# sourceMappingURL=update-question.use-case.js.map