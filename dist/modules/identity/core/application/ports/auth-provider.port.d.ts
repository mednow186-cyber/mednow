export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    userId: string;
}
export interface AuthProviderPort {
    authenticate(email: string, password: string): Promise<AuthResponse>;
    createUser(email: string, password: string): Promise<AuthResponse>;
    refreshToken(refreshToken: string): Promise<AuthResponse>;
}
