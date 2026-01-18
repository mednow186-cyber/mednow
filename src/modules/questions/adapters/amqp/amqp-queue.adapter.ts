import { QueuePort, QueueMessage } from '../../core/application/ports/queue.port';
import { AmqpConnection } from '../../../../infra/amqp/amqp-connection';

const AMQP_URL =
  'amqps://thpxegdg:v4LF0IPJftB-I3AtvGfs0ShZJwbcyDix@leopard.lmq.cloudamqp.com/thpxegdg';
const QUEUE_NAME = 'questions';

export class AmqpQueueAdapter implements QueuePort {
  private readonly amqpConnection: AmqpConnection;

  constructor() {
    this.amqpConnection = new AmqpConnection(AMQP_URL, QUEUE_NAME);
  }

  async send(message: QueueMessage): Promise<void> {
    const channel = await this.amqpConnection.ensureChannel();

    const buffer = Buffer.from(JSON.stringify(message));
    channel.sendToQueue(QUEUE_NAME, buffer, { persistent: true });
  }
}
