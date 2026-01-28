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
exports.MongoQuestionsProcessingRepositoryAdapter = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const question_processing_schema_1 = require("./schemas/question-processing.schema");
let MongoQuestionsProcessingRepositoryAdapter = class MongoQuestionsProcessingRepositoryAdapter {
    constructor(questionProcessingModel) {
        this.questionProcessingModel = questionProcessingModel;
    }
    async save(questionProcessing) {
        const document = new this.questionProcessingModel({
            source: questionProcessing.source,
            raw_text: questionProcessing.raw_text,
            processing: questionProcessing.processing,
            questions: questionProcessing.questions,
        });
        await document.save();
    }
    async findAll() {
        const documents = await this.questionProcessingModel.find().exec();
        return documents.map((doc) => this.mapDocumentToQuestionProcessing(doc));
    }
    async findById(id) {
        const document = await this.questionProcessingModel.findById(id).exec();
        if (!document) {
            return null;
        }
        return this.mapDocumentToQuestionProcessing(document);
    }
    async update(id, updates) {
        const updateData = { ...updates };
        delete updateData._id;
        const document = await this.questionProcessingModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
        if (!document) {
            return null;
        }
        return this.mapDocumentToQuestionProcessing(document);
    }
    mapDocumentToQuestionProcessing(doc) {
        return {
            _id: doc._id.toString(),
            source: doc.source,
            raw_text: doc.raw_text,
            processing: {
                status: doc.processing.status,
                classifiedAt: doc.processing.classifiedAt,
                model: doc.processing.model,
            },
            questions: doc.questions.map((q) => ({
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
exports.MongoQuestionsProcessingRepositoryAdapter = MongoQuestionsProcessingRepositoryAdapter;
exports.MongoQuestionsProcessingRepositoryAdapter = MongoQuestionsProcessingRepositoryAdapter = __decorate([
    __param(0, (0, mongoose_1.InjectModel)(question_processing_schema_1.QuestionProcessing.name, 'questions_db')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MongoQuestionsProcessingRepositoryAdapter);
//# sourceMappingURL=mongo-questions-processing-repository.adapter.js.map