import { ApiProperty } from '@nestjs/swagger';

export class ProcessingStatusUpdateDto {
  @ApiProperty({
    description: 'Status do processamento',
    enum: ['pending', 'classified', 'partial'],
    required: false,
    example: 'classified',
  })
  status?: 'pending' | 'classified' | 'partial';

  @ApiProperty({
    description: 'Data de classificação',
    required: false,
    example: '2026-01-18T17:18:15.074Z',
  })
  classifiedAt?: Date;

  @ApiProperty({
    description: 'Modelo usado para classificação',
    required: false,
    example: 'gpt-4o',
  })
  model?: string;
}

export class UpdateQuestionRequestDto {
  @ApiProperty({
    description: 'Fonte da questão (URL da imagem)',
    required: false,
    example: 'https://example.com/image.png',
  })
  source?: string;

  @ApiProperty({
    description: 'Texto bruto extraído',
    required: false,
    example: 'Raw text extracted from the image...',
  })
  raw_text?: string;

  @ApiProperty({
    description: 'Status do processamento',
    type: ProcessingStatusUpdateDto,
    required: false,
  })
  processing?: ProcessingStatusUpdateDto;

  @ApiProperty({
    description: 'Lista de questões processadas',
    type: Array,
    required: false,
  })
  questions?: Array<{
    questionNumber: number;
    type: 'multiple_choice' | 'descriptive';
    question: {
      text: string;
      alternatives: Array<{
        letter: string;
        text: string;
      }>;
    };
    answer: {
      letter: string | null;
      text: string | null;
      explanation: string | null;
      source: 'official_gabarito' | 'not_found';
    };
    classification?: {
      area?: string;
      subarea?: string;
      theme?: string;
      difficulty?: 'easy' | 'medium' | 'hard';
      keywords?: string[];
    };
    processing: {
      status: 'classified' | 'classification_error';
      error: string | null;
    };
  }>;
}
