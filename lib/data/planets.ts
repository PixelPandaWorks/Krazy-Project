export interface PlanetData {
  name: string;
  size: number;
  distance: number;
  speed: number;
  texture: string;
  ring?: string;
  color?: string;
  moon?: boolean;
  description: string;
  stats: {
    temp: string;
    gravity: string;
    day: string;
    year: string;
  };
}

export const planets: PlanetData[] = [
  { 
    name: "Mercury", 
    size: 0.4, 
    distance: 10, 
    speed: 1.5, 
    texture: "/mercury.jpg",
    description: "The smallest planet in our solar system and closest to the Sun.",
    stats: { temp: "167°C", gravity: "3.7 m/s²", day: "59d", year: "88d" } 
  },
  { 
    name: "Venus", 
    size: 0.7, 
    distance: 15, 
    speed: 1.2, 
    texture: "/venus.jpg",
    description: "Second planet from the Sun. It has a thick atmosphere efficiently trapping heat.",
    stats: { temp: "464°C", gravity: "8.87 m/s²", day: "243d", year: "225d" } 
  },
  { 
    name: "Earth", 
    size: 0.8, 
    distance: 20, 
    speed: 1, 
    texture: "/earth_day.png",
    description: "Our home. The only known planet in the universe to harbor life.",
    stats: { temp: "15°C", gravity: "9.8 m/s²", day: "24h", year: "365d" } 
  },
  { 
    name: "Mars", 
    size: 0.5, 
    distance: 25, 
    speed: 1, 
    texture: "/mars.jpg",
    description: "The Red Planet. Dusty, cold, desert world with a very thin atmosphere.",
    stats: { temp: "-65°C", gravity: "3.7 m/s²", day: "24h 37m", year: "687d" } 
  },
  { 
    name: "Jupiter", 
    size: 2.5, 
    distance: 35, 
    speed: 0.5, 
    texture: "/jupiter.jpg",
    description: "The largest planet. A gas giant with a Great Red Spot storm.",
    stats: { temp: "-110°C", gravity: "24.79 m/s²", day: "9h 56m", year: "12y" } 
  },
  { 
    name: "Saturn", 
    size: 2, 
    distance: 45, 
    speed: 0.4, 
    texture: "/saturn.jpg", 
    ring: "/saturn_ring.jpg",
    description: "Adorned with a dazzling, complex system of icy rings.",
    stats: { temp: "-140°C", gravity: "10.44 m/s²", day: "10h 34m", year: "29y" } 
  },
  { 
    name: "Uranus", 
    size: 1.5, 
    distance: 55, 
    speed: 0.3, 
    texture: "/neptune.jpg", 
    color: "#7ED6DF",
    description: "An ice giant. It rotates at a nearly 90-degree angle from the plane of its orbit.",
    stats: { temp: "-195°C", gravity: "8.69 m/s²", day: "17h 14m", year: "84y" } 
  },
  { 
    name: "Neptune", 
    size: 1.5, 
    distance: 65, 
    speed: 0.2, 
    texture: "/neptune.jpg",
    description: "Dark, cold and whipped by supersonic winds. It is the last of the planets.",
    stats: { temp: "-200°C", gravity: "11.15 m/s²", day: "16h 6m", year: "165y" } 
  },
];
