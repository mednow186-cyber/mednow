export interface QuestionItem {
  imageUrl: string;
  content?: string;
  notes?: string;
}

export interface CreateQuestionsRequestDto {
  items: QuestionItem[];
}
