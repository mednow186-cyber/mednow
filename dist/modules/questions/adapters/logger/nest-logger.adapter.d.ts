import { Logger } from '../../../../building-blocks/observability/logger.interface';
export declare class NestLoggerAdapter implements Logger {
    private readonly logger;
    constructor(context?: string);
    info(message: string, context?: string): void;
    error(message: string, trace?: string, context?: string): void;
    warn(message: string, context?: string): void;
    debug(message: string, context?: string): void;
}
