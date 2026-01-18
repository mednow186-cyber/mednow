"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueObject = void 0;
class ValueObject {
    constructor(value) {
        this._value = value;
        this.validate();
    }
    get value() {
        return this._value;
    }
    equals(other) {
        return JSON.stringify(this._value) === JSON.stringify(other._value);
    }
}
exports.ValueObject = ValueObject;
//# sourceMappingURL=value-object.js.map