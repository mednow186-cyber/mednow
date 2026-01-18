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
exports.GetQuestionsUseCase = void 0;
const common_1 = require("@nestjs/common");
const result_1 = require("../../../../../building-blocks/result/result");
let GetQuestionsUseCase = class GetQuestionsUseCase {
    constructor(questionsRawRepository) {
        this.questionsRawRepository = questionsRawRepository;
    }
    async findAll() {
        try {
            const questions = await this.questionsRawRepository.findAll();
            return result_1.Result.ok(questions);
        }
        catch (error) {
            return result_1.Result.fail(error instanceof Error
                ? error
                : new Error('Failed to retrieve questions'));
        }
    }
    async findById(id) {
        if (!id || typeof id !== 'string') {
            return result_1.Result.fail(new Error('Invalid id provided'));
        }
        try {
            const question = await this.questionsRawRepository.findById(id);
            return result_1.Result.ok(question);
        }
        catch (error) {
            return result_1.Result.fail(error instanceof Error
                ? error
                : new Error('Failed to retrieve question'));
        }
    }
};
exports.GetQuestionsUseCase = GetQuestionsUseCase;
exports.GetQuestionsUseCase = GetQuestionsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('QuestionsRawRepositoryPort')),
    __metadata("design:paramtypes", [Object])
], GetQuestionsUseCase);
//# sourceMappingURL=get-questions.use-case.js.map