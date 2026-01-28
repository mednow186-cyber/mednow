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
exports.QuestionProcessingSchema = exports.QuestionProcessing = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let QuestionProcessing = class QuestionProcessing {
};
exports.QuestionProcessing = QuestionProcessing;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], QuestionProcessing.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], QuestionProcessing.prototype, "raw_text", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            status: {
                type: String,
                enum: ['pending', 'classified', 'partial'],
                required: true,
            },
            classifiedAt: Date,
            model: String,
        },
        required: true,
    }),
    __metadata("design:type", Object)
], QuestionProcessing.prototype, "processing", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                questionNumber: { type: Number, required: true },
                type: {
                    type: String,
                    enum: ['multiple_choice', 'descriptive'],
                    required: true,
                },
                question: {
                    text: { type: String, required: true },
                    alternatives: [
                        {
                            letter: { type: String, required: true },
                            text: { type: String, required: true },
                        },
                    ],
                },
                answer: {
                    letter: { type: String, default: null },
                    text: { type: String, default: null },
                    explanation: { type: String, default: null },
                    source: {
                        type: String,
                        enum: ['official_gabarito', 'not_found'],
                        required: true,
                    },
                },
                classification: {
                    area: String,
                    subarea: String,
                    theme: String,
                    difficulty: {
                        type: String,
                        enum: ['easy', 'medium', 'hard'],
                    },
                    keywords: [String],
                },
                processing: {
                    status: {
                        type: String,
                        enum: ['classified', 'classification_error'],
                        required: true,
                    },
                    error: { type: String, default: null },
                },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], QuestionProcessing.prototype, "questions", void 0);
exports.QuestionProcessing = QuestionProcessing = __decorate([
    (0, mongoose_1.Schema)({ collection: 'questions_processing' })
], QuestionProcessing);
exports.QuestionProcessingSchema = mongoose_1.SchemaFactory.createForClass(QuestionProcessing);
//# sourceMappingURL=question-processing.schema.js.map