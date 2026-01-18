import { createClient } from '@supabase/supabase-js';
import { AuthProviderPort, AuthResponse } from '../../core/application/ports/auth-provider.port';

export class SupabaseAuthAdapter implements AuthProviderPort {
  private readonly supabase;
  private readonly supabaseAdmin;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set');
    }

    this.supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Cliente admin é obrigatório para criar usuários já confirmados
    if (!supabaseServiceRoleKey) {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY must be set to enable auto-confirmation of users. Get it from Supabase Dashboard → Settings → API → service_role key (secret)',
      );
    }

    this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async authenticate(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }

    if (!data.session || !data.user) {
      throw new Error('Authentication failed: Invalid response from Supabase');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      userId: data.user.id,
    };
  }

  async createUser(email: string, password: string): Promise<AuthResponse> {
    // Sempre usa Admin API para criar usuário já confirmado
    const { data: adminData, error: adminError } =
      await this.supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (adminError) {
      throw new Error(`User creation failed: ${adminError.message}`);
    }

    if (!adminData.user) {
      throw new Error('User creation failed: Invalid response from Supabase');
    }

    // Aguarda um momento para garantir que o usuário está pronto
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Após criar com admin, faz login normal para obter tokens
    const signInResult = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInResult.error) {
      throw new Error(
        `User created but login failed: ${signInResult.error.message}`,
      );
    }

    if (!signInResult.data.session || !signInResult.data.user) {
      throw new Error('User created but failed to obtain session');
    }

    return {
      accessToken: signInResult.data.session.access_token,
      refreshToken: signInResult.data.session.refresh_token,
      userId: signInResult.data.user.id,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }

    if (!data.session || !data.user) {
      throw new Error('Token refresh failed: Invalid response from Supabase');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      userId: data.user.id,
    };
  }
}
