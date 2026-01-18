import { ApiProperty } from '@nestjs/swagger';
import { GptResponseDto } from './question-raw-response.dto';

export class UpdateQuestionRequestDto {
  @ApiProperty({
    description: 'URL da imagem da questão',
    required: false,
    example: 'https://example.com/image.png',
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Tipo da fonte',
    enum: ['image', 'pdf'],
    required: false,
    example: 'image',
  })
  sourceType?: 'image' | 'pdf';

  @ApiProperty({
    description: 'Payload original da requisição',
    type: Object,
    required: false,
    example: {
      imageUrl: 'https://example.com/image.png',
      content: 'Conteúdo atualizado',
      notes: 'Notas atualizadas',
    },
  })
  originalPayload?: Record<string, unknown>;

  @ApiProperty({
    description: 'Resposta do GPT processada',
    type: Object,
    required: false,
  })
  gptResponse?: GptResponseDto;

  @ApiProperty({
    description: 'Status da questão',
    enum: ['pending_review', 'approved'],
    required: false,
    example: 'pending_review',
  })
  status?: 'pending_review' | 'approved';
}
