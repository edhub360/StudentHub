import axios from "axios";
import { ChatRequest, ChatResponse } from "../types/csbot.types";

const BASE_URL = import.meta.env.VITE_CSBOT_API_URL || "http://localhost:8080";

const csbotClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const sendMessage = async (
  payload: ChatRequest
): Promise<ChatResponse> => {
  const { data } = await csbotClient.post<ChatResponse>("/chat", payload);
  return data;
};

export const clearSession = async (sessionId: string): Promise<void> => {
  await csbotClient.delete(`/chat/session/${sessionId}`);
};
