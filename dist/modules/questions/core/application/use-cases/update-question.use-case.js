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
    constructor(questionsProcessingRepository) {
        this.questionsProcessingRepository = questionsProcessingRepository;
    }
    async execute(request) {
        if (!request.id || typeof request.id !== 'string') {
            return result_1.Result.fail(new Error('Invalid id provided'));
        }
        const existingQuestion = await this.questionsProcessingRepository.findById(request.id);
        if (!existingQuestion) {
            return result_1.Result.fail(new Error('Question not found'));
        }
        const updates = {};
        if (request.source !== undefined) {
            if (typeof request.source !== 'string') {
                return result_1.Result.fail(new Error('source must be a string'));
            }
            updates.source = request.source;
        }
        if (request.raw_text !== undefined) {
            if (typeof request.raw_text !== 'string') {
                return result_1.Result.fail(new Error('raw_text must be a string'));
            }
            updates.raw_text = request.raw_text;
        }
        if (request.processing !== undefined) {
            if (typeof request.processing !== 'object') {
                return result_1.Result.fail(new Error('processing must be an object'));
            }
            updates.processing = {
                ...existingQuestion.processing,
                ...request.processing,
            };
        }
        if (request.questions !== undefined) {
            if (!Array.isArray(request.questions)) {
                return result_1.Result.fail(new Error('questions must be an array'));
            }
            updates.questions = request.questions;
        }
        try {
            const updatedQuestion = await this.questionsProcessingRepository.update(request.id, updates);
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
    __param(0, (0, common_1.Inject)('QuestionsProcessingRepositoryPort')),
    __metadata("design:paramtypes", [Object])
], UpdateQuestionUseCase);
//# sourceMappingURL=update-question.use-case.js.map