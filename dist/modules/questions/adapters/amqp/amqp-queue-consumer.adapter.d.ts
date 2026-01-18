import { QueueConsumerPort } from '../../core/application/ports/queue-consumer.port';
import { QueueMessage } from '../../core/application/ports/queue.port';
export declare class AmqpQueueConsumerAdapter implements QueueConsumerPort {
    private readonly amqpConnection;
    constructor();
    consume(handler: (message: QueueMessage) => Promise<void>): Promise<void>;
}
