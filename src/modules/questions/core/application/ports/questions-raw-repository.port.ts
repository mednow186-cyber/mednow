export type SourceType = 'image' | 'pdf';
export type QuestionRawStatus = 'pending_review' | 'approved';

export interface QuestionRaw {
  _id?: string;
  correlationId: string;
  imageUrl: string;
  sourceType: SourceType;
  originalPayload: Record<string, unknown>;
  gptResponse: unknown;
  status: QuestionRawStatus;
  createdAt: Date;
}

export interface QuestionsRawRepositoryPort {
  save(questionRaw: QuestionRaw): Promise<void>;
  findAll(): Promise<QuestionRaw[]>;
  findById(id: string): Promise<QuestionRaw | null>;
  update(id: string, updates: Partial<QuestionRaw>): Promise<QuestionRaw | null>;
}
