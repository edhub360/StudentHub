// ChatScreen.tsx
import React from "react";
import { Zap, MessageCircle, Send } from "lucide-react"; // adjust icons import
// import types if needed

interface ChatScreenProps {
  chatMessages: { id: string; text: string; isUser: boolean; timestamp: Date }[];
  chatInput: string;
  setChatInput: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  chatMessages,
  chatInput,
  setChatInput,
  handleSendMessage,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">AI Study Assistant</h2>
            <p className="text-sm text-gray-500">Powered by Gemini • Always ready to help</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {chatMessages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Start a conversation</h3>
            <p className="text-gray-500 mb-6">Ask me anything about your studies!</p>
            {/* Quick buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
              <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
                <p className="font-medium text-blue-900 text-sm">Explain photosynthesis</p>
              </button>
              <button className="p-3 bg-teal-50 hover:bg-teal-100 rounded-lg text-left transition-colors">
                <p className="font-medium text-teal-900 text-sm">Solve math problems</p>
              </button>
              <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
                <p className="font-medium text-purple-900 text-sm">History questions</p>
              </button>
              <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
                <p className="font-medium text-green-900 text-sm">Study tips</p>
              </button>
            </div>
          </div>
        ) : (
          chatMessages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-md px-4 py-3 rounded-2xl ${
                  message.isUser ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${message.isUser ? "text-blue-100" : "text-gray-500"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Input */}
      <div className="p-6 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask your question..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
