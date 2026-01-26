"use client";

import { useStore } from "@/lib/store";
import { ArrowLeft, Send, Sparkles, Bot } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function PlanetDetails() {
  const { selectedPlanet, setSelectedPlanet } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Clear chat when planet changes
  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [selectedPlanet?.name]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!selectedPlanet || selectedPlanet.name === "Earth") return null;

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
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
    } catch {
        setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Connection lost to AI core." }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-between p-6 md:p-8">
      {/* Header / Back Button */}
      <div className="pointer-events-auto flex items-center justify-between">
        <button
          onClick={() => setSelectedPlanet(null)}
          className="flex items-center gap-2 group px-4 py-2 bg-black/50 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/10 transition-all shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-sm tracking-wider uppercase">Return</span>
        </button>
      </div>

      {/* AI Chat Panel - Replaces the bottom info card */}
      <div className="pointer-events-auto w-full md:max-w-md ml-auto mt-auto bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
         {/* Decoration */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
        
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg animate-pulse-slow">
                     <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                     <h2 className="text-white font-bold tracking-tight">{selectedPlanet.name} AI</h2>
                     <p className="text-cyan-400 text-xs font-mono tracking-wider">ONLINE // ASK ME ANYTHING</p>
                </div>
            </div>
            {/* Quick stats mini-display */}
            <div className="text-right hidden sm:block">
                 <p className="text-white/60 text-xs uppercase font-mono">Temp</p>
                 <p className="text-white font-bold text-sm">{selectedPlanet.stats.temp}</p>
            </div>
        </div>
        
        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
             {messages.length === 0 && (
                 <div className="text-center text-white/40 mt-10 space-y-2">
                     <Sparkles className="w-8 h-8 mx-auto opacity-50 mb-2" />
                     <p>Ask about {selectedPlanet.name}'s surface, atmosphere, or history.</p>
                     <p className="text-xs">Examples: "Is there water?" "How long is a year?"</p>
                 </div>
             )}
             
             {messages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                         msg.role === 'user' 
                         ? 'bg-cyan-600 text-white rounded-tr-none' 
                         : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5'
                     }`}>
                         {msg.content}
                     </div>
                 </div>
             ))}
             
             {isLoading && (
                 <div className="flex justify-start">
                     <div className="bg-white/10 text-white/50 rounded-2xl rounded-tl-none px-4 py-3 text-xs animate-pulse">
                         Analyzing planetary data...
                     </div>
                 </div>
             )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-black/40">
            <div className="relative flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask about ${selectedPlanet.name}...`}
                    className="flex-1 bg-white/5 border border-white/10 focus:border-cyan-400 rounded-full pl-4 pr-12 py-3 text-white placeholder-white/30 focus:outline-none transition-all font-sans text-sm"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1 top-1 p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}
