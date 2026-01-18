import { Result } from '../../../../../building-blocks/result/result';
import { AuthProviderPort, AuthResponse } from '../ports/auth-provider.port';
export interface RefreshTokenRequest {
    refreshToken: string;
}
export declare class RefreshTokenUseCase {
    private readonly authProvider;
    constructor(authProvider: AuthProviderPort);
    execute(request: RefreshTokenRequest): Promise<Result<AuthResponse>>;
}
