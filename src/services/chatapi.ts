// src/api.ts
export async function sendChatMessage(query: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_AICHAT_API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,       // ✅ matches backend ChatRequest.query
        mode: "general", // or "rag" if you want RAG
        top_k: 3     // optional, backend defaults to 3
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch response: ${response.status}`);
    }

    return response.json(); // { answer: "...", mode: "...", retrieved_chunks: [...] }
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
}
