export interface AuthProviderPort {
    authenticate(email: string, password: string): Promise<string>;
}
