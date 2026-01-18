"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmqpQueueConsumerAdapter = void 0;
const common_1 = require("@nestjs/common");
const amqp_connection_1 = require("../../../../infra/amqp/amqp-connection");
const AMQP_URL = 'amqps://thpxegdg:v4LF0IPJftB-I3AtvGfs0ShZJwbcyDix@leopard.lmq.cloudamqp.com/thpxegdg';
const QUEUE_NAME = 'questions';
let AmqpQueueConsumerAdapter = class AmqpQueueConsumerAdapter {
    constructor(logger) {
        this.logger = logger;
        this.amqpConnection = new amqp_connection_1.AmqpConnection(AMQP_URL, QUEUE_NAME);
    }
    async consume(handler) {
        const channel = await this.amqpConnection.ensureChannel();
        await channel.prefetch(1);
        this.logger.info(`Starting to consume messages from queue: ${QUEUE_NAME}`, 'AmqpQueueConsumerAdapter');
        await channel.consume(QUEUE_NAME, async (msg) => {
            if (!msg) {
                return;
            }
            const startTime = Date.now();
            let message;
            try {
                const content = msg.content.toString();
                const messageSize = msg.content.length;
                try {
                    message = JSON.parse(content);
                }
                catch (parseError) {
                    const parseErrorMessage = parseError instanceof Error
                        ? parseError.message
                        : 'Unknown parse error';
                    const correlationId = msg.properties?.correlationId || 'unknown';
                    this.logger.error(`Failed to parse message from queue: queue=${QUEUE_NAME}, correlationId=${correlationId}, messageSize=${messageSize} bytes, error=${parseErrorMessage}`, parseError instanceof Error ? parseError.stack : undefined, 'AmqpQueueConsumerAdapter');
                    channel.nack(msg, false, false);
                    return;
                }
                if (!message) {
                    const correlationId = msg.properties?.correlationId || 'unknown';
                    this.logger.error(`Message is undefined after parsing: queue=${QUEUE_NAME}, correlationId=${correlationId}`, undefined, 'AmqpQueueConsumerAdapter');
                    channel.nack(msg, false, false);
                    return;
                }
                const parsedMessage = message;
                const correlationId = parsedMessage.metadata?.correlationId || 'unknown';
                this.logger.debug(`Received message from queue: queue=${QUEUE_NAME}, size=${messageSize} bytes, correlationId=${correlationId}`, 'AmqpQueueConsumerAdapter');
                await handler(parsedMessage);
                const processingTime = Date.now() - startTime;
                this.logger.info(`Message processed successfully: queue=${QUEUE_NAME}, correlationId=${correlationId}, processingTime=${processingTime}ms`, 'AmqpQueueConsumerAdapter');
                channel.ack(msg);
            }
            catch (error) {
                const processingTime = Date.now() - startTime;
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                const errorStack = error instanceof Error && error.stack ? error.stack : undefined;
                let errorCorrelationId;
                try {
                    errorCorrelationId =
                        message?.metadata?.correlationId ||
                            msg.properties?.correlationId ||
                            'unknown';
                }
                catch {
                    errorCorrelationId = msg.properties?.correlationId || 'unknown';
                }
                this.logger.error(`Error processing message from queue: queue=${QUEUE_NAME}, correlationId=${errorCorrelationId}, error=${errorMessage}, processingTime=${processingTime}ms`, errorStack, 'AmqpQueueConsumerAdapter');
                channel.nack(msg, false, true);
            }
        });
    }
};
exports.AmqpQueueConsumerAdapter = AmqpQueueConsumerAdapter;
exports.AmqpQueueConsumerAdapter = AmqpQueueConsumerAdapter = __decorate([
    __param(0, (0, common_1.Inject)('Logger')),
    __metadata("design:paramtypes", [Object])
], AmqpQueueConsumerAdapter);
//# sourceMappingURL=amqp-queue-consumer.adapter.js.map