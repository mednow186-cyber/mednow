import { Inject } from '@nestjs/common';
import { Result } from '../../../../../building-blocks/result/result';
import { AuthProviderPort, AuthResponse } from '../ports/auth-provider.port';

export interface RefreshTokenRequest {
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    @Inject('AuthProviderPort')
    private readonly authProvider: AuthProviderPort,
  ) {}

  async execute(
    request: RefreshTokenRequest,
  ): Promise<Result<AuthResponse>> {
    if (!request.refreshToken || typeof request.refreshToken !== 'string') {
      return Result.fail(
        new Error('Refresh token is required and must be a string'),
      );
    }

    if (request.refreshToken.trim().length === 0) {
      return Result.fail(new Error('Refresh token cannot be empty'));
    }

    try {
      const authResponse = await this.authProvider.refreshToken(
        request.refreshToken,
      );

      return Result.ok(authResponse);
    } catch (error) {
      return Result.fail(
        error instanceof Error ? error : new Error('Token refresh failed'),
      );
    }
  }
}
