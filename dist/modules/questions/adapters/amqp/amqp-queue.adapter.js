"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmqpQueueAdapter = void 0;
const amqp_connection_1 = require("../../../../infra/amqp/amqp-connection");
const AMQP_URL = 'amqps://thpxegdg:v4LF0IPJftB-I3AtvGfs0ShZJwbcyDix@leopard.lmq.cloudamqp.com/thpxegdg';
const QUEUE_NAME = 'questions';
class AmqpQueueAdapter {
    constructor() {
        this.amqpConnection = new amqp_connection_1.AmqpConnection(AMQP_URL, QUEUE_NAME);
    }
    async send(message) {
        const channel = await this.amqpConnection.ensureChannel();
        const buffer = Buffer.from(JSON.stringify(message));
        channel.sendToQueue(QUEUE_NAME, buffer, { persistent: true });
    }
}
exports.AmqpQueueAdapter = AmqpQueueAdapter;
//# sourceMappingURL=amqp-queue.adapter.js.map