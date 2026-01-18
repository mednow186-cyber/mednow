import { QueueMessage } from './queue.port';
export interface QueueConsumerPort {
    consume(handler: (message: QueueMessage) => Promise<void>): Promise<void>;
}
