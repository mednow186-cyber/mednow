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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const login_use_case_1 = require("../../modules/identity/core/application/use-cases/login.use-case");
const create_user_use_case_1 = require("../../modules/identity/core/application/use-cases/create-user.use-case");
const refresh_token_use_case_1 = require("../../modules/identity/core/application/use-cases/refresh-token.use-case");
const login_request_dto_1 = require("../dtos/login-request.dto");
const login_response_dto_1 = require("../dtos/login-response.dto");
const create_user_request_dto_1 = require("../dtos/create-user-request.dto");
const create_user_response_dto_1 = require("../dtos/create-user-response.dto");
const refresh_token_request_dto_1 = require("../dtos/refresh-token-request.dto");
const refresh_token_response_dto_1 = require("../dtos/refresh-token-response.dto");
let AuthController = class AuthController {
    constructor(loginUseCase, createUserUseCase, refreshTokenUseCase) {
        this.loginUseCase = loginUseCase;
        this.createUserUseCase = createUserUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
    }
    async login(request) {
        const result = await this.loginUseCase.execute(request);
        if (result.isFailure()) {
            const error = result.getError();
            if (error.message.includes('Authentication failed') ||
                error.message.includes('Invalid')) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.UNAUTHORIZED);
            }
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
        return result.getValue();
    }
    async register(request) {
        const result = await this.createUserUseCase.execute(request);
        if (result.isFailure()) {
            const error = result.getError();
            if (error.message.includes('already exists') || error.message.includes('already registered')) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
        return result.getValue();
    }
    async refresh(request) {
        const result = await this.refreshTokenUseCase.execute(request);
        if (result.isFailure()) {
            const error = result.getError();
            if (error.message.includes('Token refresh failed') ||
                error.message.includes('Invalid') ||
                error.message.includes('expired')) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.UNAUTHORIZED);
            }
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
        return result.getValue();
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Fazer login',
        description: 'Autentica um usuário com email e senha',
    }),
    (0, swagger_1.ApiBody)({ type: login_request_dto_1.LoginRequestDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login realizado com sucesso',
        type: login_response_dto_1.LoginResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Dados inválidos fornecidos',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Credenciais inválidas',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Erro interno do servidor',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_request_dto_1.LoginRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Criar novo usuário',
        description: 'Registra um novo usuário no sistema',
    }),
    (0, swagger_1.ApiBody)({ type: create_user_request_dto_1.CreateUserRequestDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Usuário criado com sucesso',
        type: create_user_response_dto_1.CreateUserResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Dados inválidos fornecidos',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Usuário já existe',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Erro interno do servidor',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_request_dto_1.CreateUserRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Renovar token de acesso',
        description: 'Renova o token de acesso usando o refresh token',
    }),
    (0, swagger_1.ApiBody)({ type: refresh_token_request_dto_1.RefreshTokenRequestDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token renovado com sucesso',
        type: refresh_token_response_dto_1.RefreshTokenResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Token inválido ou expirado',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Refresh token inválido',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Erro interno do servidor',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_request_dto_1.RefreshTokenRequestDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [login_use_case_1.LoginUseCase,
        create_user_use_case_1.CreateUserUseCase,
        refresh_token_use_case_1.RefreshTokenUseCase])
], AuthController);
//# sourceMappingURL=auth.controller.js.map