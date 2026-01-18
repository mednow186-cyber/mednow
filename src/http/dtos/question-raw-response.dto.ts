import { ApiProperty } from '@nestjs/swagger';

export class ChoiceDto {
  @ApiProperty({ description: 'Letra da opção', example: 'A' })
  option: string;

  @ApiProperty({
    description: 'Texto da opção',
    example: 'Haemophilus influenzae (3%)',
  })
  text: string;

  @ApiProperty({
    description: 'Indica se a opção está correta',
    required: false,
    example: false,
  })
  correct?: boolean;
}

export class QuestionDto {
  @ApiProperty({
    description: 'Texto da questão',
    example:
      'Investigators study the prevalence of respiratory pathogens...',
  })
  text: string;

  @ApiProperty({
    description: 'Descrição do gráfico',
    example: 'Graph showing the percentage of individuals colonized...',
  })
  graph_description: string;

  @ApiProperty({
    description: 'Legenda da imagem',
    example: '<2 2-5 6-10 11-17 18-24 25-34 35-44 ≥ 45 Percentage of individuals Age (years)',
  })
  image_caption: string;
}

export class AnswerExplanationDto {
  @ApiProperty({
    description: 'Explicação da resposta',
    example:
      'Pseudomonas aeruginosa is the leading respiratory pathogen...',
  })
  text: string;
}

export class GptResponseDto {
  @ApiProperty({ type: QuestionDto })
  question: QuestionDto;

  @ApiProperty({ type: [ChoiceDto] })
  choices: ChoiceDto[];

  @ApiProperty({
    description: 'Destaque da questão',
    example:
      'The pathogen, once acquired, often switches into mucoid phenotype...',
  })
  highlight: string;

  @ApiProperty({ type: AnswerExplanationDto })
  answer_explanation: AnswerExplanationDto;

  @ApiProperty({
    description: 'Notas adicionais',
    type: [String],
    example: [
      'Educational Objective: Pseudomonas aeruginosa is the leading respiratory pathogen...',
    ],
  })
  notes: string[];

  @ApiProperty({
    description: 'Tempo decorrido',
    example: '04 mins, 02 secs',
  })
  time_elapsed: string;

  @ApiProperty({
    description: 'Percentual de respostas corretas',
    example: '76%',
  })
  percent_answered_correctly: string;
}

export class QuestionRawResponseDto {
  @ApiProperty({
    description: 'ID único do documento',
    example: '696d15d7d5eb39e8296e120b',
  })
  _id: string;

  @ApiProperty({
    description: 'ID de correlação da requisição',
    example: '8501d2c5-2305-40c9-b2c8-c1e94e5eecee',
  })
  correlationId: string;

  @ApiProperty({
    description: 'URL da imagem processada',
    example:
      'https://sqjffocugqnngfquahlb.supabase.co/storage/v1/object/public/ocr-questions-056/image.png',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Tipo da fonte',
    enum: ['image', 'pdf'],
    example: 'image',
  })
  sourceType: 'image' | 'pdf';

  @ApiProperty({
    description: 'Payload original da requisição',
    type: Object,
    example: {
      imageUrl: 'https://example.com/image.png',
      content: 'Conteúdo opcional',
      notes: 'Notas opcionais',
      metadata: {
        correlationId: '8501d2c5-2305-40c9-b2c8-c1e94e5eecee',
        receivedAt: '2026-01-18T17:17:59.990Z',
        module: 'questions',
      },
    },
  })
  originalPayload: Record<string, unknown>;

  @ApiProperty({ type: GptResponseDto })
  gptResponse: GptResponseDto;

  @ApiProperty({
    description: 'Status da questão',
    enum: ['pending_review'],
    example: 'pending_review',
  })
  status: 'pending_review';

  @ApiProperty({
    description: 'Data de criação',
    example: '2026-01-18T17:18:15.074Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Versão do documento',
    required: false,
    example: 0,
  })
  __v?: number;
}
