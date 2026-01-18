export interface QueueMessageMetadata {
  correlationId: string;
  receivedAt: string;
  module: string;
}

export interface QueueMessage {
  imageUrl: string;
  content?: string;
  notes?: string;
  metadata: QueueMessageMetadata;
}

export interface QueuePort {
  send(message: QueueMessage): Promise<void>;
}
