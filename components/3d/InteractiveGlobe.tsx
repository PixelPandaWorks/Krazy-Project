/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";
import { ArrowLeft, Layers, Search } from "lucide-react";

// Dynamically import Globe with no SSR
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export function InteractiveGlobe() {
  const { setSelectedPlanet } = useStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeEl = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [markers, setMarkers] = useState<any[]>([]);
  const [rings, setRings] = useState<any[]>([]);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

    // Fly to location with DEEP zoom
    if (globeEl.current) {
        globeEl.current.controls().autoRotate = false;
        // 0.015 altitude is very close (approx max zoom before clipping)
        globeEl.current.pointOfView({ lat, lng, altitude: 0.015 }, 2500);
    }

    // Truncate overly long names
    const shortName = placeName.length > 40 ? placeName.substring(0, 40) + "..." : placeName;
    
    // Set Marker (Text + Dot)
    setMarkers([{ lat, lng, name: shortName, size: 10, color: "white" }]);

    // Set Red Highlight Ring
    setRings([{ lat, lng }]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
        selectLocation(suggestions[0]);
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
              
              // Search Markers (Label + Dot)
              labelsData={markers}
              labelLat={(d: any) => d.lat}
              labelLng={(d: any) => d.lng}
              labelText={(d: any) => d.name}
              labelSize={0.1} // Small text
              labelDotRadius={0.04} // Small dot
              labelColor={() => "white"}
              labelResolution={3}
              labelAltitude={0.001} // Slightly raised

              // Red Highlight Rings
              ringsData={rings}
              ringLat={(d: any) => d.lat}
              ringLng={(d: any) => d.lng}
              ringColor={() => "#ff0000"} // Red border
              ringMaxRadius={2} // Size of the ring (in degrees)
              ringPropagationSpeed={2} // Pulse speed
              ringRepeatPeriod={800} // Pulse frequency

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
    </div>
  );
}
