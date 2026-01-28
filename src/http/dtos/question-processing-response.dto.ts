import { ApiProperty } from '@nestjs/swagger';

export class AlternativeDto {
  @ApiProperty({ description: 'Letra da alternativa', example: 'A' })
  letter: string;

  @ApiProperty({
    description: 'Texto da alternativa',
    example: 'Haemophilus influenzae (3%)',
  })
  text: string;
}

export class QuestionItemDto {
  @ApiProperty({ description: 'Número da questão', example: 1 })
  questionNumber: number;

  @ApiProperty({
    description: 'Tipo da questão',
    enum: ['multiple_choice', 'descriptive'],
    example: 'multiple_choice',
  })
  type: 'multiple_choice' | 'descriptive';

  @ApiProperty({
    description: 'Dados da questão',
    type: Object,
    example: {
      text: 'Investigators study the prevalence of respiratory pathogens...',
      alternatives: [
        { letter: 'A', text: 'Option A' },
        { letter: 'B', text: 'Option B' },
      ],
    },
  })
  question: {
    text: string;
    alternatives: AlternativeDto[];
  };

  @ApiProperty({
    description: 'Resposta da questão',
    type: Object,
    example: {
      letter: 'C',
      text: null,
      explanation: 'Explanation text',
      source: 'official_gabarito',
    },
  })
  answer: {
    letter: string | null;
    text: string | null;
    explanation: string | null;
    source: 'official_gabarito' | 'not_found';
  };

  @ApiProperty({
    description: 'Classificação da questão',
    required: false,
    type: Object,
    example: {
      area: 'Medicine',
      subarea: 'Infectious Diseases',
      theme: 'Respiratory Pathogens',
      difficulty: 'medium',
      keywords: ['pathogen', 'respiratory'],
    },
  })
  classification?: {
    area?: string;
    subarea?: string;
    theme?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    keywords?: string[];
  };

  @ApiProperty({
    description: 'Status do processamento da questão',
    type: Object,
    example: {
      status: 'classified',
      error: null,
    },
  })
  processing: {
    status: 'classified' | 'classification_error';
    error: string | null;
  };
}

export class ProcessingStatusDto {
  @ApiProperty({
    description: 'Status do processamento',
    enum: ['pending', 'classified', 'partial'],
    example: 'pending',
  })
  status: 'pending' | 'classified' | 'partial';

  @ApiProperty({
    description: 'Data de classificação',
    required: false,
    example: '2026-01-18T17:18:15.074Z',
  })
  classifiedAt?: string;

  @ApiProperty({
    description: 'Modelo usado para classificação',
    required: false,
    example: 'gpt-4o',
  })
  model?: string;
}

export class QuestionProcessingResponseDto {
  @ApiProperty({
    description: 'ID único do documento',
    example: '696d15d7d5eb39e8296e120b',
  })
  _id: string;

  @ApiProperty({
    description: 'Fonte da questão (URL da imagem)',
    example:
      'https://sqjffocugqnngfquahlb.supabase.co/storage/v1/object/public/ocr-questions-056/image.png',
  })
  source: string;

  @ApiProperty({
    description: 'Texto bruto extraído',
    example: 'Raw text extracted from the image...',
  })
  raw_text: string;

  @ApiProperty({
    description: 'Status do processamento',
    type: ProcessingStatusDto,
  })
  processing: ProcessingStatusDto;

  @ApiProperty({
    description: 'Lista de questões processadas',
    type: [QuestionItemDto],
  })
  questions: QuestionItemDto[];
}
