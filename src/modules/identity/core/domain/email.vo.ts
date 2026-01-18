import { ValueObject } from '../../../../building-blocks/value-objects/value-object';

export class EmailVO extends ValueObject<string> {
  protected validate(): void {
    const value = this.value;
    if (!value || value.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error('Invalid email format');
    }
  }
}
