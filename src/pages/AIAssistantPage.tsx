import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  Trash2,
  MessageCircle,
  Plus,
  Bot,
  User,
  RefreshCw,
} from 'lucide-react';
import { aiApi, type AIConversation, type AIMessage } from '@/lib/supabase';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const suggestedPrompts = [
  "What's the status of my applications?",
  "Do I have any pending queries?",
  "What compliance items are overdue?",
  "Which government portals am I connected to?",
  "Which applications have high delay risk?",
];

function formatMessageContent(content: string): string {
  return content
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />');
}

export function AIAssistantPage() {
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    try {
      setLoadingConvs(true);
      const convs = await aiApi.getConversations();
      setConversations(convs);
      if (convs.length > 0 && !activeConversationId) {
        setActiveConversationId(convs[0].id);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load conversations';
      setError(msg);
    } finally {
      setLoadingConvs(false);
    }
  }, [activeConversationId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      setLoadingMsgs(true);
      setError(null);
      const msgs = await aiApi.getMessages(conversationId);
      setMessages(
        msgs.map((m: AIMessage) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        })),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load messages';
      setError(msg);
      setMessages([]);
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      loadMessages(activeConversationId);
    } else {
      setMessages([]);
    }
  }, [activeConversationId, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const text = (messageText || input).trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);
    setError(null);

    try {
      const result = await aiApi.sendMessage(text, activeConversationId || undefined);

      const aiMsg: ChatMessage = {
        id: `temp-ai-${Date.now()}`,
        role: 'assistant',
        content: result.response,
      };
      setMessages((prev) => [...prev, aiMsg]);

      if (!activeConversationId) {
        setActiveConversationId(result.conversationId);
        await loadConversations();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send message';
      setError(msg);
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setSending(false);
    }
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
    setError(null);
    setSidebarOpen(false);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await aiApi.deleteConversation(conversationId);
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
        setMessages([]);
      }
      await loadConversations();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete conversation';
      setError(msg);
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] animate-fade-in">
      {/* Conversation sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 z-30 h-full w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-3 border-b border-gray-200">
          <button
            onClick={handleNewConversation}
            className="btn-primary w-full text-sm"
          >
            <Plus size={16} /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
          {loadingConvs ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-gray-400" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 px-3">
              <MessageCircle size={24} className="text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No conversations yet. Start a new chat!</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                  activeConversationId === conv.id
                    ? 'bg-brand-50 text-brand-700'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                onClick={() => {
                  setActiveConversationId(conv.id);
                  setSidebarOpen(false);
                }}
              >
                <MessageCircle size={15} className="flex-shrink-0" />
                <span className="flex-1 text-sm truncate">{conv.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-error-500 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 bg-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <MessageCircle size={20} />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">AI Assistant</h1>
            <p className="text-xs text-gray-500">Your personal clearance advisor</p>
          </div>
          <button
            onClick={() => activeConversationId && loadMessages(activeConversationId)}
            className="btn-ghost text-sm"
            title="Reload messages"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
          {loadingMsgs ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-brand-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="max-w-2xl mx-auto py-12">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-4">
                  <Bot size={32} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">How can I help you?</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Ask me about your applications, compliance, government portals, or delay risks.
                </p>
              </div>

              {/* Suggested prompts */}
              <div className="grid sm:grid-cols-2 gap-3">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    disabled={sending}
                    className="card card-hover p-4 text-left text-sm text-gray-700 animate-slide-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <Sparkles size={16} className="text-brand-500 mb-2" />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-gray-200'
                      : 'bg-gradient-to-br from-brand-500 to-brand-700'
                  }`}>
                    {msg.role === 'user' ? (
                      <User size={16} className="text-gray-600" />
                    ) : (
                      <Bot size={16} className="text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-brand-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}>
                    <div
                      className="text-sm leading-relaxed [&_strong]:font-semibold"
                      dangerouslySetInnerHTML={{ __html: formatMessageContent(msg.content) }}
                    />
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex gap-3 animate-slide-up">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-white border border-gray-200">
                    <Loader2 size={16} className="animate-spin text-brand-500" />
                  </div>
                </div>
              )}

              {error && (
                <div className="card p-3 bg-error-50 border-error-200">
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-3xl mx-auto flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about your applications, compliance, or portals..."
              disabled={sending}
              className="input-field flex-1"
            />
            <button
              onClick={() => handleSend()}
              disabled={sending || !input.trim()}
              className="btn-primary px-4"
            >
              {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
