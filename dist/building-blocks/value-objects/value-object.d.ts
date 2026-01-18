export declare abstract class ValueObject<T> {
    protected readonly _value: T;
    constructor(value: T);
    protected abstract validate(): void;
    get value(): T;
    equals(other: ValueObject<T>): boolean;
}
