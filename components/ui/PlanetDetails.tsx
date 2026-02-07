"use client";

import { useStore } from "@/lib/store";
import { ArrowLeft, Send, Sparkles, Bot, Minimize2, Maximize2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function PlanetDetails() {
  const { selectedPlanet, setSelectedPlanet } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Clear chat when planet changes
  useEffect(() => {
    setMessages([]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [selectedPlanet?.name]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isExpanded]);

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };
  
  // Handle key press (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selectedPlanet || selectedPlanet.name === "Earth") return null;

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!isExpanded) setIsExpanded(true); // Auto-expand panel on interaction

    const requestStartTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);
    
    console.log(`[Planet Chat] 🚀 Request #${requestId} started`);
    
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    
    setIsLoading(true);

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                planetName: selectedPlanet.name,
                messages: [...messages, userMsg],
            }),
        });

        const data = await res.json();
        
        if (data.error) {
            setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ System malfunction: " + data.error }]);
        } else {
            setMessages((prev) => [...prev, data]);
        }
    } catch (error: any) {
        console.error(`[Planet Chat] Error:`, error);
        setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Connection lost to AI core." }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 pointer-events-none p-6 md:p-0 overflow-hidden flex flex-col items-center justify-end md:justify-end md:pb-8">
      
      {/* Header / Back Button - Top Right (Shifted left to avoid Volume button overlap) */}
      <div className="absolute top-6 right-24 pointer-events-auto">
        <button
          onClick={() => setSelectedPlanet(null)}
          className="flex items-center gap-2 group px-4 py-2 bg-black/50 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/10 transition-all shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-sm tracking-wider uppercase">Return</span>
        </button>
      </div>

      {/* AI Chat Layout - Centered Bottom */}
      <div className="pointer-events-auto w-full max-w-2xl px-4 flex flex-col gap-4 items-center">
        
        {/* Messages Area - Collapsible/Floating */}
        <AnimatePresence>
          {(messages.length > 0 || isExpanded) && (
            <motion.div 
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              className="w-full bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[50vh]"
            >
              {/* Header */}
              <div className="p-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg">
                         <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                         <h2 className="text-white font-bold text-sm tracking-tight">{selectedPlanet.name} AI</h2>
                         <p className="text-cyan-400 text-[10px] font-mono tracking-wider">ONLINE</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                     onClick={() => setIsExpanded(!isExpanded)}
                     className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                   >
                     {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                   </button>
                </div>
              </div>

              {/* Chat Content */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[400px]">
                   {messages.length === 0 && (
                       <div className="text-center text-white/40 mt-8 space-y-2">
                           <Sparkles className="w-6 h-6 mx-auto opacity-50 mb-2" />
                           <p className="text-sm">Ask about {selectedPlanet.name}...</p>
                       </div>
                   )}
                   
                   {messages.map((msg, i) => (
                       <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                               msg.role === 'user' 
                               ? 'bg-cyan-600/80 text-white rounded-tr-none backdrop-blur-sm' 
                               : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5 backdrop-blur-sm'
                           }`}>
                               {msg.content}
                           </div>
                       </div>
                   ))}
                   
                   {isLoading && (
                       <div className="flex justify-start">
                           <div className="bg-white/10 text-white/50 rounded-2xl rounded-tl-none px-4 py-2 text-xs animate-pulse">
                               Thinking...
                           </div>
                       </div>
                   )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area - Always visible at bottom */}
        <div className="w-full relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl opacity-30 group-hover:opacity-60 transition duration-500 blur"></div>
            
            <div className="relative flex items-end gap-2 bg-black/90 rounded-3xl p-2 border border-white/10">
                <div className="pl-3 py-3 text-cyan-400">
                    <Sparkles className="w-5 h-5" />
                </div>
                
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder={`Ask about ${selectedPlanet.name}...`}
                    rows={1}
                    className="flex-1 bg-transparent border-none text-white placeholder-white/40 focus:ring-0 focus:outline-none resize-none py-3 max-h-[150px] overflow-y-auto text-sm font-sans scrollbar-hide"
                    style={{ minHeight: '44px' }}
                />
                
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl text-white shadow-lg hover:shadow-cyan-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none transition-all flex-shrink-0 mb-0.5"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
