import React, { useState, useEffect, useRef } from 'react';
import { Notebook, NotebookSource, ChatMessageUi } from '../../types/notebook.types';
import { fetchNotebookSources, fetchNotebookChatHistory, sendNotebookChat, clearNotebookChatHistory } from '../../services/notebookapi';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeft, Plus, FileText, Globe, Youtube, 
  Share2, Settings, Download,
  Bot, User, Send, Mic, Sparkles, BrainCircuit, Headphones
} from 'lucide-react';

interface NotebookWorkspaceProps {
  notebook: Notebook;
  onBackToNotebooks: () => void;
  onAddSources: () => void;
}

const NotebookWorkspace: React.FC<NotebookWorkspaceProps> = ({ notebook, onBackToNotebooks }) => {
  // Data State
  const [sources, setSources] = useState<NotebookSource[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessageUi[]>([]);
  
  // UI State
  const [loadingSources, setLoadingSources] = useState(true);
  const [loadingChat, setLoadingChat] = useState(true); // initial load
  const [sendingMessage, setSendingMessage] = useState(false);
  const [chatInput, setChatInput] = useState('');
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingSources(true);
        const sourceData = await fetchNotebookSources(notebook.id);
        setSources(sourceData.sources);
      } catch (e) {
        console.error("Failed to load sources", e);
      } finally {
        setLoadingSources(false);
      }

      try {
        setLoadingChat(true);
        const history = await fetchNotebookChatHistory(notebook.id);
        const uiMessages: ChatMessageUi[] = history.map(h => ({
          id: Math.random().toString(36).substr(2, 9), // temp id
          text: h.content,
          isUser: h.role === 'user',
          timestamp: h.timestamp ? new Date(h.timestamp) : new Date()
        }));
        setChatMessages(uiMessages);
      } catch (e) {
        console.error("Failed to load chat history", e);
      } finally {
        setLoadingChat(false);
      }
    };

    if (notebook.id) {
      loadData();
    }
  }, [notebook.id]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, sendingMessage]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || sendingMessage) return;

    const userMsg: ChatMessageUi = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setSendingMessage(true);

    try {
      const response = await sendNotebookChat(notebook.id, { user_query: userMsg.text });
      
      const assistantMsg: ChatMessageUi = {
        id: Date.now().toString() + 'ai',
        text: response.answer,
        isUser: false,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      const errorMsg: ChatMessageUi = {
        id: Date.now().toString() + 'err',
        text: "I'm sorry, I encountered an error getting a response. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSourceIcon = (type: string) => {
    switch(type) {
      case 'youtube': return <Youtube size={18} className="text-red-600" />;
      case 'website': return <Globe size={18} className="text-blue-500" />;
      default: return <FileText size={18} className="text-orange-500" />;
    }
  };

  // Helper function to render formatted text (simple paragraph split)
  const renderMessageText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className={`min-h-[1em] ${i > 0 ? 'mt-2' : ''}`}>
        {line}
      </p>
    ));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBackToNotebooks} className="text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm">
            <ArrowLeft size={16} />
            Back to Notebooks
          </button>
          <div className="h-4 w-px bg-gray-300 mx-2"></div>
          <div>
            <h2 className="font-bold text-gray-900 leading-tight">{notebook.title}</h2>
            <p className="text-xs text-gray-500">{sources.length} sources • Last updated {notebook.lastUpdated || "today"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Notebook Assistant</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-md text-xs font-medium hover:bg-purple-100 transition-colors">
              <Headphones size={14} />
              Audio Overview
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-xs font-medium hover:bg-green-100 transition-colors">
              <BrainCircuit size={14} />
              Mindmap
            </button>
          </div>
          <div className="h-4 w-px bg-gray-300 mx-2"></div>
          <div className="flex items-center gap-2 text-gray-400">
            <button className="hover:text-gray-600 p-1"><Download size={18} /></button>
            <button className="hover:text-gray-600 p-1"><Share2 size={18} /></button>
            <button className="hover:text-gray-600 p-1"><Settings size={18} /></button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Sources */}
        <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-200">
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Plus size={16} />
              Add Sources
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingSources ? (
              <div className="text-center py-4 text-gray-400 text-sm">Loading sources...</div>
            ) : sources.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No sources added yet.</div>
            ) : (
              sources.map((source) => (
                <div key={source.id} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">{getSourceIcon(source.type)}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-800 truncate leading-snug">
                         {source.filename || source.website_url || source.youtube_url || "Untitled Source"}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {source.type === 'file' ? '2.4 MB' : 'Link'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Main Area - Chat */}
        <div className="flex-1 flex flex-col bg-white relative">
          
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={chatContainerRef}>
            {loadingChat ? (
               <div className="flex justify-center items-center h-full">
                 <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
               </div>
            ) : chatMessages.length === 0 ? (
              // Empty State / Welcome
              <div className="max-w-3xl mx-auto pt-8">
                <div className="flex gap-4 items-start mb-8">
                  <div className="bg-teal-600 rounded-full p-2 text-white shrink-0">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Welcome to your {notebook.title} notebook!</h3>
                    <p className="text-gray-600 mt-1">
                      I've analyzed your {sources.length} sources and I'm ready to help you study. Here are some things I can do:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <button className="text-left p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-100 group">
                      <div className="flex items-center gap-2 font-semibold text-gray-800 mb-1">
                        <span className="text-xl">📝</span> Generate Summary
                      </div>
                      <p className="text-sm text-blue-600 group-hover:text-blue-700">Create a comprehensive overview</p>
                   </button>
                   <button className="text-left p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors border border-green-100 group">
                      <div className="flex items-center gap-2 font-semibold text-gray-800 mb-1">
                        <span className="text-xl">🃏</span> Create Flashcards
                      </div>
                      <p className="text-sm text-teal-600 group-hover:text-teal-700">Generate study cards from content</p>
                   </button>
                   <button className="text-left p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-100 group">
                      <div className="flex items-center gap-2 font-semibold text-gray-800 mb-1">
                        <span className="text-xl">🎧</span> Audio Overview
                      </div>
                      <p className="text-sm text-purple-600 group-hover:text-purple-700">Listen to a spoken summary</p>
                   </button>
                   <button className="text-left p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-100 group">
                      <div className="flex items-center gap-2 font-semibold text-gray-800 mb-1">
                        <span className="text-xl">🗺️</span> Create Mindmap
                      </div>
                      <p className="text-sm text-emerald-600 group-hover:text-emerald-700">Visualize key concepts</p>
                   </button>
                </div>
              </div>
            ) : (
              // Chat Messages
              chatMessages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.isUser ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.isUser ? 'bg-gray-200' : 'bg-teal-600 text-white'}`}>
                    {msg.isUser ? <User size={16} className="text-gray-600" /> : <Bot size={18} />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${msg.isUser ? 'bg-gray-100 text-gray-800' : 'bg-blue-50/50 border border-blue-100 text-gray-800'}`}>
                    <div className="text-sm leading-relaxed">
                      {msg.isUser ? (
                        renderMessageText(msg.text)
                      ) : (
                        <div className="prose prose-sm max-w-none prose-blue">
                          <ReactMarkdown>
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Loading Indicator for AI Reply */}
            {sendingMessage && (
               <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                    <Bot size={18} />
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
               </div>
            )}
            
            {/* Spacer for bottom input */}
            <div className="h-4"></div>
          </div>

          {/* Chat Input Area */}
          <div className="p-4 border-t border-gray-100">
            <div className="max-w-4xl mx-auto relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your study materials..."
                className="w-full pl-5 pr-24 py-4 bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-700 placeholder-gray-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 {/* Visual Mic Button */}
                 <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Mic size={20} />
                 </button>
                 <button 
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || sendingMessage}
                  className="bg-gray-900 text-white p-2 rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-xs font-semibold px-3"
                 >
                
                 </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotebookWorkspace;