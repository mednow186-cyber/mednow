import { Inject } from '@nestjs/common';
import { Result } from '../../../../../building-blocks/result/result';
import { AuthProviderPort, AuthResponse } from '../ports/auth-provider.port';
import { EmailVO } from '../../domain/email.vo';

export interface LoginRequest {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    @Inject('AuthProviderPort')
    private readonly authProvider: AuthProviderPort,
  ) {}

  async execute(request: LoginRequest): Promise<Result<AuthResponse>> {
    if (!request.email || typeof request.email !== 'string') {
      return Result.fail(new Error('Email is required and must be a string'));
    }

    if (!request.password || typeof request.password !== 'string') {
      return Result.fail(
        new Error('Password is required and must be a string'),
      );
    }

    try {
      const emailVO = new EmailVO(request.email);
      const authResponse = await this.authProvider.authenticate(
        emailVO.value,
        request.password,
      );

      return Result.ok(authResponse);
    } catch (error) {
      return Result.fail(
        error instanceof Error
          ? error
          : new Error('Authentication failed'),
      );
    }
  }
}
