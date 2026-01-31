/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";
import { ArrowLeft, Layers, Search, Send, Sparkles, Bot } from "lucide-react";

// Dynamically import Globe with no SSR
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function InteractiveGlobe() {
  const { setSelectedPlanet } = useStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeEl = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && globeEl.current) {
        // Auto-rotate
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 0.5;
        globeEl.current.pointOfView({ altitude: 2 }, 2000);
    }
  }, [mounted]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || "";

  // Debounce helper (simple implementation)
  const debounceRef = useRef<NodeJS.Timeout>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
        setSuggestions([]);
        return;
    }

    debounceRef.current = setTimeout(async () => {
        try {
            const res = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(value)}.json?key=${MAPTILER_KEY}&fuzzyMatch=true&limit=5`);
            const data = await res.json();
            if (data.features) {
                setSuggestions(data.features);
            }
        } catch (error) {
            console.error("Autocomplete failed:", error);
        }
    }, 300);
  };

  const selectLocation = (feature: any) => {
    const [lng, lat] = feature.center;
    const placeName = feature.place_name;

    setSearchQuery(placeName);
    setSuggestions([]);
    setShowSuggestions(false);

    // 1. Zoom out first to show the whole Earth
    if (globeEl.current) {
        globeEl.current.controls().autoRotate = false;
        globeEl.current.pointOfView({ altitude: 2.5 }, 1200);

        // 2. Then fly to location with EXTREME zoom
        setTimeout(() => {
          if (globeEl.current) {
            globeEl.current.pointOfView({ lat, lng, altitude: 0.001 }, 3200);
          }
        }, 1200);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
        selectLocation(suggestions[0]);
    }
  };

  // Chat handler
  const handleChatSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg: Message = { role: "user", content: chatInput };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                planetName: "Earth",
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
        setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Connection lost to AI core." }]);
    } finally {
        setIsChatLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      {/* HUD Header */}
      <div className="absolute top-0 left-0 w-full p-6 z-50 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
             <button 
              onClick={() => setSelectedPlanet(null)}
              className="flex items-center gap-2 px-5 py-2.5 bg-black/60 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-white/10 hover:border-cyan-400/50 transition-all font-mono uppercase tracking-wider text-xs shadow-lg group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-cyan-400" />
              <span>Solar System</span>
            </button>
            <div className="h-8 w-px bg-white/20" />
            <h1 className="text-2xl font-bold text-white tracking-widest font-mono">EARTH <span className="text-cyan-400 text-sm align-top">LIVE</span></h1>
        </div>

        {/* Search Bar */}
        <div className="relative pointer-events-auto group z-50">
            <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className={`w-4 h-4 ${isSearching ? 'text-cyan-400 animate-pulse' : 'text-white/50'}`} />
                </div>
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search location..." 
                    className="pl-10 pr-4 py-2.5 bg-black/80 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 w-80 transition-all shadow-lg font-sans text-sm"
                />
            </form>
            
            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-2xl">
                    {suggestions.map((item: any) => (
                        <button
                            key={item.id}
                            onClick={() => selectLocation(item)}
                            className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-cyan-500/20 hover:text-white transition-colors border-b border-white/10 last:border-0 truncate"
                        >
                            {item.place_name}
                        </button>
                    ))}
                </div>
            )}
        </div>

        <div className="flex gap-3 pointer-events-auto">
             <button className="p-3 bg-black/60 backdrop-blur-md border border-white/20 rounded-full hover:bg-cyan-500/20 hover:border-cyan-400 transition-all text-white shadow-lg" title="Toggle Layers">
                <Layers className="w-5 h-5" />
             </button>
        </div>
      </div>

      {/* Main Globe */}
      <div className="flex-1 relative cursor-move">
          {mounted && (
            <Globe
              ref={globeEl}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
              backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
              // @ts-ignore - tileEngineUrl property might be missing in types but exists in implementation
              globeTileEngineUrl={(x: number, y: number, l: number) => {
                 if (l < 2) return null; // Use base texture for low zoom to save API calls
                 return `https://api.maptiler.com/maps/satellite/${l}/${x}/${y}.jpg?key=${MAPTILER_KEY}`;
              }}

              atmosphereColor="lightskyblue"
              atmosphereAltitude={0.15}
              animateIn={true}
              // Basic interaction config
              onGlobeClick={() => {
                  if (globeEl.current) {
                      globeEl.current.controls().autoRotate = false;
                      setShowSuggestions(false);
                  }
              }}
            />
          )}
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-6 left-6 z-50 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 max-w-sm text-white/80 text-sm leading-relaxed shadow-lg">
            <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Interactive Mode
            </h3>
            <p>Drag to rotate. Scroll to zoom. High-resolution satellite imagery.</p>
        </div>
      </div>

      {/* AI Chat Panel - Bottom Right */}
      <div className="absolute bottom-6 right-6 z-50 pointer-events-auto w-full max-w-sm">
        <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[400px]">
          {/* Decoration */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500" />
          
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-cyan-600 flex items-center justify-center shadow-lg animate-pulse-slow">
                       <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                       <h2 className="text-white font-bold tracking-tight">Earth AI</h2>
                       <p className="text-green-400 text-xs font-mono tracking-wider">ONLINE // ASK ME ANYTHING</p>
                  </div>
              </div>
              <div className="text-right hidden sm:block">
                   <p className="text-white/60 text-xs uppercase font-mono">Avg Temp</p>
                   <p className="text-white font-bold text-sm">15°C</p>
              </div>
          </div>
          
          {/* Messages Area */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
               {messages.length === 0 && (
                   <div className="text-center text-white/40 mt-10 space-y-2">
                       <Sparkles className="w-8 h-8 mx-auto opacity-50 mb-2" />
                       <p>Ask about Earth's geography, climate, or ecosystems.</p>
                       <p className="text-xs">Examples: "What's the tallest mountain?" "Why is the sky blue?"</p>
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
               
               {isChatLoading && (
                   <div className="flex justify-start">
                       <div className="bg-white/10 text-white/50 rounded-2xl rounded-tl-none px-4 py-3 text-xs animate-pulse">
                           Analyzing Earth data...
                       </div>
                   </div>
               )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleChatSend} className="p-4 border-t border-white/10 bg-black/40">
              <div className="relative flex items-center gap-2">
                  <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about Earth..."
                      className="flex-1 bg-white/5 border border-white/10 focus:border-cyan-400 rounded-full pl-4 pr-12 py-3 text-white placeholder-white/30 focus:outline-none transition-all font-sans text-sm"
                  />
                  <button 
                    type="submit"
                    disabled={!chatInput.trim() || isChatLoading}
                    className="absolute right-1 top-1 p-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full text-white shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                  >
                      <Send className="w-4 h-4" />
                  </button>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
}
