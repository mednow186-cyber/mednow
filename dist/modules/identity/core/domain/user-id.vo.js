"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIdVO = void 0;
const value_object_1 = require("../../../../building-blocks/value-objects/value-object");
class UserIdVO extends value_object_1.ValueObject {
    validate() {
        const value = this.value;
        if (!value || value.trim().length === 0) {
            throw new Error('User ID cannot be empty');
        }
    }
}
exports.UserIdVO = UserIdVO;
//# sourceMappingURL=user-id.vo.js.map