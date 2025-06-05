"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, Loader2, BookOpen, Lightbulb, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { getGeminiResponse } from "@/lib/genai";
import { speakText } from "@/lib/text-to-speech";
import { useBrowserSpeechRecognition } from "@/lib/speech-to-text";
import type { ChatMessage } from "@/types/chat";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

// Add props for customizing dimensions
interface EnglishChatInterfaceProps {
  className?: string;
  fullscreen?: boolean;
}

export function EnglishChatInterface({ 
  className = "", 
  fullscreen = false 
}: EnglishChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content: "Hi there! I'm EngBot, your English language assistant. How can I help you practice your English today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Create speech recognition only once with useRef
  const speechRecognitionRef = useRef<{
    start: () => void;
    stop: () => void;
  } | null>(null);
  
  // Initialize speech recognition on component mount
  useEffect(() => {
    speechRecognitionRef.current = useBrowserSpeechRecognition(
      (text) => setTranscript(text),
      () => {
        console.log("Speech recognition ended callback triggered");
        setIsListening(false);
      }
    );
    
    // Cleanup on unmount
    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleVoiceMode = () => {
    if (isListening) {
      speechRecognitionRef.current?.stop();
      setIsListening(false);
    }
    setIsVoiceMode(!isVoiceMode);
  };

  const toggleListening = () => {
    if (!speechRecognitionRef.current) {
      console.error("Speech recognition not initialized");
      return;
    }
    
    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
      // If we have transcript, set it as input value
      if (transcript.trim()) {
        setInputValue(transcript);
      }
    } else {
      setTranscript("");
      setInputValue("");
      speechRecognitionRef.current.start();
      setIsListening(true);
      console.log("Started listening");
    }
  };

  // When transcript changes, update input value in real-time
  useEffect(() => {
    if (isListening && transcript) {
      setInputValue(transcript);
    }
  }, [transcript, isListening]);

  const speakMessage = async (text: string) => {
    if (isSpeaking) return;
    
    try {
      setIsSpeaking(true);
      // Remove markdown and HTML before speaking
      const cleanText = text.replace(/[#*_~`]/g, '').replace(/<[^>]*>/g, '');
      await speakText(cleanText);
    } catch (error) {
      console.error("Error speaking text:", error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setTranscript("");
    setIsLoading(true);
    
    if (isListening) {
      speechRecognitionRef?.current?.stop();
      setIsListening(false);
    }
    
    try {
      // Prepare messages for the AI
      const messageHistory = messages
        .slice(-10) // Only use the last 10 messages for context
        .concat(userMessage)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));
      
      // Get response from Gemini AI
      const aiResponse = await getGeminiResponse(messageHistory);
      
      // Add AI response to chat
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: aiResponse || "Sorry, I couldn't generate a response.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Auto-speak AI response in voice mode
      if (isVoiceMode) {
        speakMessage(assistantMessage.content);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: "assistant",
          content: "Sorry, I encountered an error processing your message. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced function to format message content with better markdown support
  const formatMessageContent = (content: string) => {
    // Process special sections first (Grammar Check, Grammar Tip)
    let processedContent = content
      // Format Grammar Check section
      .replace(
        /##\s*Grammar Check\s*\n([\s\S]*?)(?=##|$)/g,
        '<div class="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-md border border-amber-200 dark:border-amber-800"><h4 class="font-semibold flex items-center gap-1 text-amber-800 dark:text-amber-400"><span class="grammar-check-icon"></span>Grammar Check</h4>$1</div>'
      )
      // Format Grammar Tip section
      .replace(
        /##\s*Grammar Tip\s*\n([\s\S]*?)(?=##|$)/g,
        '<div class="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-800"><h4 class="font-semibold flex items-center gap-1 text-blue-800 dark:text-blue-400"><span class="grammar-tip-icon"></span>Grammar Tip</h4>$1</div>'
      )
      // Format incorrect/correct examples
      .replace(/❌\s*([^:]+):\s*([^\n]+)/g, '<div class="mt-2"><span class="text-red-500 font-semibold">❌ $1:</span> $2</div>')
      .replace(/✅\s*([^:]+):\s*([^\n]+)/g, '<div class="mt-2"><span class="text-green-500 font-semibold">✅ $1:</span> $2</div>');
      
    return processedContent;
  };

  return (
    <div className={`flex flex-col bg-card rounded-xl border shadow-sm overflow-hidden ${
      fullscreen ? 'w-full h-screen fixed inset-0 z-50' : 'w-full h-[70vh]'
    } ${className}`}>
      <div className="bg-primary/5 p-3 border-b flex items-center gap-2">
        <Avatar className="h-8 w-8 bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </Avatar>
        <div>
          <h3 className="font-medium">EngBot</h3>
          <p className="text-xs text-muted-foreground">AI English Tutor</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 text-xs">
            {isVoiceMode ? "Voice Mode" : "Text Mode"}
          </Badge>
          <Toggle 
            pressed={isVoiceMode} 
            onPressedChange={toggleVoiceMode}
            aria-label="Toggle voice mode"
            className="data-[state=on]:bg-primary/20"
          >
            {isVoiceMode ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Toggle>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                } rounded-lg p-3`}
              >
                {message.role === "user" ? (
                  <div>{message.content}</div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <ReactMarkdown
                          rehypePlugins={[rehypeRaw]}
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // Custom components for markdown elements
                            h1: ({node, ...props}) => <h1 className="text-lg font-bold my-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-md font-bold my-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-sm font-bold my-1" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2" {...props} />,
                            li: ({node, ...props}) => <li className="my-0.5" {...props} />,
                            p: ({node, ...props}) => <p className="my-1.5" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-primary pl-3 italic my-2" {...props} />,
                            code: ({node, inline, ...props}: {node?: any, inline?: boolean} & React.HTMLAttributes<HTMLElement>) => 
                              inline 
                                ? <code className="bg-primary/10 px-1 py-0.5 rounded text-xs" {...props} />
                                : <code className="block bg-primary/10 p-2 rounded-md text-xs my-2 whitespace-pre-wrap" {...props} />,
                            // Pass-through for HTML inserted by formatMessageContent
                            span: ({node, ...props}) => {
                              if (props.className === 'grammar-check-icon') return <BookOpen className="h-4 w-4" />;
                              if (props.className === 'grammar-tip-icon') return <Lightbulb className="h-4 w-4" />;
                              return <span {...props} />;
                            }
                          }}
                        >
                          {formatMessageContent(message.content)}
                        </ReactMarkdown>
                      </div>
                      {isVoiceMode && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="ml-2 h-6 w-6" 
                          onClick={() => speakMessage(message.content)}
                          disabled={isSpeaking}
                        >
                          {isSpeaking ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Volume2 className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                <div className="mt-1 text-xs opacity-70 text-right">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center"
          >
            <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-2">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </div>
              <span className="text-sm">Listening...</span>
            </div>
          </motion.div>
        )}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-start"
          >
            <div className="bg-muted rounded-lg p-3">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="flex items-center gap-2">
          {isVoiceMode && (
            <Button 
              type="button"
              size="icon"
              variant={isListening ? "destructive" : "secondary"}
              onClick={toggleListening}
              className="flex-shrink-0"
              disabled={isLoading}
            >
              {isListening ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
          )}
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isVoiceMode ? "Speak or type your message..." : "Type a message in English..."}
            className="flex-1 resize-none"
            rows={1}
            maxRows={5}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || (!inputValue.trim() && !isListening)}
            className="flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground text-center">
          {isVoiceMode 
            ? "Voice mode enabled: Click the microphone to speak, or type your message"
            : "EngBot will help correct your grammar and suggest improvements"}
        </div>
      </form>
    </div>
  );
}
