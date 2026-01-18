"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmqpQueueConsumerAdapter = void 0;
const amqp_connection_1 = require("../../../../infra/amqp/amqp-connection");
const AMQP_URL = 'amqps://thpxegdg:v4LF0IPJftB-I3AtvGfs0ShZJwbcyDix@leopard.lmq.cloudamqp.com/thpxegdg';
const QUEUE_NAME = 'questions';
class AmqpQueueConsumerAdapter {
    constructor() {
        this.amqpConnection = new amqp_connection_1.AmqpConnection(AMQP_URL, QUEUE_NAME);
    }
    async consume(handler) {
        const channel = await this.amqpConnection.ensureChannel();
        await channel.prefetch(1);
        await channel.consume(QUEUE_NAME, async (msg) => {
            if (!msg) {
                return;
            }
            try {
                const content = msg.content.toString();
                const message = JSON.parse(content);
                await handler(message);
                channel.ack(msg);
            }
            catch (error) {
                channel.nack(msg, false, true);
                throw error;
            }
        });
    }
}
exports.AmqpQueueConsumerAdapter = AmqpQueueConsumerAdapter;
//# sourceMappingURL=amqp-queue-consumer.adapter.js.map