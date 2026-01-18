"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(_id, _email) {
        this._id = _id;
        this._email = _email;
    }
    get id() {
        return this._id;
    }
    get email() {
        return this._email;
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map