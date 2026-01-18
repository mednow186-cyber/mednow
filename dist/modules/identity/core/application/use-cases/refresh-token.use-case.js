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
exports.RefreshTokenUseCase = void 0;
const common_1 = require("@nestjs/common");
const result_1 = require("../../../../../building-blocks/result/result");
let RefreshTokenUseCase = class RefreshTokenUseCase {
    constructor(authProvider) {
        this.authProvider = authProvider;
    }
    async execute(request) {
        if (!request.refreshToken || typeof request.refreshToken !== 'string') {
            return result_1.Result.fail(new Error('Refresh token is required and must be a string'));
        }
        if (request.refreshToken.trim().length === 0) {
            return result_1.Result.fail(new Error('Refresh token cannot be empty'));
        }
        try {
            const authResponse = await this.authProvider.refreshToken(request.refreshToken);
            return result_1.Result.ok(authResponse);
        }
        catch (error) {
            return result_1.Result.fail(error instanceof Error ? error : new Error('Token refresh failed'));
        }
    }
};
exports.RefreshTokenUseCase = RefreshTokenUseCase;
exports.RefreshTokenUseCase = RefreshTokenUseCase = __decorate([
    __param(0, (0, common_1.Inject)('AuthProviderPort')),
    __metadata("design:paramtypes", [Object])
], RefreshTokenUseCase);
//# sourceMappingURL=refresh-token.use-case.js.map