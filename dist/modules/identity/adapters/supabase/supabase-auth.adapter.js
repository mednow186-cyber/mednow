"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseAuthAdapter = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
class SupabaseAuthAdapter {
    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
        if (!supabaseServiceRoleKey) {
            throw new Error('SUPABASE_SERVICE_ROLE_KEY must be set to enable auto-confirmation of users. Get it from Supabase Dashboard → Settings → API → service_role key (secret)');
        }
        this.supabaseAdmin = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });
    }
    async authenticate(email, password) {
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
    async createUser(email, password) {
        const { data: adminData, error: adminError } = await this.supabaseAdmin.auth.admin.createUser({
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
        await new Promise((resolve) => setTimeout(resolve, 300));
        const signInResult = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (signInResult.error) {
            throw new Error(`User created but login failed: ${signInResult.error.message}`);
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
    async refreshToken(refreshToken) {
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
exports.SupabaseAuthAdapter = SupabaseAuthAdapter;
//# sourceMappingURL=supabase-auth.adapter.js.map