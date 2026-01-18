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
exports.CreateUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const result_1 = require("../../../../../building-blocks/result/result");
const email_vo_1 = require("../../domain/email.vo");
let CreateUserUseCase = class CreateUserUseCase {
    constructor(authProvider) {
        this.authProvider = authProvider;
    }
    async execute(request) {
        if (!request.email || typeof request.email !== 'string') {
            return result_1.Result.fail(new Error('Email is required and must be a string'));
        }
        if (!request.password || typeof request.password !== 'string') {
            return result_1.Result.fail(new Error('Password is required and must be a string'));
        }
        if (request.password.length < 6) {
            return result_1.Result.fail(new Error('Password must be at least 6 characters long'));
        }
        try {
            const emailVO = new email_vo_1.EmailVO(request.email);
            const authResponse = await this.authProvider.createUser(emailVO.value, request.password);
            return result_1.Result.ok(authResponse);
        }
        catch (error) {
            return result_1.Result.fail(error instanceof Error ? error : new Error('User creation failed'));
        }
    }
};
exports.CreateUserUseCase = CreateUserUseCase;
exports.CreateUserUseCase = CreateUserUseCase = __decorate([
    __param(0, (0, common_1.Inject)('AuthProviderPort')),
    __metadata("design:paramtypes", [Object])
], CreateUserUseCase);
//# sourceMappingURL=create-user.use-case.js.map