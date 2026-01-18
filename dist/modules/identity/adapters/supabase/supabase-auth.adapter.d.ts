import { AuthProviderPort, AuthResponse } from '../../core/application/ports/auth-provider.port';
export declare class SupabaseAuthAdapter implements AuthProviderPort {
    private readonly supabase;
    private readonly supabaseAdmin;
    constructor();
    authenticate(email: string, password: string): Promise<AuthResponse>;
    createUser(email: string, password: string): Promise<AuthResponse>;
    refreshToken(refreshToken: string): Promise<AuthResponse>;
}
