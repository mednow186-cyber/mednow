"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloWorldUseCase = void 0;
const result_1 = require("../../../../../building-blocks/result/result");
class HelloWorldUseCase {
    execute() {
        return result_1.Result.ok('Hello World');
    }
}
exports.HelloWorldUseCase = HelloWorldUseCase;
//# sourceMappingURL=hello-world.use-case.js.map