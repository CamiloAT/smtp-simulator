# SMTP Simulator

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

An interactive educational simulator of the **SMTP (Simple Mail Transfer Protocol)**. It allows users to visualize and understand how emails are sent step by step, from client configuration through relay servers to the final recipient, using drag-and-drop network topology building and real-time protocol simulation.

---

## Main Features

- **Static Simulation** — Step-by-step SMTP protocol visualization with command/response pairs for learning the basics
- **Dynamic Simulation** — Drag-and-drop canvas to build custom network topologies with clients and servers
- **Example Topology** — Pre-built SMTP topology (clients, relay servers, recipients) to run simulations instantly
- **Email Configuration** — Modal-based email composer to set sender, recipient, subject, and message before simulation
- **Real-time Communication Log** — Dark-themed live log panel showing every SMTP command and response sequentially
- **Smooth Page Transitions** — Animated loading screens with envelope icon when navigating between views

---

## Pages & Views

| View | Description |
|---|---|
| `/` — **Static Simulator** | Predefined SMTP simulation with 7 protocol steps, email configuration, and real-time log. Ideal for learning the protocol basics. |
| `/simulator` — **Dynamic Simulator** | Drag-and-drop canvas to build custom SMTP topologies. Supports adding/removing clients and servers, configuring domains and ports, connecting elements, and running simulations on your own network design. |

---

## Execution and Development Guide

1. **Clone the repository**
   ```bash
   git clone https://github.com/CamiloAT/SMTPsimulator-feature-dinamic-simulator.git
   cd SMTPsimulator-feature-dinamic-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production** (optional)
   ```bash
   npm run build
   ```

> **Note:** Node.js 18+ is required. The project uses Vite as the build tool.

---

## Project Structure

```text
SMTPsimulator-feature-dinamic-simulator/
├── public/                              # Static assets (favicon, logo)
├── src/
│   ├── components/                      # Shared React components
│   │   ├── CommunicationLog.jsx         #   Real-time log panel with auto-scroll
│   │   ├── EmailConfiguration.jsx       #   Email config form (from/to/subject/message)
│   │   ├── LoadingScreen.jsx            #   Animated page transition overlay
│   │   ├── ProtocolInfo.jsx             #   SMTP technical reference card
│   │   ├── ProtocolSteps.jsx            #   Step-by-step protocol progress
│   │   ├── SimulationControls.jsx       #   Start/stop/reset simulation controls
│   │   └── index.js                     #   Barrel exports
│   ├── hooks/
│   │   └── useSmtpSimulation.js         # Custom hook for static simulation logic
│   ├── pages/
│   │   ├── Home/                        # Static simulator view (/)
│   │   │   └── index.jsx
│   │   └── Simulator/                   # Dynamic drag-and-drop simulator (/simulator)
│   │       └── index.jsx
│   ├── SMTPSimulator.jsx                # Static simulator page component
│   ├── App.jsx                          # Router configuration
│   ├── index.jsx                        # React entry point
│   └── index.css                        # Tailwind directives + custom animations
├── index.html                           # Vite root HTML
├── vite.config.js                       # Vite configuration
├── tailwind.config.js                   # Tailwind CSS configuration
└── package.json                         # Dependencies and scripts
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19.1.0 |
| Build Tool | Vite 8.1.0 |
| Styling | Tailwind CSS 3.4.17 |
| Routing | React Router DOM 7.6.1 |
| Icons | Lucide React 0.511.0 |

---

## Authors

| Name | GitHub |
|---|---|
| *Diego Fernando Aguirre Tenjo* | [@elcokiin](https://github.com/elcokiin) |
| *Camilo Andres Arias Tenjo* | [@CamiloAT](https://github.com/CamiloAT) |
| *Katlyn Jennelis Galvis Rodriguez* | [@Katlyng](https://github.com/Katlyng) |
| *Gabriel Santiago Cely Forero* | [@Gabigool](https://github.com/Gabigool) |

*Data Transmission Protocols*
