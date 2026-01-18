import { Logger as NestLogger } from '@nestjs/common';
import { Logger } from '../../../../building-blocks/observability/logger.interface';

export class NestLoggerAdapter implements Logger {
  private readonly logger: NestLogger;

  constructor(context?: string) {
    this.logger = new NestLogger(context || 'QuestionsModule');
  }

  info(message: string, context?: string): void {
    this.logger.log(message, context);
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, trace, context);
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, context);
  }
}
