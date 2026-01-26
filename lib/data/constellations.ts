
export interface Star {
  name: string;
  ra: number; // Right Ascension in degrees (0-360)
  dec: number; // Declination in degrees (-90 to +90)
  magnitude: number;
  color?: string; // Optional color override
}

export interface Constellation {
  name: string;
  stars: Star[];
  connections: [number, number][]; // Indices in the stars array to connect
}

// Helper to convert RA (h, m, s) to degrees
// RA 1h = 15 degrees
const ra = (h: number, m: number, s: number) => {
  return (h + m / 60 + s / 3600) * 15;
};

// Helper to convert Dec (d, m, s) to degrees
const dec = (d: number, m: number, s: number) => {
  const sign = d < 0 ? -1 : 1;
  return sign * (Math.abs(d) + m / 60 + s / 3600);
};

export const constellations: Constellation[] = [
  {
    name: "Orion",
    stars: [
      { name: "Betelgeuse", ra: ra(5, 55, 10), dec: dec(7, 24, 25), magnitude: 0.42, color: "#ff8c00" }, // Red Supergiant
      { name: "Rigel", ra: ra(5, 14, 32), dec: dec(-8, 12, 6), magnitude: 0.12, color: "#add8e6" }, // Blue Supergiant
      { name: "Bellatrix", ra: ra(5, 25, 7), dec: dec(6, 20, 59), magnitude: 1.64 },
      { name: "Mintaka", ra: ra(5, 32, 0), dec: dec(-0, 17, 57), magnitude: 2.23 },
      { name: "Alnilam", ra: ra(5, 36, 12), dec: dec(-1, 12, 7), magnitude: 1.70 },
      { name: "Alnitak", ra: ra(5, 40, 45), dec: dec(-1, 56, 34), magnitude: 1.77 },
      { name: "Saiph", ra: ra(5, 47, 45), dec: dec(-9, 40, 10), magnitude: 2.06 },
    ],
    connections: [
      [0, 2], // Betelgeuse - Bellatrix (Shoulders)
      [0, 5], // Betelgeuse - Alnitak
      [2, 3], // Bellatrix - Mintaka
      [3, 4], // Mintaka - Alnilam (Belt)
      [4, 5], // Alnilam - Alnitak (Belt)
      [3, 1], // Mintaka - Rigel
      [5, 6], // Alnitak - Saiph
      [1, 6], // Rigel - Saiph (Legs)
    ]
  },
  {
    name: "Ursa Major (Big Dipper)",
    stars: [
      { name: "Dubhe", ra: ra(11, 3, 43), dec: dec(61, 45, 3), magnitude: 1.79, color: "#ffa500" },
      { name: "Merak", ra: ra(11, 1, 50), dec: dec(56, 22, 56), magnitude: 2.37 },
      { name: "Phecda", ra: ra(11, 53, 49), dec: dec(53, 41, 41), magnitude: 2.44 },
      { name: "Megrez", ra: ra(12, 11, 39), dec: dec(57, 1, 57), magnitude: 3.31 },
      { name: "Alioth", ra: ra(12, 54, 1), dec: dec(55, 57, 35), magnitude: 1.77 },
      { name: "Mizar", ra: ra(13, 23, 55), dec: dec(54, 55, 31), magnitude: 2.27 },
      { name: "Alkaid", ra: ra(13, 47, 32), dec: dec(49, 18, 47), magnitude: 1.86 },
    ],
    connections: [
      [0, 1], // Dubhe - Merak (Pointer stars)
      [1, 2], // Merak - Phecda
      [2, 3], // Phecda - Megrez
      [3, 0], // Megrez - Dubhe (Bowl)
      [3, 4], // Megrez - Alioth (Handle start)
      [4, 5], // Alioth - Mizar
      [5, 6], // Mizar - Alkaid
    ]
  },
  {
    name: "Cassiopeia",
    stars: [
      { name: "Schedar", ra: ra(0, 40, 30), dec: dec(56, 32, 14), magnitude: 2.24, color: "#ffa500" },
      { name: "Caph", ra: ra(0, 9, 10), dec: dec(59, 1, 44), magnitude: 2.28 },
      { name: "Gamma Cas", ra: ra(0, 56, 42), dec: dec(60, 43, 0), magnitude: 2.15 },
      { name: "Ruchbah", ra: ra(1, 25, 48), dec: dec(60, 14, 7), magnitude: 2.68 },
      { name: "Segin", ra: ra(1, 54, 36), dec: dec(63, 40, 12), magnitude: 3.37 },
    ],
    connections: [
      [1, 0], // Caph - Schedar
      [0, 2], // Schedar - Gamma
      [2, 3], // Gamma - Ruchbah
      [3, 4], // Ruchbah - Segin
    ]
  },
  {
    name: "Ursa Minor (Little Dipper)",
    stars: [
      { name: "Polaris", ra: ra(2, 31, 49), dec: dec(89, 15, 50), magnitude: 1.97, color: "#fffacd" },
      { name: "Yildun", ra: ra(17, 32, 12), dec: dec(86, 35, 11), magnitude: 4.35 },
      { name: "Epsilon UMi", ra: ra(16, 45, 58), dec: dec(82, 2, 14), magnitude: 4.21 },
      { name: "Zeta UMi", ra: ra(15, 44, 4), dec: dec(77, 47, 40), magnitude: 4.29 },
      { name: "Kochab", ra: ra(14, 50, 42), dec: dec(74, 9, 20), magnitude: 2.08, color: "#ffa500" },
      { name: "Pherkad", ra: ra(15, 20, 43), dec: dec(71, 50, 2), magnitude: 3.05 },
      { name: "Eta UMi", ra: ra(16, 17, 30), dec: dec(75, 45, 19), magnitude: 4.95 },
    ],
    connections: [
      [0, 1], // Polaris - Yildun
      [1, 2], // Yildun - Epsilon
      [2, 3], // Epsilon - Zeta
      [3, 4], // Zeta - Kochab
      [4, 5], // Kochab - Pherkad
      [5, 6], // Pherkad - Eta
      [6, 3], // Eta - Zeta (Bowl close)
    ]
  },
  {
    name: "Crux",
    stars: [
      { name: "Acrux", ra: ra(12, 26, 35), dec: dec(-63, 5, 56), magnitude: 0.77, color: "#add8e6" },
      { name: "Mimosa", ra: ra(12, 47, 43), dec: dec(-59, 41, 19), magnitude: 1.25, color: "#add8e6" },
      { name: "Gacrux", ra: ra(12, 31, 9), dec: dec(-57, 6, 47), magnitude: 1.59, color: "#ff4500" },
      { name: "Delta Crucis", ra: ra(12, 15, 9), dec: dec(-58, 44, 56), magnitude: 2.79 },
      { name: "Epsilon Crucis", ra: ra(12, 21, 21), dec: dec(-60, 24, 4), magnitude: 3.59 },
    ],
    connections: [
      [0, 2], // Acrux - Gacrux (Long bar)
      [1, 3], // Mimosa - Delta (Cross bar)
    ]
  },
  {
    name: "Scorpius",
    stars: [
      { name: "Antares", ra: ra(16, 29, 24), dec: dec(-26, 25, 55), magnitude: 0.96, color: "#ff4500" },
      { name: "Graffias", ra: ra(16, 0, 20), dec: dec(-19, 48, 18), magnitude: 2.56 },
      { name: "Dschubba", ra: ra(16, 0, 20), dec: dec(-22, 37, 18), magnitude: 2.29 },
      { name: "Pi Scorpii", ra: ra(15, 58, 51), dec: dec(-26, 6, 50), magnitude: 2.89 },
      { name: "Epsilon Scorpii", ra: ra(16, 50, 10), dec: dec(-34, 17, 36), magnitude: 2.29 },
      { name: "Shaula", ra: ra(17, 33, 36), dec: dec(-37, 6, 13), magnitude: 1.62 },
      { name: "Lesath", ra: ra(17, 30, 45), dec: dec(-37, 17, 44), magnitude: 2.70 },
    ],
    connections: [
      [1, 2], // Head
      [2, 0], // Head - Antares
      [0, 4], // Antares - Body
      [4, 5], // Body - Shaula (Stinger)
      [5, 6], // Shaula - Lesath
    ]
  },
   {
    name: "Canis Major",
    stars: [
      { name: "Sirius", ra: ra(6, 45, 8), dec: dec(-16, 42, 58), magnitude: -1.46, color: "#ffffff" },
      { name: "Mirzam", ra: ra(6, 22, 42), dec: dec(-17, 57, 21), magnitude: 1.98 },
      { name: "Wezen", ra: ra(7, 8, 23), dec: dec(-26, 23, 35), magnitude: 1.83 },
      { name: "Adhara", ra: ra(6, 58, 37), dec: dec(-28, 58, 19), magnitude: 1.5 },
      { name: "Aludra", ra: ra(7, 24, 5), dec: dec(-29, 18, 11), magnitude: 2.45 },
    ],
    connections: [
      [0, 1], // Sirius - Mirzam
      [0, 3], // Sirius - Adhara
      [3, 2], // Adhara - Wezen
      [2, 4], // Wezen - Aludra
    ]
  },
  {
    name: "Leo",
    stars: [
      { name: "Regulus", ra: ra(10, 8, 22), dec: dec(11, 58, 1), magnitude: 1.36, color: "#add8e6" },
      { name: "Algieba", ra: ra(10, 19, 58), dec: dec(19, 50, 29), magnitude: 2.01 },
      { name: "Denebola", ra: ra(11, 49, 3), dec: dec(14, 34, 19), magnitude: 2.14 },
      { name: "Zosma", ra: ra(11, 14, 6), dec: dec(20, 31, 25), magnitude: 2.56 },
      { name: "Adhafera", ra: ra(10, 16, 41), dec: dec(23, 25, 0), magnitude: 3.44 },
    ],
    connections: [
      [0, 1], // Regulus - Algieba (Sickle/Head)
      [1, 4], // Algieba - Adhafera
      [1, 3], // Algieba - Zosma (Body)
      [3, 2], // Zosma - Denebola (Tail)
    ]
  },
  {
    name: "Cygnus",
    stars: [
      { name: "Deneb", ra: ra(20, 41, 25), dec: dec(45, 16, 49), magnitude: 1.25, color: "#ffffff" },
      { name: "Sadr", ra: ra(20, 22, 13), dec: dec(40, 15, 24), magnitude: 2.23 },
      { name: "Albireo", ra: ra(19, 30, 43), dec: dec(27, 57, 34), magnitude: 3.05, color: "#ffd700" },
      { name: "Delta Cyg", ra: ra(19, 44, 58), dec: dec(45, 7, 5), magnitude: 2.86 },
      { name: "Gienah", ra: ra(20, 46, 12), dec: dec(33, 58, 13), magnitude: 2.48 },
    ],
    connections: [
      [0, 1], // Deneb - Sadr
      [1, 2], // Sadr - Albireo (Long neck)
      [1, 3], // Sadr - Delta (Wing)
      [1, 4], // Sadr - Gienah (Wing)
    ]
  },
  {
    name: "Gemini",
    stars: [
      { name: "Pollux", ra: ra(7, 45, 18), dec: dec(28, 1, 34), magnitude: 1.16, color: "#ffa500" },
      { name: "Castor", ra: ra(7, 34, 36), dec: dec(31, 53, 18), magnitude: 1.58, color: "#ffffff" },
      { name: "Alhena", ra: ra(6, 37, 42), dec: dec(16, 23, 57), magnitude: 1.93 },
      { name: "Wasat", ra: ra(7, 20, 7), dec: dec(21, 58, 56), magnitude: 3.50 },
    ],
    connections: [
      [0, 1], // Pollux - Castor
      [0, 3], // Pollux - Wasat (Body)
      [1, 2], // Castor - Alhena (Body)
    ]
  },
];
