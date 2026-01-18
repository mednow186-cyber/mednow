import { Channel } from 'amqplib';
export declare class AmqpConnection {
    private readonly amqpUrl;
    private readonly queueName;
    private connection;
    private channel;
    constructor(amqpUrl: string, queueName: string);
    ensureChannel(): Promise<Channel>;
    close(): Promise<void>;
}
