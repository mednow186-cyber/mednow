import { QueueConsumerPort } from '../../core/application/ports/queue-consumer.port';
import { QueueMessage } from '../../core/application/ports/queue.port';
import { Logger } from '../../../../building-blocks/observability/logger.interface';
export declare class AmqpQueueConsumerAdapter implements QueueConsumerPort {
    private readonly logger;
    private readonly amqpConnection;
    constructor(logger: Logger);
    consume(handler: (message: QueueMessage) => Promise<void>): Promise<void>;
}
