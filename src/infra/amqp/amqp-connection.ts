import * as amqp from 'amqplib';
import { ChannelModel, Channel } from 'amqplib';

export class AmqpConnection {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  constructor(
    private readonly amqpUrl: string,
    private readonly queueName: string,
  ) {}

  async ensureChannel(): Promise<Channel> {
    if (!this.connection) {
      this.connection = await amqp.connect(this.amqpUrl);
    }

    if (!this.channel) {
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: true });
    }

    return this.channel;
  }

  async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
      this.channel = null;
    }

    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }
}
