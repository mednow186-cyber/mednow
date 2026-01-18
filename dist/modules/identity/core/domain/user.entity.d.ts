import { EmailVO } from './email.vo';
import { UserIdVO } from './user-id.vo';
export declare class User {
    private readonly _id;
    private readonly _email;
    constructor(_id: UserIdVO, _email: EmailVO);
    get id(): UserIdVO;
    get email(): EmailVO;
}
