export interface Notebook {
  id: string;
  title: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  // UI helper props
  sourceCount?: number;
  lastUpdated?: string;
  courseName?: string; // e.g. "Calculus I"
  topic?: string;      // e.g. "Derivatives"
}

export type SourceType = 'file' | 'website' | 'youtube';

export interface NotebookSource {
  id: string;
  notebook_id: string;
  type: SourceType;
  filename?: string;
  file_url?: string;
  website_url?: string;
  youtube_url?: string;
  created_at?: string;
  metadata?: Record<string, any>;
}

export interface ChatMessageDto {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ChatMessageUi {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sourceLinks?: Record<string, string>;
}

export interface ContextChunk {
  text: string;
  score: number;
  source_id: string;
}

export interface ChatResponseDto {
  answer: string;
  context_used: ContextChunk[];
  history: ChatMessageDto[];
  notebook_id: string;
  total_chunks_found: number;
  source_links?: Record<string, string>;
}

export interface ChatRequestDto {
  user_query: string;
  max_context_chunks?: number;
  max_tokens?: number;
}
