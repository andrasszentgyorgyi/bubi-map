# 🚲 MOL Bubi Live Map

**Live Demo:** [MOL Bubi Live Map](bubi-map.vercel.app)

---

## 🚧 Note on Live Data (Bubi 2.0 Rollout)
The Budapest MOL Bubi bike-sharing system is currently undergoing a complete hardware and system generation upgrade. During this transition period, the official BKK OpenData API is returning an empty dataset. 

To ensure the application's UI, dynamic rendering, and logic remain fully testable, I implemented an edge-case fallback mechanism. If the API returns `0` stations, the app automatically intercepts the response and injects synthetic mock data (using real Budapest coordinates). This guarantees the map, dynamic markers, and popups remain demonstrable during the city-wide outage.

---

A real-time, interactive web map that visualizes the live availability of Budapest’s public bike-sharing network (MOL Bubi). Built with a focus on clean architecture, secure API handling, and a polished user experience.

## 🛠️ Tech Stack
* **Frontend:** JavaScript (ES6+), HTML5, CSS3
* **Mapping Engine:** Leaflet.js, CartoDB Basemaps
* **Backend / API Proxy:** Node.js (Vercel Serverless Functions)
* **Data Source:** BKK OpenData API (FUTÁR/OTP)

## ✨ Features
* **Dynamic Data Visualization:** Bike station markers dynamically change color (Green, Orange, Red) based on the real-time availability of bicycles.
* **Custom Dark Mode:** A DOM-manipulated dark mode toggle that seamlessly swaps the Leaflet basemap layers and applies CSS inversion to UI elements without reloading the page.
* **Secure API Architecture:** Implements a Vercel Serverless Function to act as a proxy backend, ensuring the private BKK API key is never exposed to the client-side browser.
* **User-Centric UX:** Features custom-styled map popups, inline SVG icons, and camera bounding boxes (`maxBounds`) to keep the viewport locked to the Budapest service area.

---