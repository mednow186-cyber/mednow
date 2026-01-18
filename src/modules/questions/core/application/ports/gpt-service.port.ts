export type FileType = 'image' | 'pdf';

export interface GptProcessRequest {
  imageUrl: string;
  fileType: FileType;
  content?: string;
  notes?: string;
}

export interface GptResponse {
  content: unknown;
}

export interface GptServicePort {
  processQuestion(request: GptProcessRequest): Promise<GptResponse>;
}
