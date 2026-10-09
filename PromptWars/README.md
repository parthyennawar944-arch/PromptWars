# 🌆 UrbanWay — Smart, Safe & Seamless Urban Exploration

> **Hackathon Track:** City Life: Exploring, Experiencing & Navigating the Chaos We Call Home  
> **Built for:** PromptWars 2026

![UrbanWay Hero](assets/images/hero.jpg)

---

## 🌟 Executive Summary

**UrbanWay** is an AI-powered, interactive global urban exploration web platform that converts scattered real-world city data into verified, actionable navigation insights. It solves urban fragmentation by bridging **delight (hidden culinary gems, heritage landmarks, budget stays)** with **safety (illuminated corridors, crowd density, hazard blackspots, and crowdsourced citizen alerts)** anywhere in the world.

---

## 🚀 Live Demo & How to Run

### Method 1: Local Server (Recommended)
The project includes a lightweight, zero-dependency PowerShell HTTP server:
```powershell
# In PowerShell:
powershell -ExecutionPolicy Bypass -File .\serve.ps1 -Port 8080
```
Open **[http://localhost:8080/](http://localhost:8080/)** in your browser.

### Method 2: Direct File Open
You can also directly double-click or open `index.html` in any modern web browser (Chrome, Edge, Firefox, Brave, Safari).

---

## 🎯 Feature Architecture & Implemented Suites

### 1. 🛡️ "Safe Walk" Companion & Emergency Alert
* **Safe Walk Exclusive Routing:** Navigation mode restricting pedestrian routes exclusively to verified Grade-A illuminated corridors (100% LED lighting, active police patrol kiosks, zero unlit alleys).
* **Emergency SOS / Shake Alert:**
  * Prominent header and floating beacon button (`#floatingSosBtn`) with siren ring animation.
  * Shake alert detection simulated via keyboard hotkey (`'s'`).
  * Live simulated GPS telemetry: `28.6225° N, 77.2160° E` with ±4m accuracy and nearest sanctuary locator (Sector 7 Police Kiosk, 140m).
  * One-tap hotlines: Police (112), Women SOS Helpline (1091), Ambulance (108), Metro Transit Patrol (1512).
  * **Broadcast Distress Signal Action:** Instantly triggers high-priority alert pinned to map and live feed with police dispatch notification.

### 2. ⚡ AI-Powered "Chaos-to-Calm" Dynamic Itinerary Builder
* **User Input Controls:**
  * Budget tier selection: **$ Budget**, **$$ Moderate**, **$$$ Upscale**.
  * Time availability window: **2 Hours**, **4 Hours (Half Day)**, **8 Hours (Full Day)**.
  * Interest matrix: Local Food, Heritage Lore, Calm Sanctuaries, 100% SafeWalk Only.
* **Smart Synthesis:** Generates step-by-step itinerary with exact time windows, estimated costs, and walking corridors.
* **"Simulate Weather/Traffic Reroute":** One-click button simulating sudden rainstorms or gridlock; instantly reroutes the user to covered subterranean pavilions, climate-controlled rooftop conservatories, and covered heritage arcades with an animated notice banner.

### 3. 🗺️ Visual "Best vs. Worst" City Heatmap Overlays & Comparison
* **Map Layer Selector Dropdown:**
  * 🛡️ **Safety Score Heatmap:** Green (>80), Yellow (60-80), Red (<60) polygons across 5 distinct city sectors.
  * 🧹 **Cleanliness Index Heatmap**
  * 💰 **Affordability Heatmap** (Budget-friendly green vs. expensive red/amber)
  * ♿ **Accessibility Heatmap**
* **Interactive Polygon Tooltips:** Hovering displays sector status, dominant vibe, and numerical scores.
* **Side-by-Side Zone Comparison Modal:** Select any two city sectors (e.g. Cyber Core vs Old Canal Strip) to compare side-by-side using real-time progress bars, metric scores, and a winner badge.

### 4. 🏆 Micro-Gamification: Explorer Badges & Hidden Secrets Radar
* **Digital Achievements Rack:**
  * Achievements include: **Heritage Buff**, **Street Food Legend**, **Night Owl Navigator**, **Safety Sentinel**, and **Urban Cartographer**.
  * Dynamic XP counter with interactive **Check-in (+50 XP)** button advancing user progression and unlocking badges with toasts.
* **Nearby Hidden Secrets Radar:**
  * Real-time distance indicators: Subterranean Water Pavilion (380m), Midnight Saffron Chai Cauldron (520m), Solar Rooftop Conservatory (740m), Antique Cartography Archive (890m).
  * "Radar Pin" button targets and flies to hidden gems on the map with custom pulsing diamond pins.

### 5. 🎙️ Crowdsourced Citizen Voice & Photo Incident Reporter
* **Simulated Citizen Voice Memo:** Audio waveform recorder simulator with live recording timer and auto-encoded audio attachment.
* **Hazard Photo Attachment:** File picker preview displaying attached photos.
* **Real-time Map Integration:** Submitting an incident automatically pins a custom warning/audio marker onto the Leaflet map and prepends the report to the live Smart City Real-Time Feed.

### 6. ✨ Professional Scroll Animations & Ultra-Modern Polish
* **Scroll Reveals:** Smooth `IntersectionObserver` viewport reveals (`.reveal-on-scroll`, `.revealed`).
* **Visual Polish:** Sleek dark mode glassmorphism, responsive Tailwind CSS grid, neon glow badges, and Google Satellite Hybrid tiles.

---

## 🛠️ Technology Stack

| Component | Technology | Rationale |
|---|---|---|
| **Structure & Logic** | HTML5 Semantic + Vanilla JavaScript (ES6+) | Instant, zero-build-step loading with 100% native compatibility. |
| **Styling & Design** | Tailwind CSS CDN + Custom CSS (`styles.css`) | Glassmorphism, neon accents, pulsating SVG markers, and sleek typography. |
| **Geospatial & Maps** | Leaflet.js v1.9.4 + CartoDB Dark Matter | Lightweight GIS, custom HTML marker pins, polyline animations, zero API key dependencies. |
| **Iconography** | Lucide Icons | Clean, modern vector icons for civic categories. |
| **Local Web Server** | PowerShell HttpListener (`serve.ps1`) | Zero external dependencies (no Node.js/Python required). |

---

## 📂 File Architecture

```
PromptWars/
├── index.html            # Main single-page web application
├── styles.css            # Custom animations, glassmorphism, map pulse rings
├── serve.ps1             # Lightweight PowerShell HTTP server on port 8080
├── README.md             # Project documentation & pitch guide
├── assets/
│   └── images/
│       ├── hero.jpg      # Cyberpunk night skyline backdrop
│       ├── food.jpg      # Sizzling night street food market
│       ├── heritage.jpg  # Royal fortress heritage landmark
│       └── transit.jpg   # Smart lit pedestrian walkway
└── js/
    ├── data.js           # POIs, coordinates, route paths, sectors & live feed data
    └── app.js            # Leaflet map logic, routing, comparison & feed engine
```
