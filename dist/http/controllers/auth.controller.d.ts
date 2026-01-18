import { LoginUseCase } from '../../modules/identity/core/application/use-cases/login.use-case';
import { CreateUserUseCase } from '../../modules/identity/core/application/use-cases/create-user.use-case';
import { RefreshTokenUseCase } from '../../modules/identity/core/application/use-cases/refresh-token.use-case';
import { LoginRequestDto } from '../dtos/login-request.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { CreateUserRequestDto } from '../dtos/create-user-request.dto';
import { CreateUserResponseDto } from '../dtos/create-user-response.dto';
import { RefreshTokenRequestDto } from '../dtos/refresh-token-request.dto';
import { RefreshTokenResponseDto } from '../dtos/refresh-token-response.dto';
export declare class AuthController {
    private readonly loginUseCase;
    private readonly createUserUseCase;
    private readonly refreshTokenUseCase;
    constructor(loginUseCase: LoginUseCase, createUserUseCase: CreateUserUseCase, refreshTokenUseCase: RefreshTokenUseCase);
    login(request: LoginRequestDto): Promise<LoginResponseDto>;
    register(request: CreateUserRequestDto): Promise<CreateUserResponseDto>;
    refresh(request: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto>;
}
