import { AuthProviderPort } from '../../core/application/ports/auth-provider.port';
export declare class SupabaseAuthAdapter implements AuthProviderPort {
    authenticate(email: string, password: string): Promise<string>;
}
