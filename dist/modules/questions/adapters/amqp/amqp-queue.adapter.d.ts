import { QueuePort, QueueMessage } from '../../core/application/ports/queue.port';
export declare class AmqpQueueAdapter implements QueuePort {
    private readonly amqpConnection;
    constructor();
    send(message: QueueMessage): Promise<void>;
}
