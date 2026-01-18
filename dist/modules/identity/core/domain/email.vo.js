"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVO = void 0;
const value_object_1 = require("../../../../building-blocks/value-objects/value-object");
class EmailVO extends value_object_1.ValueObject {
    validate() {
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
exports.EmailVO = EmailVO;
//# sourceMappingURL=email.vo.js.map