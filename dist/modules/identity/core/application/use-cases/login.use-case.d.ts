import { Result } from '../../../../../building-blocks/result/result';
import { AuthProviderPort, AuthResponse } from '../ports/auth-provider.port';
export interface LoginRequest {
    email: string;
    password: string;
}
export declare class LoginUseCase {
    private readonly authProvider;
    constructor(authProvider: AuthProviderPort);
    execute(request: LoginRequest): Promise<Result<AuthResponse>>;
}
