export declare class Result<T> {
    private readonly _isSuccess;
    private readonly _value?;
    private readonly _error?;
    private constructor();
    static ok<T>(value: T): Result<T>;
    static fail<T>(error: Error): Result<T>;
    isSuccess(): boolean;
    isFailure(): boolean;
    getValue(): T;
    getError(): Error;
}
