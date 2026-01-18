import { QueueMessage } from './queue.port';

/**
 * Port para consumir mensagens da fila.
 *
 * Contrato ACK/NACK:
 * - O adapter é responsável pelo controle de ACK/NACK
 * - Se o handler lançar exceção, o adapter deve fazer NACK (retry automático)
 * - Erro no handler = mensagem volta para fila
 */
export interface QueueConsumerPort {
  /**
   * Inicia o consumo de mensagens da fila.
   * Para cada mensagem recebida, executa o handler fornecido.
   *
   * @param handler Função que processa cada mensagem. Se lançar exceção, a mensagem será rejeitada (NACK) para retry.
   */
  consume(handler: (message: QueueMessage) => Promise<void>): Promise<void>;
}
