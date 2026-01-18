import { Inject } from '@nestjs/common';
import { QueueConsumerPort } from '../../core/application/ports/queue-consumer.port';
import { QueueMessage } from '../../core/application/ports/queue.port';
import { AmqpConnection } from '../../../../infra/amqp/amqp-connection';
import { Logger } from '../../../../building-blocks/observability/logger.interface';

const AMQP_URL =
  'amqps://thpxegdg:v4LF0IPJftB-I3AtvGfs0ShZJwbcyDix@leopard.lmq.cloudamqp.com/thpxegdg';
const QUEUE_NAME = 'questions';

export class AmqpQueueConsumerAdapter implements QueueConsumerPort {
  private readonly amqpConnection: AmqpConnection;

  constructor(
    @Inject('Logger')
    private readonly logger: Logger,
  ) {
    this.amqpConnection = new AmqpConnection(AMQP_URL, QUEUE_NAME);
  }

  async consume(
    handler: (message: QueueMessage) => Promise<void>,
  ): Promise<void> {
    const channel = await this.amqpConnection.ensureChannel();

    await channel.prefetch(1);

    this.logger.info(
      `Starting to consume messages from queue: ${QUEUE_NAME}`,
      'AmqpQueueConsumerAdapter',
    );

    await channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) {
        return;
      }

      const startTime = Date.now();
      let message: QueueMessage | undefined;

      try {
        const content = msg.content.toString();
        const messageSize = msg.content.length;

        try {
          message = JSON.parse(content) as QueueMessage;
        } catch (parseError) {
          const parseErrorMessage =
            parseError instanceof Error
              ? parseError.message
              : 'Unknown parse error';
          const correlationId = msg.properties?.correlationId || 'unknown';
          this.logger.error(
            `Failed to parse message from queue: queue=${QUEUE_NAME}, correlationId=${correlationId}, messageSize=${messageSize} bytes, error=${parseErrorMessage}`,
            parseError instanceof Error ? parseError.stack : undefined,
            'AmqpQueueConsumerAdapter',
          );
          channel.nack(msg, false, false);
          return;
        }

        if (!message) {
          const correlationId = msg.properties?.correlationId || 'unknown';
          this.logger.error(
            `Message is undefined after parsing: queue=${QUEUE_NAME}, correlationId=${correlationId}`,
            undefined,
            'AmqpQueueConsumerAdapter',
          );
          channel.nack(msg, false, false);
          return;
        }

        const parsedMessage: QueueMessage = message;
        const correlationId = parsedMessage.metadata?.correlationId || 'unknown';

        this.logger.debug(
          `Received message from queue: queue=${QUEUE_NAME}, size=${messageSize} bytes, correlationId=${correlationId}`,
          'AmqpQueueConsumerAdapter',
        );

        await handler(parsedMessage);

        const processingTime = Date.now() - startTime;
        this.logger.info(
          `Message processed successfully: queue=${QUEUE_NAME}, correlationId=${correlationId}, processingTime=${processingTime}ms`,
          'AmqpQueueConsumerAdapter',
        );

        channel.ack(msg);
      } catch (error) {
        const processingTime = Date.now() - startTime;
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        const errorStack =
          error instanceof Error && error.stack ? error.stack : undefined;

        let errorCorrelationId: string;
        try {
          errorCorrelationId =
            message?.metadata?.correlationId ||
            msg.properties?.correlationId ||
            'unknown';
        } catch {
          errorCorrelationId = msg.properties?.correlationId || 'unknown';
        }

        this.logger.error(
          `Error processing message from queue: queue=${QUEUE_NAME}, correlationId=${errorCorrelationId}, error=${errorMessage}, processingTime=${processingTime}ms`,
          errorStack,
          'AmqpQueueConsumerAdapter',
        );

        channel.nack(msg, false, true);
      }
    });
  }
}
