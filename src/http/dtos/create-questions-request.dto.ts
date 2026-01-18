import { ApiProperty } from '@nestjs/swagger';

export class QuestionItem {
  @ApiProperty({
    description: 'URL da imagem da questão',
    example: 'https://example.com/image.png',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Conteúdo opcional do item',
    required: false,
    example: 'Conteúdo opcional do item 1',
  })
  content?: string;

  @ApiProperty({
    description: 'Notas opcionais do item',
    required: false,
    example: 'Notas opcionais do item 1',
  })
  notes?: string;
}

export class CreateQuestionsRequestDto {
  @ApiProperty({
    description: 'Lista de itens de questões para processar',
    type: [QuestionItem],
  })
  items: QuestionItem[];
}
