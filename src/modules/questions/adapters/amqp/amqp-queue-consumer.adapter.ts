import { QueueConsumerPort } from '../../core/application/ports/queue-consumer.port';
import { QueueMessage } from '../../core/application/ports/queue.port';
import { AmqpConnection } from '../../../../infra/amqp/amqp-connection';

const AMQP_URL =
  'amqps://thpxegdg:v4LF0IPJftB-I3AtvGfs0ShZJwbcyDix@leopard.lmq.cloudamqp.com/thpxegdg';
const QUEUE_NAME = 'questions';

export class AmqpQueueConsumerAdapter implements QueueConsumerPort {
  private readonly amqpConnection: AmqpConnection;

  constructor() {
    this.amqpConnection = new AmqpConnection(AMQP_URL, QUEUE_NAME);
  }

  async consume(
    handler: (message: QueueMessage) => Promise<void>,
  ): Promise<void> {
    const channel = await this.amqpConnection.ensureChannel();

    await channel.prefetch(1);

    await channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) {
        return;
      }

      try {
        const content = msg.content.toString();
        const message: QueueMessage = JSON.parse(content);

        await handler(message);

        channel.ack(msg);
      } catch (error) {
        channel.nack(msg, false, true);
        throw error;
      }
    });
  }
}
