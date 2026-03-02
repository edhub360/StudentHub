export interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  sources?: string[];
  timestamp: Date;
}

export interface ChatRequest {
  session_id?: string;
  message: string;
}

export interface ChatResponse {
  session_id: string;
  reply: string;
  sources: string[];
}

export interface CSBotState {
  isOpen: boolean;
  isLoading: boolean;
  sessionId: string | null;
  messages: Message[];
  error: string | null;
}
