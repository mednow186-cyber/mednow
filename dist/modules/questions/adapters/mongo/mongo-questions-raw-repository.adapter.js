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
exports.MongoQuestionsRawRepositoryAdapter = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const question_raw_schema_1 = require("./schemas/question-raw.schema");
let MongoQuestionsRawRepositoryAdapter = class MongoQuestionsRawRepositoryAdapter {
    constructor(questionRawModel) {
        this.questionRawModel = questionRawModel;
    }
    async save(questionRaw) {
        const document = new this.questionRawModel({
            correlationId: questionRaw.correlationId,
            imageUrl: questionRaw.imageUrl,
            sourceType: questionRaw.sourceType,
            originalPayload: questionRaw.originalPayload,
            gptResponse: questionRaw.gptResponse,
            status: questionRaw.status,
            createdAt: questionRaw.createdAt,
        });
        await document.save();
    }
    async findAll() {
        const documents = await this.questionRawModel.find().exec();
        return documents.map((doc) => this.mapDocumentToQuestionRaw(doc));
    }
    async findById(id) {
        const document = await this.questionRawModel.findById(id).exec();
        if (!document) {
            return null;
        }
        return this.mapDocumentToQuestionRaw(document);
    }
    async update(id, updates) {
        const updateData = { ...updates };
        delete updateData._id;
        delete updateData.correlationId;
        delete updateData.createdAt;
        const document = await this.questionRawModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
        if (!document) {
            return null;
        }
        return this.mapDocumentToQuestionRaw(document);
    }
    mapDocumentToQuestionRaw(doc) {
        return {
            _id: doc._id.toString(),
            correlationId: doc.correlationId,
            imageUrl: doc.imageUrl,
            sourceType: doc.sourceType,
            originalPayload: doc.originalPayload,
            gptResponse: doc.gptResponse,
            status: doc.status,
            createdAt: doc.createdAt,
        };
    }
};
exports.MongoQuestionsRawRepositoryAdapter = MongoQuestionsRawRepositoryAdapter;
exports.MongoQuestionsRawRepositoryAdapter = MongoQuestionsRawRepositoryAdapter = __decorate([
    __param(0, (0, mongoose_1.InjectModel)(question_raw_schema_1.QuestionRaw.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MongoQuestionsRawRepositoryAdapter);
//# sourceMappingURL=mongo-questions-raw-repository.adapter.js.map