import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionsResponseDto {
  @ApiProperty({
    description: 'Indica se a operação foi bem-sucedida',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Número de mensagens processadas',
    example: 3,
  })
  messagesCount: number;
}
