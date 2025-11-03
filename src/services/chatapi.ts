// src/services/chatapi.ts
export async function sendChatMessage(query: string) {
  // Add this debug log as the first line inside the function
  console.log('API URL:', import.meta.env.VITE_AICHAT_API_URL);
  console.log('Payload:', { query, mode: "general", top_k: 3 });
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

    console.log("Raw response object:", response);

    if (!response.ok) {
      // Log the response for debug
      const errorBody = await response.text();
      console.warn("Response not OK, status:", response.status, "body:", errorBody);
      throw new Error(`Failed to fetch response: ${response.status}`);
    }

    const json = await response.json();
    console.log("Response JSON:", json);
    return json; // { answer: "...", mode: "...", retrieved_chunks: [...] }
  } catch (error) {
    console.error("Error sending chat message(in API):", error);
    throw error;
  }
}
