"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestLoggerAdapter = void 0;
const common_1 = require("@nestjs/common");
class NestLoggerAdapter {
    constructor(context) {
        this.logger = new common_1.Logger(context || 'QuestionsModule');
    }
    info(message, context) {
        this.logger.log(message, context);
    }
    error(message, trace, context) {
        this.logger.error(message, trace, context);
    }
    warn(message, context) {
        this.logger.warn(message, context);
    }
    debug(message, context) {
        this.logger.debug(message, context);
    }
}
exports.NestLoggerAdapter = NestLoggerAdapter;
//# sourceMappingURL=nest-logger.adapter.js.map