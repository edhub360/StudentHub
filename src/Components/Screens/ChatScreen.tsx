// ChatScreen.tsx
import React, { useRef, useState } from "react";
import { Zap, MessageCircle, Send, Paperclip, FileText, X } from "lucide-react";
import { sendChatMessage } from '..services/chatapi'; // Adjust path as needed

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  files?: Array<{
    name: string;
    size: number;
    type: string;
  }>;
}

interface ChatScreenProps {
  chatMessages: ChatMessage[];
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Handle multiple file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  // Remove specific file
  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

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
                className={`max-w-md ${
                  message.isUser ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white" : "bg-gray-100 text-gray-900"
                } rounded-2xl overflow-hidden`}
              >
                {/* Multiple Files Preview (if attached) */}
                {message.files && message.files.length > 0 && (
                  <div className={`p-3 border-b ${message.isUser ? 'border-blue-400' : 'border-gray-200'} space-y-2`}>
                    {message.files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          message.isUser ? 'bg-blue-400' : 'bg-gray-200'
                        }`}>
                          <FileText className={`w-5 h-5 ${message.isUser ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${message.isUser ? 'text-white' : 'text-gray-900'}`}>
                            {file.name}
                          </p>
                          <p className={`text-xs ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Message Text */}
                <div className="px-4 py-3">
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? "text-blue-100" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Input */}
      <div className="p-6 border-t border-gray-100 bg-white">
        {/* Multiple Files Preview (before sending) */}
        {attachedFiles.length > 0 && (
          <div className="mb-3 max-h-40 overflow-y-auto space-y-2">
            {attachedFiles.map((file, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask your question..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* Hidden file input - MOVED TO RIGHT */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {/* File upload button - RIGHT SIDE */}
          <button
            onClick={triggerFileInput}
            className="w-12 h-12 border-2 border-gray-300 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-all"
            title="Attach files"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Send button */}
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
  
