export interface TokenServicePort {
    issue(userId: string): Promise<string>;
    validate(token: string): Promise<string>;
}
