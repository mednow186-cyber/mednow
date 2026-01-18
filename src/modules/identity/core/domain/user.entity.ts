import { EmailVO } from './email.vo';
import { UserIdVO } from './user-id.vo';

export class User {
  constructor(
    private readonly _id: UserIdVO,
    private readonly _email: EmailVO,
  ) {}

  get id(): UserIdVO {
    return this._id;
  }

  get email(): EmailVO {
    return this._email;
  }
}
