"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const http_module_1 = require("./http/http.module");
const identity_module_1 = require("./modules/identity/identity.module");
const questions_module_1 = require("./modules/questions/questions.module");
function getQuestionsDbUri() {
    const baseUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const uriWithoutDb = baseUri.replace(/\/[^/]*$/, '');
    return `${uriWithoutDb}/questions_db`;
}
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/questions'),
            mongoose_1.MongooseModule.forRoot(getQuestionsDbUri(), {
                connectionName: 'questions_db',
            }),
            http_module_1.HttpModule,
            identity_module_1.IdentityModule,
            questions_module_1.QuestionsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map