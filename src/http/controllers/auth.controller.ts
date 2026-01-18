import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { LoginUseCase } from '../../modules/identity/core/application/use-cases/login.use-case';
import { CreateUserUseCase } from '../../modules/identity/core/application/use-cases/create-user.use-case';
import { RefreshTokenUseCase } from '../../modules/identity/core/application/use-cases/refresh-token.use-case';
import { LoginRequestDto } from '../dtos/login-request.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { CreateUserRequestDto } from '../dtos/create-user-request.dto';
import { CreateUserResponseDto } from '../dtos/create-user-response.dto';
import { RefreshTokenRequestDto } from '../dtos/refresh-token-request.dto';
import { RefreshTokenResponseDto } from '../dtos/refresh-token-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Fazer login',
    description: 'Autentica um usuário com email e senha',
  })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async login(@Body() request: LoginRequestDto): Promise<LoginResponseDto> {
    const result = await this.loginUseCase.execute(request);

    if (result.isFailure()) {
      const error = result.getError();
      if (
        error.message.includes('Authentication failed') ||
        error.message.includes('Invalid')
      ) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return result.getValue();
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo usuário',
    description: 'Registra um novo usuário no sistema',
  })
  @ApiBody({ type: CreateUserRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: CreateUserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Usuário já existe',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async register(
    @Body() request: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const result = await this.createUserUseCase.execute(request);

    if (result.isFailure()) {
      const error = result.getError();
      if (error.message.includes('already exists') || error.message.includes('already registered')) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return result.getValue();
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renovar token de acesso',
    description: 'Renova o token de acesso usando o refresh token',
  })
  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Token renovado com sucesso',
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido ou expirado',
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async refresh(
    @Body() request: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    const result = await this.refreshTokenUseCase.execute(request);

    if (result.isFailure()) {
      const error = result.getError();
      if (
        error.message.includes('Token refresh failed') ||
        error.message.includes('Invalid') ||
        error.message.includes('expired')
      ) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return result.getValue();
  }
}
