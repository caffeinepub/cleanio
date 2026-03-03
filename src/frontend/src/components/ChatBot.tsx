import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Message } from "../hooks/useRepairConversation";

interface ChatBotProps {
  messages: Message[];
  currentQuickReplies?: string[];
  onReply: (reply: string) => void;
  onFreeText: (text: string) => void;
  isOtherStep: boolean;
  isComplete: boolean;
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-7 h-7 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-charcoal" />
      </div>
      <div className="chat-bubble-bot flex items-center gap-1 px-4 py-3">
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-1 inline-block" />
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-2 inline-block" />
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-3 inline-block" />
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isBot = message.sender === "bot";

  const formatLine = (line: string): React.ReactNode => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    if (parts.length === 1) return line;
    return (
      <>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={part}>{part}</strong> : part,
        )}
      </>
    );
  };

  const formatText = (text: string) => {
    return text.split("\n").map((line, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static text split, no reorder
      <span key={`line-${i}`}>
        {i > 0 && <br />}
        {formatLine(line)}
      </span>
    ));
  };

  if (isBot) {
    return (
      <div className="flex items-end gap-2 mb-4 animate-fade-in-up">
        <div className="w-7 h-7 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-charcoal" />
        </div>
        <div className="chat-bubble-bot">
          <p className="text-sm leading-relaxed">{formatText(message.text)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end mb-4 animate-fade-in-up">
      <div className="chat-bubble-user">
        <p className="text-sm leading-relaxed">{message.text}</p>
      </div>
    </div>
  );
}

export default function ChatBot({
  messages,
  currentQuickReplies,
  onReply,
  onFreeText,
  isOtherStep,
  isComplete,
}: ChatBotProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [freeText, setFreeText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const prevMessageCount = useRef(messages.length);

  useEffect(() => {
    if (messages.length > prevMessageCount.current) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === "user") {
        setIsTyping(true);
        const timer = setTimeout(() => setIsTyping(false), 600);
        return () => clearTimeout(timer);
      }
    }
    prevMessageCount.current = messages.length;
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  });

  const handleFreeTextSubmit = () => {
    if (freeText.trim()) {
      onFreeText(freeText.trim());
      setFreeText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleFreeTextSubmit();
  };

  return (
    <div className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-card">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-charcoal-light border-b border-border">
        <div className="w-9 h-9 rounded-full bg-brand-orange flex items-center justify-center shadow-orange-glow">
          <Bot className="w-5 h-5 text-charcoal" />
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground">
            Cleanio Repair Bot
          </p>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 min-h-[300px] max-h-[400px]"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Quick Replies */}
      {!isComplete &&
        currentQuickReplies &&
        currentQuickReplies.length > 0 &&
        !isOtherStep && (
          <div className="px-4 py-3 border-t border-border bg-charcoal-light">
            <p className="text-xs text-muted-foreground mb-2">
              Choose an option:
            </p>
            <div className="flex flex-wrap gap-2">
              {currentQuickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => onReply(reply)}
                  className="quick-reply-btn"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

      {/* Free Text Input for "Other" */}
      {!isComplete && isOtherStep && (
        <div className="px-4 py-3 border-t border-border bg-charcoal-light">
          <div className="flex gap-2">
            <Input
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your issue..."
              className="flex-1 bg-charcoal border-border text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleFreeTextSubmit}
              size="icon"
              className="bg-brand-orange hover:bg-brand-orange-light text-charcoal"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="px-4 py-3 border-t border-border bg-charcoal-light">
          <p className="text-xs text-muted-foreground text-center">
            ✅ Issue captured. Fill in your details below to book.
          </p>
        </div>
      )}
    </div>
  );
}
