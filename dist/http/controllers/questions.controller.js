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
exports.QuestionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const process_questions_use_case_1 = require("../../modules/questions/core/application/use-cases/process-questions.use-case");
const get_questions_use_case_1 = require("../../modules/questions/core/application/use-cases/get-questions.use-case");
const update_question_use_case_1 = require("../../modules/questions/core/application/use-cases/update-question.use-case");
const create_questions_request_dto_1 = require("../dtos/create-questions-request.dto");
const create_questions_response_dto_1 = require("../dtos/create-questions-response.dto");
const update_question_request_dto_1 = require("../dtos/update-question-request.dto");
const question_processing_response_dto_1 = require("../dtos/question-processing-response.dto");
let QuestionsController = class QuestionsController {
    constructor(processQuestionsUseCase, getQuestionsUseCase, updateQuestionUseCase) {
        this.processQuestionsUseCase = processQuestionsUseCase;
        this.getQuestionsUseCase = getQuestionsUseCase;
        this.updateQuestionUseCase = updateQuestionUseCase;
    }
    async create(request) {
        const result = await this.processQuestionsUseCase.execute(request);
        if (result.isFailure()) {
            throw result.getError();
        }
        return {
            success: true,
            messagesCount: result.getValue(),
        };
    }
    async findAll() {
        const result = await this.getQuestionsUseCase.findAll();
        if (result.isFailure()) {
            throw new common_1.HttpException(result.getError().message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const questions = result.getValue();
        return questions.map((question) => this.mapToResponseDto(question));
    }
    async findById(id) {
        const result = await this.getQuestionsUseCase.findById(id);
        if (result.isFailure()) {
            throw new common_1.HttpException(result.getError().message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const question = result.getValue();
        if (!question) {
            throw new common_1.HttpException('Question not found', common_1.HttpStatus.NOT_FOUND);
        }
        return this.mapToResponseDto(question);
    }
    async update(id, updateDto) {
        const result = await this.updateQuestionUseCase.execute({
            id,
            ...updateDto,
        });
        if (result.isFailure()) {
            const error = result.getError();
            if (error.message === 'Question not found') {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
        const updatedQuestion = result.getValue();
        return this.mapToResponseDto(updatedQuestion);
    }
    mapToResponseDto(question) {
        return {
            _id: question._id || '',
            source: question.source,
            raw_text: question.raw_text,
            processing: {
                status: question.processing.status,
                classifiedAt: question.processing.classifiedAt?.toISOString(),
                model: question.processing.model,
            },
            questions: question.questions.map((q) => ({
                questionNumber: q.questionNumber,
                type: q.type,
                question: {
                    text: q.question.text,
                    alternatives: q.question.alternatives.map((alt) => ({
                        letter: alt.letter,
                        text: alt.text,
                    })),
                },
                answer: {
                    letter: q.answer.letter,
                    text: q.answer.text,
                    explanation: q.answer.explanation,
                    source: q.answer.source,
                },
                classification: q.classification
                    ? {
                        area: q.classification.area,
                        subarea: q.classification.subarea,
                        theme: q.classification.theme,
                        difficulty: q.classification.difficulty,
                        keywords: q.classification.keywords,
                    }
                    : undefined,
                processing: {
                    status: q.processing.status,
                    error: q.processing.error,
                },
            })),
        };
    }
};
exports.QuestionsController = QuestionsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Processar questões',
        description: 'Envia questões para processamento via fila AMQP',
    }),
    (0, swagger_1.ApiBody)({ type: create_questions_request_dto_1.CreateQuestionsRequestDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Questões enviadas para processamento com sucesso',
        type: create_questions_response_dto_1.CreateQuestionsResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Requisição inválida',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Erro interno do servidor',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_questions_request_dto_1.CreateQuestionsRequestDto]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar todas as questões',
        description: 'Retorna todas as questões processadas da collection questions_processing',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de questões retornada com sucesso',
        type: [question_processing_response_dto_1.QuestionProcessingResponseDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Erro interno do servidor',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Buscar questão por ID',
        description: 'Retorna uma questão específica pelo seu ID da collection questions_processing',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID da questão',
        example: '696d15d7d5eb39e8296e120b',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Questão encontrada com sucesso',
        type: question_processing_response_dto_1.QuestionProcessingResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Questão não encontrada',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Erro interno do servidor',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Atualizar questão',
        description: 'Atualiza uma questão existente pelo seu ID na collection questions_processing',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID da questão a ser atualizada',
        example: '696d15d7d5eb39e8296e120b',
    }),
    (0, swagger_1.ApiBody)({ type: update_question_request_dto_1.UpdateQuestionRequestDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Questão atualizada com sucesso',
        type: question_processing_response_dto_1.QuestionProcessingResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Dados inválidos fornecidos',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Questão não encontrada',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Erro interno do servidor',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_question_request_dto_1.UpdateQuestionRequestDto]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "update", null);
exports.QuestionsController = QuestionsController = __decorate([
    (0, swagger_1.ApiTags)('questions'),
    (0, common_1.Controller)('questions'),
    __metadata("design:paramtypes", [process_questions_use_case_1.ProcessQuestionsUseCase,
        get_questions_use_case_1.GetQuestionsUseCase,
        update_question_use_case_1.UpdateQuestionUseCase])
], QuestionsController);
//# sourceMappingURL=questions.controller.js.map