import { ValueObject } from '../../../../building-blocks/value-objects/value-object';

export class UserIdVO extends ValueObject<string> {
  protected validate(): void {
    const value = this.value;
    if (!value || value.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
  }
}
