import { Inject } from '@nestjs/common';
import { Result } from '../../../../../building-blocks/result/result';
import { AuthProviderPort, AuthResponse } from '../ports/auth-provider.port';
import { EmailVO } from '../../domain/email.vo';

export interface CreateUserRequest {
  email: string;
  password: string;
}

export class CreateUserUseCase {
  constructor(
    @Inject('AuthProviderPort')
    private readonly authProvider: AuthProviderPort,
  ) {}

  async execute(request: CreateUserRequest): Promise<Result<AuthResponse>> {
    if (!request.email || typeof request.email !== 'string') {
      return Result.fail(new Error('Email is required and must be a string'));
    }

    if (!request.password || typeof request.password !== 'string') {
      return Result.fail(
        new Error('Password is required and must be a string'),
      );
    }

    if (request.password.length < 6) {
      return Result.fail(
        new Error('Password must be at least 6 characters long'),
      );
    }

    try {
      const emailVO = new EmailVO(request.email);
      const authResponse = await this.authProvider.createUser(
        emailVO.value,
        request.password,
      );

      return Result.ok(authResponse);
    } catch (error) {
      return Result.fail(
        error instanceof Error ? error : new Error('User creation failed'),
      );
    }
  }
}
