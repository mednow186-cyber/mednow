import { Result } from '../../../../../building-blocks/result/result';
import { AuthProviderPort, AuthResponse } from '../ports/auth-provider.port';
export interface CreateUserRequest {
    email: string;
    password: string;
}
export declare class CreateUserUseCase {
    private readonly authProvider;
    constructor(authProvider: AuthProviderPort);
    execute(request: CreateUserRequest): Promise<Result<AuthResponse>>;
}
