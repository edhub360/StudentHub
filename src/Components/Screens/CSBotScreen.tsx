import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, RotateCcw, Bot } from "lucide-react";
import { Message, CSBotState } from "../../types/csbot.types";
import { sendMessage, clearSession } from "../../services/csbotapi";

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "bot",
  content:
    "Hi! 👋 I'm the Edhub360 assistant. Ask me anything about our platform — quizzes, flashcards, notes, subscriptions, or anything else!",
  timestamp: new Date(),
};

const CSBotScreen: React.FC = () => {
  const [state, setState] = useState<CSBotState>({
    isOpen: false,
    isLoading: false,
    sessionId: null,
    messages: [WELCOME_MESSAGE],
    error: null,
  });

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages, state.isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (state.isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [state.isOpen]);

  const toggleChat = () => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen, error: null }));
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || state.isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));
    setInput("");

    try {
      const response = await sendMessage({
        session_id: state.sessionId ?? undefined,
        message: trimmed,
      });

      const botMessage: Message = {
        id: crypto.randomUUID(),
        role: "bot",
        content: response.reply,
        sources: response.sources,
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        sessionId: response.session_id,
        messages: [...prev.messages, botMessage],
        isLoading: false,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Something went wrong. Please try again.",
      }));
    }
  };

  const handleReset = async () => {
    if (state.sessionId) {
      await clearSession(state.sessionId).catch(() => {});
    }
    setState((prev) => ({
      ...prev,
      sessionId: null,
      messages: [WELCOME_MESSAGE],
      error: null,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ✅ Fixed bottom-right — position:fixed ensures it never moves on scroll */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}>

        {/* Chat Window */}
        {state.isOpen && (
          <div style={{
            position: "absolute",
            bottom: "70px",
            right: "0",
            width: "360px",
            height: "520px",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
          }}>

            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, #0fa4a4, #14b8a6)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Bot size={20} color="#fff" />
                </div>
                <div>
                  <p style={{ margin: 0, color: "#fff", fontWeight: 600, fontSize: "14px" }}>
                    Edhub360 Assistant
                  </p>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "11px" }}>
                    Ask me anything about the platform
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={handleReset} title="Reset chat"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                  <RotateCcw size={16} color="rgba(255,255,255,0.85)" />
                </button>
                <button onClick={toggleChat} title="Close"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                  <X size={18} color="rgba(255,255,255,0.85)" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              backgroundColor: "#f9fafb",
            }}>
              {state.messages.map((msg) => (
                <div key={msg.id} style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}>
                  <div style={{
                    maxWidth: "80%",
                    padding: "10px 14px",
                    borderRadius: msg.role === "user"
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    backgroundColor: msg.role === "user" ? "#14b8a6" : "#ffffff",
                    color: msg.role === "user" ? "#fff" : "#1f2937",
                    fontSize: "13px",
                    lineHeight: "1.5",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    border: msg.role === "bot" ? "1px solid #e5e7eb" : "none",
                  }}>
                    {msg.content}
                    {msg.sources && msg.sources.length > 0 && (
                      <div style={{ marginTop: "6px", fontSize: "11px", opacity: 0.6 }}>
                        📄 {msg.sources.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {state.isLoading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    padding: "10px 14px",
                    borderRadius: "16px 16px 16px 4px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    display: "flex", gap: "4px", alignItems: "center"
                  }}>
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{
                        width: "7px", height: "7px", borderRadius: "50%",
                        backgroundColor: "#14b8a6",
                        animation: "bounce 1.2s infinite",
                        animationDelay: `${i * 0.2}s`,
                        display: "inline-block",
                      }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {state.error && (
                <p style={{ color: "#ef4444", fontSize: "12px", textAlign: "center" }}>
                  {state.error}
                </p>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: "12px",
              borderTop: "1px solid #e5e7eb",
              backgroundColor: "#fff",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                disabled={state.isLoading}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "24px",
                  border: "1px solid #d1d5db",
                  outline: "none",
                  fontSize: "13px",
                  backgroundColor: "#f9fafb",
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || state.isLoading}
                style={{
                  width: "38px", height: "38px",
                  borderRadius: "50%",
                  background: input.trim() ? "linear-gradient(135deg, #0fa4a4, #14b8a6)" : "#e5e7eb",
                  border: "none",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s",
                }}
              >
                <Send size={15} color={input.trim() ? "#fff" : "#9ca3af"} />
              </button>
            </div>
          </div>
        )}

        {/* ✅ Floating Chat Button — fixed, never scrolls */}
        <button
          onClick={toggleChat}
          style={{
            width: "56px", height: "56px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0fa4a4, #14b8a6)",
            border: "none",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(20,184,166,0.45)",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        >
          {state.isOpen
            ? <X size={24} color="#fff" />
            : <MessageCircle size={24} color="#fff" />
          }
        </button>
      </div>

      {/* Bounce animation for typing dots */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
};

export default CSBotScreen;
