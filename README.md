# 🌌 Solar System Explorer (Krazy Project)

A breathtaking, interactive 3D solar system exploration experience built with **Next.js**, **React Three Fiber**, and **Tailwind CSS**.

> **🚀 Built by Antigravity**
>
> This entire project—from the 3D physics engine to the React UI—was designed and coded by **[Antigravity](https://antigravity.google/)**, an advanced AI coding agent powered by Google's **Gemini 3 Pro** model.

## 🚀 Overview

This project is a high-fidelity 3D simulation of our solar system. It allows users to:

- **Orbit** around planets with realistic textures and lighting.
- **Land** on Earth for a detailed, interactive globe view using satellite imagery.
- **Fly** a spaceship through the cosmos.
- **Learn** about celestial bodies with detailed information panels.

The application focuses on premium aesthetics, smooth performance, and an immersive user interface.

## ✨ Key Features

- **Hyper-Realistic 3D Planets**: High-resolution textures, atmospheric glows, and accurate scaling (relative).
- **Interactive Earth Mode**: seamless integration with MapTiler for high-detail satellite views of Earth.
- **Spaceship Navigation**: Switch to flight mode and pilot your own vessel through the void.
- **Dynamic Lighting**: Realistic sun lighting and shadows powered by Three.js.
- **Immersive Audio**: Background ambience and sound effects for a complete experience.
- **Sleek HUD**: Futuristic Heads-Up Display for navigation and information.
- **Educational Data**: Real-time stats and facts about every planet.

## 🔄 User Flow

1.  **Exploration Mode (Launch)**:
    - Users start in a cinematic orbit of the solar system.
    - They can pan, rotate, and zoom to admire the celestial bodies.
    - Selecting a planet focuses the camera on it and displays vital statistics.

2.  **Interactive Deep Dive (Earth)**:
    - Clicking on Earth transitions to a high-fidelity interactive globe.
    - Users can search for specific locations, view satellite imagery, and see real-time day/night cycles.
    - The **"Earth AI"** chat interface becomes available to answer questions about geography and climate.

3.  **Spaceship Command**:
    - Users can engage "Flight Mode" to take manual control of a spaceship.
    - The camera snaps to a third-person view behind the ship.
    - Pilots can fly freely through space, visiting any planet at their own pace.

4.  **Interactive Chat Bot for Each Planet**:
    - While exploring any planet, users can open the **AI Chat** panel.
    - Powered by Gemini, this assistant provides persona-based responses relevant to the specific planet being viewed.
    - Ask about the Great Red Spot on Jupiter or the rings of Saturn to get detailed, scientific answers.

## ⚡ Powered by Google Technologies

This project leverages cutting-edge tools from Google to enhance the user experience:

- **[Google Generative AI (Gemini)](https://ai.google.dev/)**: The core of the "Earth AI" assistant. We use the `gemini-2.5-flash` and `pro` models to provide:
  - Real-time, context-aware astronomical answers.
  - Interactive storytelling about celestial bodies.
  - Dynamic responses based on the currently selected planet.
- **[Google Fonts](https://fonts.google.com/)**: Utilizes `next/font/google` for zero-layout-shift, high-performance typography (Geist & Geist Mono).

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **3D Engine**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Geospacial Data**: [MapTiler API](https://www.maptiler.com/) & [React Globe.gl](https://github.com/vasturiano/react-globe.gl)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🎮 Controls

| Action                 | Control                          |
| :--------------------- | :------------------------------- |
| **Orbit Camera**       | Left Mouse Drag                  |
| **Zoom**               | Scroll Wheel                     |
| **Pan**                | Right Mouse Drag (in some modes) |
| **Select Planet**      | Click on a planet                |
| **Toggle Flight Mode** | Press `F` or use the UI button   |
| **Spaceship Movement** | `W`, `A`, `S`, `D` keys          |
| **Spaceship Boost**    | `Shift` key                      |

## 📦 Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/PixelPandaWorks/Krazy-Project.git
   cd Krazy-Project
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your keys:

   ```env
   NEXT_PUBLIC_MAPTILER_API_KEY=your_maptiler_key_here
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
