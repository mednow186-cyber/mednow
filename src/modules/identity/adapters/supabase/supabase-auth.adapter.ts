import { AuthProviderPort } from '../../core/application/ports/auth-provider.port';

export class SupabaseAuthAdapter implements AuthProviderPort {
  async authenticate(email: string, password: string): Promise<string> {
    throw new Error('Not implemented');
  }
}
