/**
 * UrbanWay — Application Controller & Worldwide GIS Engine
 */

// Global State
let map;
let baseTileLayers = {};
let currentBaseLayer = "satellite";
let layers = {
  food: null,
  heritage: null,
  hazard: null,
  safeCorridors: null,
  navigation: null,
  heatmap: null,
  globalPins: null
};
let allMarkers = {};
let feedData = [...INITIAL_SMART_FEED];
let activeFilter = "all";
let currentRouteIndex = 0;
let isDropPinMode = false;
let activeCityData = (typeof GLOBAL_CITIES_PRESETS !== "undefined") ? GLOBAL_CITIES_PRESETS[0] : null;

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  initLayers();
  renderPoiList();
  initNavigation();
  initComparison();
  renderSmartFeed();
  setupEventHandlers();

  // UrbanWay CitySense Feature Suites & Global Engine
  initThemeSwitcher();
  initMapHudControls();
  initCommandPalette();
  initScrollAnimations();
  initEmergencySos();
  initZoneCompareModal();
  initItineraryBuilder();
  initGamification();
  initGlobalExplorer();

  lucide.createIcons();
});

/* -------------------------------------------------------------
 * 1. MAP INITIALIZATION & TILE ENGINE (GOOGLE MAPS CONNECTED WORLDWIDE)
 * ------------------------------------------------------------- */
function initMap() {
  // Center world view — Free unconstrained global navigation
  map = L.map("map", {
    center: [28.6220, 77.2180],
    zoom: 14,
    minZoom: 2,
    maxZoom: 21,
    worldCopyJump: true,
    zoomControl: true,
    attributionControl: true
  });

  // 1. Google Maps Satellite Hybrid (Satellite Imagery + Street Names & Road Lines)
  baseTileLayers.satellite = L.tileLayer("https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
    subdomains: ["0", "1", "2", "3"],
    maxZoom: 21,
    attribution: '&copy; <a href="https://maps.google.com" target="_blank" rel="noopener">Google Maps</a> Imagery &copy; 2026 Maxar, Airbus'
  });

  // 2. Google Maps Standard Roadmap (Streets, Traffic & Transit)
  baseTileLayers.roadmap = L.tileLayer("https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
    subdomains: ["0", "1", "2", "3"],
    maxZoom: 21,
    attribution: '&copy; <a href="https://maps.google.com" target="_blank" rel="noopener">Google Maps</a>'
  });

  // 3. CartoDB Dark Matter (Cyberpunk night vector cartography)
  baseTileLayers.dark = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd",
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  });

  // Enable Google Satellite by default per user request
  baseTileLayers.satellite.addTo(map);
  currentBaseLayer = "satellite";

  // Initialize Layer Groups
  layers.food = L.layerGroup().addTo(map);
  layers.heritage = L.layerGroup().addTo(map);
  layers.hazard = L.layerGroup().addTo(map);
  layers.safeCorridors = L.layerGroup().addTo(map);
  layers.navigation = L.layerGroup().addTo(map);
  layers.heatmap = L.layerGroup().addTo(map);
  layers.globalPins = L.layerGroup().addTo(map);

  // Click on map to drop pin and analyze anywhere on Earth
  map.on("click", (e) => {
    if (isDropPinMode) {
      handleGlobalMapClick(e);
    }
  });
}

function setBaseMap(layerKey) {
  if (!baseTileLayers[layerKey] || currentBaseLayer === layerKey) return;

  map.removeLayer(baseTileLayers[currentBaseLayer]);
  baseTileLayers[layerKey].addTo(map);
  currentBaseLayer = layerKey;

  // Re-order feature layers to remain on top of tile imagery
  if (layers.heatmap) layers.heatmap.bringToFront();
  if (layers.safeCorridors) layers.safeCorridors.bringToFront();
  if (layers.hazard) layers.hazard.bringToFront();
  if (layers.food) layers.food.bringToFront();
  if (layers.heritage) layers.heritage.bringToFront();
  if (layers.navigation) layers.navigation.bringToFront();
  if (layers.globalPins) layers.globalPins.bringToFront();

  // Update UI Button Styles
  const btnSat = document.getElementById("btnMapSatellite");
  const btnRoad = document.getElementById("btnMapRoadmap");
  const btnDark = document.getElementById("btnMapDark");
  const labelBadge = document.getElementById("activeMapStyleLabel");

  [btnSat, btnRoad, btnDark].forEach(btn => {
    if (btn) {
      btn.classList.remove("bg-gradient-to-r", "from-amber-500", "to-orange-500", "text-white", "font-semibold", "shadow-xs");
      btn.classList.add("text-slate-600", "font-medium");
    }
  });

  if (layerKey === "satellite") {
    if (btnSat) {
      btnSat.classList.add("bg-gradient-to-r", "from-amber-500", "to-orange-500", "text-white", "font-semibold", "shadow-xs");
      btnSat.classList.remove("text-slate-600", "font-medium");
    }
    if (labelBadge) labelBadge.textContent = "Google Satellite (Hybrid)";
    showToast("Satellite View enabled: Google Maps satellite imagery active.", "info");
  } else if (layerKey === "roadmap") {
    if (btnRoad) {
      btnRoad.classList.add("bg-gradient-to-r", "from-amber-500", "to-orange-500", "text-white", "font-semibold", "shadow-xs");
      btnRoad.classList.remove("text-slate-600", "font-medium");
    }
    if (labelBadge) labelBadge.textContent = "Google Maps (Roads)";
    showToast("Switched to Google Maps Standard Road View.", "info");
  } else if (layerKey === "dark") {
    if (btnDark) {
      btnDark.classList.add("bg-gradient-to-r", "from-amber-500", "to-orange-500", "text-white", "font-semibold", "shadow-xs");
      btnDark.classList.remove("text-slate-600", "font-medium");
    }
    if (labelBadge) labelBadge.textContent = "Dark Vector Map";
    showToast("Switched to Dark Matrix cartography.", "info");
  }
}

/* -------------------------------------------------------------
 * 2. CUSTOM MAP MARKERS & LAYERS
 * ------------------------------------------------------------- */
function createCustomMarker(item) {
  let iconHtml = "";

  if (item.category === "food") {
    iconHtml = `
      <div class="marker-pin-wrapper" title="${item.name}">
        <div class="marker-badge bg-amber-500 shadow-amber-500/50">
          🍜
        </div>
      </div>
    `;
  } else if (item.category === "heritage") {
    iconHtml = `
      <div class="marker-pin-wrapper" title="${item.name}">
        <div class="marker-badge bg-gradient-to-tr from-amber-500 to-orange-500 shadow-orange-500/50">
          🏛️
        </div>
      </div>
    `;
  } else if (item.category === "hazard") {
    iconHtml = `
      <div class="marker-pin-wrapper" title="${item.name}">
        <div class="hazard-pulse-ring"></div>
        <div class="marker-badge bg-rose-600 shadow-rose-600/60 border-rose-300">
          ⚠️
        </div>
      </div>
    `;
  }

  return L.divIcon({
    className: "custom-div-icon",
    html: iconHtml,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20]
  });
}

function initLayers() {
  // Clear existing
  layers.food.clearLayers();
  layers.heritage.clearLayers();
  layers.hazard.clearLayers();
  layers.safeCorridors.clearLayers();

  // Populate POIs
  POI_DATA.forEach((item) => {
    const marker = L.marker([item.lat, item.lng], {
      icon: createCustomMarker(item)
    });

    // Custom Popup Content
    const popupHtml = generatePopupHtml(item);
    marker.bindPopup(popupHtml, { maxWidth: 300 });

    // Click handler to also update sidebar inspection drawer
    marker.on("click", () => {
      displayPoiDetails(item);
    });

    allMarkers[item.id] = marker;

    if (item.category === "food") {
      layers.food.addLayer(marker);
    } else if (item.category === "heritage") {
      layers.heritage.addLayer(marker);
    } else if (item.category === "hazard") {
      layers.hazard.addLayer(marker);

      // Add hazard warning radius circle
      const hazardCircle = L.circle([item.lat, item.lng], {
        color: "#f43f5e",
        fillColor: "#f43f5e",
        fillOpacity: 0.18,
        weight: 1.5,
        dashArray: "4, 6",
        radius: 220
      });
      layers.hazard.addLayer(hazardCircle);
    }
  });

  // Render Safe Corridors
  SAFE_CORRIDORS.forEach((corridor) => {
    const polyline = L.polyline(corridor.coordinates, {
      color: "#10b981",
      weight: 6,
      opacity: 0.85,
      lineCap: "round",
      lineJoin: "round"
    });

    polyline.bindPopup(`
      <div class="p-3 text-xs space-y-1">
        <div class="font-bold text-emerald-400 flex items-center gap-1.5">
          <span>🛡️ ${corridor.name}</span>
        </div>
        <p class="text-slate-300">Monitored greenway with continuous LED smart lighting and emergency SOS posts.</p>
      </div>
    `);

    layers.safeCorridors.addLayer(polyline);

    // Glowing buffer line
    const bufferLine = L.polyline(corridor.coordinates, {
      color: "#34d399",
      weight: 12,
      opacity: 0.25
    });
    layers.safeCorridors.addLayer(bufferLine);
  });

  // Default initial selection in inspector
  displayPoiDetails(POI_DATA[0]);
}

function generatePopupHtml(item) {
  if (item.category === "hazard") {
    return `
      <div class="p-3 text-xs space-y-2 bg-white text-slate-800 rounded-2xl">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold uppercase text-[10px]">Hazard Zone</span>
          <span class="text-rose-600 font-bold">Severity: ${item.riskSeverity}/100</span>
        </div>
        <h4 class="font-bold text-slate-900 text-sm leading-tight">${item.name}</h4>
        <p class="text-slate-600 text-[11px]">${item.cautionTip}</p>
        <div class="text-[10px] text-slate-500 flex items-center gap-1">
          <span>🕒 Last verified: ${item.lastReported}</span>
        </div>
        <button onclick="focusOnPoi('${item.id}')" class="w-full mt-1 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-orange-700 text-[11px] font-semibold border border-slate-200 transition-colors">
          Inspect Hazard Details
        </button>
        <a href="https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}" target="_blank" rel="noopener noreferrer" class="w-full py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-semibold border border-rose-200 flex items-center justify-center gap-1 transition-colors">
          <span>↗ Open in Google Maps</span>
        </a>
      </div>
    `;
  }

  const categoryBadge = item.category === "food" 
    ? "bg-amber-50 text-amber-800 border-amber-200" 
    : "bg-orange-50 text-orange-800 border-orange-200";

  return `
    <div class="p-3 text-xs space-y-2 bg-white text-slate-800 rounded-2xl">
      <div class="flex items-center justify-between">
        <span class="px-2.5 py-0.5 rounded-full ${categoryBadge} border font-semibold text-[10px]">
          ${item.categoryLabel}
        </span>
        <span class="text-amber-600 font-bold">★ ${item.rating}</span>
      </div>
      <h4 class="font-bold text-slate-900 text-sm leading-tight">${item.name}</h4>
      <div class="flex items-center gap-2 text-[11px] text-slate-500">
        <span>${item.priceLabel}</span>
        <span>•</span>
        <span class="text-emerald-700 font-semibold">🛡️ Safety: ${item.safetyScore}%</span>
      </div>
      <button onclick="focusOnPoi('${item.id}')" class="w-full mt-1 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white text-[11px] font-bold shadow-xs hover:scale-105 transition-all">
        Inspect Full Details
      </button>
      <a href="https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}" target="_blank" rel="noopener noreferrer" class="w-full py-1.5 rounded-full bg-white hover:bg-orange-50 text-orange-700 text-[10px] font-semibold border border-orange-200 flex items-center justify-center gap-1 transition-colors">
        <span>↗ View on Google Maps</span>
      </a>
    </div>
  `;
}

/* -------------------------------------------------------------
 * 3. POI LIST & DETAIL INSPECTOR
 * ------------------------------------------------------------- */
function renderPoiList(searchFilter = "") {
  const container = document.getElementById("poiListContainer");
  const countLabel = document.getElementById("poiCountLabel");
  if (!container) return;

  container.classList.remove("tab-pane-transition");
  void container.offsetWidth;
  container.classList.add("tab-pane-transition");

  const filtered = POI_DATA.filter(item => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.categoryLabel.toLowerCase().includes(q) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    );
  });

  countLabel.textContent = `${filtered.length} locations`;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="p-4 text-center text-slate-500 text-xs">No matching locations found</div>`;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isHazard = item.category === "hazard";
    const badgeStyle = isHazard 
      ? "bg-rose-50 text-rose-600 border-rose-200" 
      : item.category === "food" 
      ? "bg-amber-50 text-amber-700 border-amber-200" 
      : "bg-orange-50 text-orange-700 border-orange-200";
    const icon = isHazard ? "alert-triangle" : item.category === "food" ? "utensils" : "landmark";

    return `
      <div onclick="focusOnPoi('${item.id}')" class="p-3 rounded-2xl bg-white hover:bg-orange-50/40 border border-slate-200/80 hover:border-orange-300 cursor-pointer transition-all flex items-start gap-2.5 group interactive-card shadow-xs ${isHazard ? 'hazard-zone-glow' : ''}">
        <div class="w-8 h-8 rounded-xl ${badgeStyle} flex items-center justify-center shrink-0 border group-hover:scale-105 transition-transform">
          <i data-lucide="${icon}" class="w-4 h-4"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-1">
            <h5 class="text-xs font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors">${item.name}</h5>
            ${isHazard 
              ? `<span class="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-full shrink-0">Hazard</span>`
              : `<span class="text-[10px] text-amber-600 font-bold shrink-0">★ ${item.rating}</span>`}
          </div>
          <p class="text-[11px] text-slate-500 truncate mt-0.5">${item.address}</p>
          <div class="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
            <span class="${isHazard ? 'text-rose-600' : 'text-emerald-700'} font-semibold">Safety: ${item.safetyScore}%</span>
            <span>•</span>
            <span class="truncate">${item.tags ? item.tags[0] : 'Reported Hazard'}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");

  lucide.createIcons();
}

function displayPoiDetails(item) {
  const inspector = document.getElementById("poiInspector");
  if (!inspector) return;

  const isHazard = item.category === "hazard";

  if (isHazard) {
    inspector.innerHTML = `
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-rose-100 pb-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
            <i data-lucide="alert-octagon" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">Active Hazard Zone</span>
              <span class="text-xs text-rose-600 font-bold">Risk Level: ${item.riskLevel} (${item.riskSeverity}/100)</span>
            </div>
            <h4 class="text-lg font-display font-bold text-slate-900 mt-0.5">${item.name}</h4>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <a href="https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 rounded-full bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors" title="Open hazard location in Google Maps">
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i> Google Maps
          </a>
          <button onclick="zoomToCoords(${item.lat}, ${item.lng})" class="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors">
            <i data-lucide="crosshair" class="w-3.5 h-3.5"></i> Pin on Map
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs">
        <div class="md:col-span-2 space-y-2">
          <p class="text-rose-800 font-semibold">⚠️ Caution Advice: <span class="text-slate-600 font-normal">${item.cautionTip}</span></p>
          <div class="text-slate-500">
            <span class="font-semibold text-slate-700">Active Incident Tags:</span>
            <div class="flex flex-wrap gap-1.5 mt-1">
              ${item.reportedIssues.map(issue => `
                <span class="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-medium">${issue}</span>
              `).join("")}
            </div>
          </div>
          <div class="text-[11px] text-slate-500 pt-1">
            Verified: <strong class="text-slate-700">${item.lastReported}</strong> | Address: <span class="text-slate-600">${item.address}</span>
          </div>
        </div>

        <div class="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2">
          <div class="text-[11px] text-slate-500 font-medium">Locality Safety Assessment</div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-600">Safety Index</span>
            <span class="font-bold text-rose-600">${item.safetyScore}%</span>
          </div>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="bg-rose-500 h-full rounded-full" style="width: ${item.safetyScore}%"></div>
          </div>
          <div class="flex items-center justify-between text-xs pt-1">
            <span class="text-slate-600">Cleanliness Score</span>
            <span class="font-bold text-amber-600">${item.cleanlinessScore}%</span>
          </div>
          <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="bg-amber-500 h-full rounded-full" style="width: ${item.cleanlinessScore}%"></div>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  // Regular POI (Food / Heritage)
  inspector.innerHTML = `
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-orange-100 pb-3">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-orange-200 shadow-xs">
          <img src="${item.image || 'assets/images/hero.jpg'}" alt="${item.name}" class="w-full h-full object-cover">
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
              ${item.categoryLabel}
            </span>
            <span class="text-xs text-amber-600 font-bold">★ ${item.rating} (${item.reviewsCount} reviews)</span>
          </div>
          <h4 class="text-lg font-display font-bold text-slate-900 mt-0.5">${item.name}</h4>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <a href="https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 rounded-full bg-white hover:bg-orange-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors" title="Open location in Google Maps">
          <i data-lucide="external-link" class="w-3.5 h-3.5 text-orange-500"></i> Google Maps
        </a>
        <button onclick="triggerNavigateToPoi('${item.id}')" class="px-4 py-1.5 rounded-full btn-warm-pill text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all hover:scale-105">
          <i data-lucide="navigation" class="w-3.5 h-3.5"></i> SafePath Here
        </button>
        <button onclick="zoomToCoords(${item.lat}, ${item.lng})" class="px-3 py-1.5 rounded-full bg-white hover:bg-orange-50 text-orange-700 border border-orange-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors">
          <i data-lucide="crosshair" class="w-3.5 h-3.5"></i> Pin
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs">
      <div class="md:col-span-2 space-y-2">
        <p class="text-slate-600 leading-relaxed">${item.description}</p>
        <div class="flex flex-wrap items-center gap-3 text-slate-500 text-[11px] pt-1">
          <span>🕒 <strong class="text-slate-800">${item.timings}</strong></span>
          <span>•</span>
          <span>💵 <strong class="text-slate-800">${item.priceLabel}</strong></span>
          <span>•</span>
          <span>📍 <span class="text-slate-600">${item.address}</span></span>
        </div>
        <div class="flex flex-wrap gap-1.5 pt-1">
          ${item.tags ? item.tags.map(t => `<span class="px-2.5 py-0.5 rounded-full bg-orange-50/70 text-orange-800 text-[10px] border border-orange-200 font-medium">${t}</span>`).join("") : ""}
        </div>
      </div>

      <div class="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2">
        <div class="text-[11px] text-slate-500 font-medium">Neighborhood Vitality</div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-600">Safety Index</span>
          <span class="font-bold text-emerald-700">${item.safetyScore}% (High)</span>
        </div>
        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div class="bg-emerald-500 h-full rounded-full" style="width: ${item.safetyScore}%"></div>
        </div>
        <div class="flex items-center justify-between text-xs pt-1">
          <span class="text-slate-600">Cleanliness Score</span>
          <span class="font-bold text-orange-600">${item.cleanlinessScore}%</span>
        </div>
        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div class="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full" style="width: ${item.cleanlinessScore}%"></div>
        </div>
        <div class="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
          <span>Pedestrian Footfall:</span>
          <strong class="text-slate-800">${item.crowdDensity || 'Moderate'}</strong>
        </div>
      </div>
    </div>
  `;

  lucide.createIcons();
}

function focusOnPoi(id) {
  const item = POI_DATA.find(p => p.id === id);
  if (!item) return;

  displayPoiDetails(item);

  if (map) {
    map.flyTo([item.lat, item.lng], 15.5, {
      duration: 1.2
    });

    const marker = allMarkers[id];
    if (marker) {
      setTimeout(() => marker.openPopup(), 1250);
    }
  }

  // Smooth scroll up to map if user is further down
  const mapElem = document.getElementById("mapSection");
  if (mapElem) {
    const rect = mapElem.getBoundingClientRect();
    if (rect.top < -100 || rect.bottom < 100) {
      mapElem.scrollIntoView({ behavior: "smooth" });
    }
  }
}

function zoomToCoords(lat, lng) {
  if (map) {
    map.flyTo([lat, lng], 16, { duration: 1.0 });
  }
}

function triggerNavigateToPoi(id) {
  const navSection = document.getElementById("navigationSection");
  if (navSection) {
    navSection.scrollIntoView({ behavior: "smooth" });
  }
  drawSaferRoute();
  showToast("SafePath Route Loaded: Navigating to destination via illuminated corridors.", "success");
}

/* -------------------------------------------------------------
 * 4. SAFER ROUTE & NAVIGATION ENGINE
 * ------------------------------------------------------------- */
function initNavigation() {
  const select = document.getElementById("routeSelect");
  if (!select) return;

  select.innerHTML = NAVIGATION_ROUTES.options.map((opt, idx) => `
    <option value="${idx}">${opt.name}</option>
  `).join("");

  select.addEventListener("change", (e) => {
    currentRouteIndex = parseInt(e.target.value, 10);
    updateRouteCards();
    drawSaferRoute();
  });

  updateRouteCards();
  // Draw safer route by default
  setTimeout(() => drawSaferRoute(), 600);
}

function updateRouteCards() {
  const activePair = NAVIGATION_ROUTES.options[currentRouteIndex];
  if (!activePair) return;

  // Fastest Card
  document.getElementById("fastestScore").textContent = `${activePair.fastest.safetyScore}/100`;
  document.getElementById("fastestDistance").textContent = activePair.fastest.distanceKm;
  document.getElementById("fastestTime").textContent = activePair.fastest.walkTimeMin;
  document.getElementById("fastestLighting").textContent = activePair.fastest.lightingScore;
  document.getElementById("fastestCctv").textContent = activePair.fastest.cctvCoverage;
  document.getElementById("fastestCrowd").textContent = activePair.fastest.crowdFactor;

  const fastestWarnings = document.getElementById("fastestWarningsList");
  fastestWarnings.innerHTML = activePair.fastest.warnings.map(w => `<li>${w}</li>`).join("");

  // Safer Card
  document.getElementById("saferScore").textContent = `${activePair.safer.safetyScore}/100`;
  document.getElementById("saferDistance").textContent = activePair.safer.distanceKm;
  document.getElementById("saferTime").textContent = activePair.safer.walkTimeMin;
  document.getElementById("saferLighting").textContent = activePair.safer.lightingScore;
  document.getElementById("saferCctv").textContent = activePair.safer.cctvCoverage;
  document.getElementById("saferCrowd").textContent = activePair.safer.crowdFactor;

  const saferPerks = document.getElementById("saferPerksList");
  saferPerks.innerHTML = activePair.safer.perks.map(p => `<li>${p}</li>`).join("");

  // Update Google Maps external directions launcher
  const gmapsBtn = document.getElementById("openGoogleMapsRouteBtn");
  if (gmapsBtn) {
    gmapsBtn.href = `https://www.google.com/maps/dir/?api=1&origin=${activePair.origin.coords[0]},${activePair.origin.coords[1]}&destination=${activePair.destination.coords[0]},${activePair.destination.coords[1]}&travelmode=walking`;
  }

  // Step-by-step guidance
  renderStepGuidance(activePair);
}

function renderStepGuidance(routePair) {
  const container = document.getElementById("routeStepGuidance");
  if (!container) return;

  const steps = [
    {
      step: 1,
      title: `Depart from ${routePair.origin.name}`,
      desc: "Exit through Main North Concourse towards Smart Boulevard.",
      status: "Safe - 100% LED Illuminated",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      step: 2,
      title: "Follow Smart Transit Greenway",
      desc: "Pass active Police Assistance Kiosk #2 and emergency call pillar.",
      status: "Verified CCTV Patrol",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      step: 3,
      title: "Cross via Illuminated Pedestrian Bridge",
      desc: "Bypass ground level unlit freight intersection.",
      status: "Elevated Safe Corridor",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-200"
    },
    {
      step: 4,
      title: `Arrive at ${routePair.destination.name}`,
      desc: "Enter via illuminated main gateway. High crowd vibrancy.",
      status: "Destination Reached",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200"
    }
  ];

  container.innerHTML = steps.map(s => `
    <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 shadow-xs">
      <div class="flex items-center justify-between">
        <span class="font-bold text-slate-900">Step ${s.step}</span>
        <span class="text-[10px] px-1.5 py-0.5 rounded border font-semibold ${s.badgeClass}">${s.status}</span>
      </div>
      <div class="font-semibold text-slate-800 text-xs">${s.title}</div>
      <p class="text-[11px] text-slate-500">${s.desc}</p>
    </div>
  `).join("");
}

function drawFastestRoute() {
  const activePair = NAVIGATION_ROUTES.options[currentRouteIndex];
  if (!activePair || !layers.navigation) return;

  layers.navigation.clearLayers();

  // Create route line with danger animation class
  const polyline = L.polyline(activePair.fastest.pathCoordinates, {
    color: "#f43f5e",
    weight: 5,
    opacity: 0.9,
    className: "route-fastest"
  }).addTo(layers.navigation);

  // Origin Marker
  L.marker(activePair.fastest.pathCoordinates[0], {
    icon: L.divIcon({
      className: "custom-pin",
      html: `<div class="w-6 h-6 rounded-full bg-slate-200 border-2 border-slate-900 flex items-center justify-center text-xs font-bold shadow text-slate-900">A</div>`,
      iconSize: [24, 24]
    })
  }).addTo(layers.navigation).bindPopup(`<b>Origin:</b> ${activePair.origin.name}`);

  // Destination Marker
  const lastIndex = activePair.fastest.pathCoordinates.length - 1;
  L.marker(activePair.fastest.pathCoordinates[lastIndex], {
    icon: L.divIcon({
      className: "custom-pin",
      html: `<div class="w-6 h-6 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-xs font-bold shadow text-white">B</div>`,
      iconSize: [24, 24]
    })
  }).addTo(layers.navigation).bindPopup(`<b>Destination:</b> ${activePair.destination.name}`);

  // Add Hazard Warning Waypoint
  const hazardCoord = activePair.fastest.pathCoordinates[2];
  L.marker(hazardCoord, {
    icon: L.divIcon({
      className: "hazard-checkpoint",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="hazard-pulse-ring"></div>
          <div class="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold border border-white shadow">⚠️</div>
        </div>
      `,
      iconSize: [28, 28]
    })
  }).addTo(layers.navigation).bindPopup(`
    <div class="p-2 text-xs text-rose-300 font-semibold">
      ⚠️ CAUTION: Unlit dark corridor along fastest route!
    </div>
  `);

  map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

  // Update card styling
  document.getElementById("fastestRouteCard").classList.add("neon-glow-rose");
  document.getElementById("saferRouteCard").classList.remove("neon-glow-emerald");

  showToast("Fastest Route Plotted (Warning: Passes through low-lighting hazard).", "warning");
}

function drawSaferRoute() {
  const activePair = NAVIGATION_ROUTES.options[currentRouteIndex];
  if (!activePair || !layers.navigation) return;

  layers.navigation.clearLayers();

  // Glow line underneath
  L.polyline(activePair.safer.pathCoordinates, {
    color: "#34d399",
    weight: 12,
    opacity: 0.35,
    lineCap: "round"
  }).addTo(layers.navigation);

  // Main Emerald Safe Route
  const polyline = L.polyline(activePair.safer.pathCoordinates, {
    color: "#10b981",
    weight: 6,
    opacity: 0.95,
    lineCap: "round",
    lineJoin: "round"
  }).addTo(layers.navigation);

  // Origin Marker
  L.marker(activePair.safer.pathCoordinates[0], {
    icon: L.divIcon({
      className: "custom-pin",
      html: `<div class="w-6 h-6 rounded-full bg-slate-200 border-2 border-slate-900 flex items-center justify-center text-xs font-bold shadow text-slate-900">A</div>`,
      iconSize: [24, 24]
    })
  }).addTo(layers.navigation).bindPopup(`<b>Origin:</b> ${activePair.origin.name}`);

  // Destination Marker
  const lastIndex = activePair.safer.pathCoordinates.length - 1;
  L.marker(activePair.safer.pathCoordinates[lastIndex], {
    icon: L.divIcon({
      className: "custom-pin",
      html: `<div class="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-xs font-bold shadow text-white">B</div>`,
      iconSize: [24, 24]
    })
  }).addTo(layers.navigation).bindPopup(`<b>Destination:</b> ${activePair.destination.name}`);

  // Police Booth Waypoint on Safe Route
  const safeMidCoord = activePair.safer.pathCoordinates[1];
  L.marker(safeMidCoord, {
    icon: L.divIcon({
      className: "safe-checkpoint",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="safe-pulse-ring"></div>
          <div class="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold border border-white shadow">🛡️</div>
        </div>
      `,
      iconSize: [28, 28]
    })
  }).addTo(layers.navigation).bindPopup(`
    <div class="p-2 text-xs text-emerald-300 font-semibold">
      🛡️ Police Assistance Kiosk & Solar LED Corridor
    </div>
  `);

  map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

  // Update card styling
  document.getElementById("saferRouteCard").classList.add("neon-glow-emerald");
  document.getElementById("fastestRouteCard").classList.remove("neon-glow-rose");

  showToast("SafePath Verified Route Plotted (100% smart illuminated pathway).", "success");
}

/* -------------------------------------------------------------
 * 5. BEST VS WORST PLACES COMPARISON MATRIX
 * ------------------------------------------------------------- */
function initComparison() {
  const selectA = document.getElementById("compareSectorA");
  const selectB = document.getElementById("compareSectorB");
  if (!selectA || !selectB) return;

  const optionsHtml = NEIGHBORHOOD_DATA.map((item, idx) => `
    <option value="${item.id}">${item.name}</option>
  `).join("");

  selectA.innerHTML = optionsHtml;
  selectB.innerHTML = optionsHtml;

  // Default to Best vs Worst
  selectA.value = "tech-cyber-hub";
  selectB.value = "old-canal-industrial";

  selectA.addEventListener("change", () => renderComparisonCards());
  selectB.addEventListener("change", () => renderComparisonCards());

  renderComparisonCards();
  renderComparisonTable();
}

function renderComparisonCards() {
  const idA = document.getElementById("compareSectorA").value;
  const idB = document.getElementById("compareSectorB").value;

  const itemA = NEIGHBORHOOD_DATA.find(x => x.id === idA) || NEIGHBORHOOD_DATA[0];
  const itemB = NEIGHBORHOOD_DATA.find(x => x.id === idB) || NEIGHBORHOOD_DATA[3];

  renderSectorCard("cardSectorA", itemA, itemA.safetyScore >= itemB.safetyScore);
  renderSectorCard("cardSectorB", itemB, itemB.safetyScore >= itemA.safetyScore);

  lucide.createIcons();
}

function renderSectorCard(elementId, item, isSafetyWinner) {
  const container = document.getElementById(elementId);
  if (!container) return;

  const isBest = item.isBest;
  const badgeClass = isBest 
    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
    : "bg-rose-50 text-rose-700 border-rose-200";

  container.innerHTML = `
    <div class="flex items-start justify-between">
      <div>
        <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeClass}">
          ${item.badge}
        </span>
        <h3 class="text-xl font-bold text-slate-900 mt-1.5">${item.name}</h3>
      </div>
      <div class="text-right">
        <span class="text-sm font-extrabold ${item.safetyScore >= 75 ? 'text-emerald-600' : 'text-rose-600'}">
          Safety ${item.safetyScore}/100
        </span>
        <div class="text-[11px] text-amber-500 font-bold">★ ${item.rating} / 5.0</div>
      </div>
    </div>

    <!-- Metric Progress Bars -->
    <div class="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/90 text-xs">
      
      <!-- Safety -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <span class="text-slate-600 font-medium">🛡️ Safety & Security</span>
          <span class="font-bold ${item.safetyScore >= 75 ? 'text-emerald-700' : 'text-rose-700'}">${item.safetyScore}%</span>
        </div>
        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div class="${item.safetyScore >= 75 ? 'bg-emerald-500' : 'bg-rose-500'} h-full rounded-full transition-all duration-500" style="width: ${item.safetyScore}%"></div>
        </div>
      </div>

      <!-- Cleanliness -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <span class="text-slate-600 font-medium">🧹 Cleanliness & Sanitation</span>
          <span class="font-bold ${item.cleanlinessScore >= 70 ? 'text-amber-600' : 'text-orange-600'}">${item.cleanlinessScore}%</span>
        </div>
        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div class="${item.cleanlinessScore >= 70 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-orange-500'} h-full rounded-full transition-all duration-500" style="width: ${item.cleanlinessScore}%"></div>
        </div>
      </div>

      <!-- Affordability -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <span class="text-slate-600 font-medium">💰 Affordability Index</span>
          <span class="font-bold text-slate-800">${item.affordabilityLabel} (${item.affordabilityScore}%)</span>
        </div>
        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div class="bg-amber-500 h-full rounded-full transition-all duration-500" style="width: ${item.affordabilityScore}%"></div>
        </div>
      </div>

      <!-- Walkability -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <span class="text-slate-600 font-medium">🚶 Walkability & Sidewalks</span>
          <span class="font-bold ${item.walkabilityScore >= 70 ? 'text-teal-600' : 'text-rose-600'}">${item.walkabilityScore}%</span>
        </div>
        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div class="${item.walkabilityScore >= 70 ? 'bg-teal-500' : 'bg-rose-500'} h-full rounded-full transition-all duration-500" style="width: ${item.walkabilityScore}%"></div>
        </div>
      </div>

    </div>

    <!-- Pros & Cons list -->
    <div class="space-y-2 text-xs">
      <div class="text-emerald-700 font-bold flex items-center gap-1.5">
        <i data-lucide="thumbs-up" class="w-3.5 h-3.5"></i> Key Advantages:
      </div>
      <ul class="text-slate-600 space-y-1 pl-5 list-disc text-[11px]">
        ${item.pros.map(p => `<li>${p}</li>`).join("")}
      </ul>

      <div class="text-rose-700 font-bold flex items-center gap-1.5 pt-1">
        <i data-lucide="thumbs-down" class="w-3.5 h-3.5"></i> Drawbacks / Cautions:
      </div>
      <ul class="text-slate-600 space-y-1 pl-5 list-disc text-[11px]">
        ${item.cons.map(c => `<li>${c}</li>`).join("")}
      </ul>
    </div>

    <!-- Final Verdict Box -->
    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
      <span class="font-bold text-slate-800">Exploration Verdict:</span>
      <p class="text-slate-600 mt-0.5 text-[11px] leading-relaxed">${item.verdict}</p>
    </div>
  `;
}

function renderComparisonTable() {
  const tbody = document.getElementById("comparisonTableBody");
  if (!tbody) return;

  tbody.innerHTML = NEIGHBORHOOD_DATA.map(item => {
    const isSafe = item.safetyScore >= 75;
    const safetyBadge = isSafe 
      ? `<span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs">${item.safetyScore}/100</span>`
      : `<span class="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs">${item.safetyScore}/100</span>`;

    const aqiColor = item.airQualityIndex <= 60 ? "text-emerald-600" : item.airQualityIndex <= 100 ? "text-amber-600" : "text-rose-600";

    return `
      <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
        <td class="py-3.5 px-4 font-semibold text-slate-900">
          ${item.name}
        </td>
        <td class="py-3.5 px-3">
          <span class="text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${item.isBest ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}">
            ${item.isBest ? 'Recommended' : 'Caution'}
          </span>
        </td>
        <td class="py-3.5 px-3">${safetyBadge}</td>
        <td class="py-3.5 px-3 font-medium text-slate-700">${item.cleanlinessScore}%</td>
        <td class="py-3.5 px-3 text-slate-600">${item.affordabilityLabel}</td>
        <td class="py-3.5 px-3 font-semibold ${aqiColor}">${item.airQualityIndex} AQI</td>
        <td class="py-3.5 px-3 font-bold text-amber-500">★ ${item.rating}</td>
        <td class="py-3.5 px-4">
          <button onclick="loadIntoCompare('${item.id}')" class="px-3.5 py-1 rounded-full bg-orange-50/70 hover:bg-orange-100 text-orange-600 border border-orange-200/80 shadow-xs text-[11px] font-semibold transition-all hover:scale-105">
            Compare
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function loadIntoCompare(id) {
  const selectB = document.getElementById("compareSectorB");
  if (selectB) {
    selectB.value = id;
    renderComparisonCards();
    document.getElementById("compareSection").scrollIntoView({ behavior: "smooth" });
    showToast(`Loaded ${id} into comparison matrix.`, "info");
  }
}

/* -------------------------------------------------------------
 * 6. SMART CITY FEED & CITIZEN REPORT CENTER
 * ------------------------------------------------------------- */
function renderSmartFeed() {
  const container = document.getElementById("feedListContainer");
  const countDisplay = document.getElementById("feedDisplayCount");
  if (!container) return;

  container.classList.remove("tab-pane-transition");
  void container.offsetWidth;
  container.classList.add("tab-pane-transition");

  const filtered = feedData.filter(item => {
    if (activeFilter === "all") return true;
    return item.type === activeFilter;
  });

  if (countDisplay) {
    countDisplay.textContent = `Showing ${filtered.length} reports`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div class="p-6 text-center text-slate-500 text-xs">No reports found in this category</div>`;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isCitizen = item.type === "citizen";
    const isTraffic = item.type === "traffic";
    const isWeather = item.type === "weather";

    const badgeIcon = isCitizen ? "user-check" : isTraffic ? "car" : "cloud-rain";
    const badgeBg = isCitizen ? "bg-amber-50 text-amber-800 border-amber-200" 
      : isTraffic ? "bg-orange-50 text-orange-800 border-orange-200"
      : "bg-red-50 text-red-800 border-red-200";

    const urgencyBadge = item.urgency === "High"
      ? `<span class="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">🔴 High Alert</span>`
      : item.urgency === "Moderate" || item.urgency === "Medium"
      ? `<span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">🟡 Moderate</span>`
      : `<span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">🟢 Info / Low</span>`;

    return `
      <div class="glass-panel bg-white/85 backdrop-blur-xl p-5 rounded-3xl border border-orange-100/90 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 space-y-3">
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold px-3 py-0.5 rounded-full border ${badgeBg} flex items-center gap-1">
              <i data-lucide="${badgeIcon}" class="w-3 h-3"></i>
              ${item.category}
            </span>
            ${urgencyBadge}
          </div>
          <span class="text-[11px] text-slate-400 font-medium">${item.timestamp}</span>
        </div>

        <div>
          <h4 class="text-sm sm:text-base font-bold text-slate-900">${item.title}</h4>
          <p class="text-xs text-slate-600 mt-1 leading-relaxed">${item.description}</p>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div class="flex items-center gap-2 text-slate-500 text-[11px]">
            <i data-lucide="map-pin" class="w-3 h-3 text-orange-400"></i>
            <span>${item.location}</span>
            <span>•</span>
            <span class="text-slate-400">By ${item.author}</span>
          </div>

          <div class="flex items-center gap-2">
            ${item.coords ? `
              <button onclick="zoomToCoords(${item.coords[0]}, ${item.coords[1]})" class="px-3.5 py-1.5 rounded-full bg-white hover:bg-orange-50 text-orange-600 border border-orange-200 shadow-xs text-[11px] font-semibold flex items-center gap-1 transition-all hover:scale-105">
                <i data-lucide="crosshair" class="w-3 h-3"></i> View on Map
              </button>
            ` : ""}

            <button onclick="upvoteFeedItem('${item.id}')" class="px-3.5 py-1.5 rounded-full ${item.hasVoted ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs' : 'bg-white hover:bg-orange-50 text-slate-700 border border-slate-200 shadow-xs'} text-[11px] font-semibold flex items-center gap-1 transition-all hover:scale-105">
              <i data-lucide="thumbs-up" class="w-3 h-3"></i>
              <span>${item.hasVoted ? 'Verified' : 'Verify'} (${item.votes})</span>
            </button>
          </div>
        </div>

        ${item.hasMedia ? `
          <div class="text-[10px] text-orange-700 bg-orange-50/70 px-3 py-1 rounded-full border border-orange-200 font-medium">
            ${item.mediaNote || '📷 Citizen media attachment attached'}
          </div>
        ` : ""}
      </div>
    `;
  }).join("");

  lucide.createIcons();
}

function upvoteFeedItem(id) {
  const item = feedData.find(f => f.id === id);
  if (!item) return;

  if (item.hasVoted) {
    item.votes -= 1;
    item.hasVoted = false;
    showToast("Vote removed.", "info");
  } else {
    item.votes += 1;
    item.hasVoted = true;
    showToast("Thank you for verifying this citizen report!", "success");
  }

  renderSmartFeed();
}

function handleReportSubmission(data) {
  let mediaNote = "Verified citizen report";
  if (data.hasVoiceMemo && data.hasPhoto) {
    mediaNote = "🎤 Voice memo attached • 📷 Photo verified";
  } else if (data.hasVoiceMemo) {
    mediaNote = "🎤 Citizen voice audio note attached";
  } else if (data.hasPhoto) {
    mediaNote = "📷 Incident photo verified & attached";
  }

  const newReport = {
    id: `feed-${Date.now()}`,
    type: "citizen",
    category: data.category,
    title: `${data.category}: ${data.location}`,
    location: data.location,
    coords: [28.6210 + (Math.random() - 0.5) * 0.02, 77.2100 + (Math.random() - 0.5) * 0.02],
    timestamp: "Just now",
    author: data.author || "Anonymous Citizen",
    urgency: data.urgency,
    description: data.details,
    votes: 1,
    hasVoted: true,
    status: "Broadcasting to community & municipal systems",
    hasMedia: data.hasVoiceMemo || data.hasPhoto || false,
    mediaNote: mediaNote
  };

  feedData.unshift(newReport);
  renderSmartFeed();

  // If safety hazard, traffic or civic issue, pin to live map
  if (data.category === "Safety Hazard" || data.category === "Traffic Gridlock" || data.category === "Civic Improvement" || data.category === "Weather Alert") {
    const isHigh = data.urgency === "High";
    const newHazard = {
      id: `hazard-${Date.now()}`,
      name: `${data.category}: ${data.location}`,
      category: "hazard",
      categoryLabel: "Citizen Hazard Alert",
      lat: newReport.coords[0],
      lng: newReport.coords[1],
      address: data.location,
      riskLevel: data.urgency,
      riskSeverity: isHigh ? 88 : 65,
      safetyScore: isHigh ? 30 : 55,
      cleanlinessScore: 40,
      reportedIssues: [data.details],
      lastReported: "Just now by " + newReport.author,
      cautionTip: data.details + (data.hasVoiceMemo ? " (Includes voice audio memo)" : ""),
      tags: ["Citizen Live Alert", data.category, data.hasVoiceMemo ? "Voice Memo" : "Photo Attached"]
    };

    POI_DATA.push(newHazard);

    // Custom marker icon with warning ping
    const customIcon = L.divIcon({
      className: "citizen-report-pin",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="${isHigh ? 'hazard-pulse-ring' : 'safe-pulse-ring'}" style="width: 38px; height: 38px;"></div>
          <div class="w-8 h-8 rounded-full ${isHigh ? 'bg-rose-600' : 'bg-amber-600'} text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-xl">
            ${data.hasVoiceMemo ? '🎙️' : isHigh ? '⚠️' : '📢'}
          </div>
        </div>
      `,
      iconSize: [32, 32]
    });

    const marker = L.marker([newHazard.lat, newHazard.lng], { icon: customIcon });
    marker.bindPopup(`
      <div class="p-3 text-xs space-y-2 bg-white text-slate-800 rounded-xl">
        <div class="flex items-center justify-between">
          <span class="px-2 py-0.5 rounded-full ${isHigh ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'} font-bold uppercase text-[10px]">
            Citizen Alert
          </span>
          <span class="text-rose-600 font-bold">${data.urgency} Urgency</span>
        </div>
        <h4 class="font-bold text-slate-900 text-sm leading-tight">${newHazard.name}</h4>
        <p class="text-slate-600 text-[11px] leading-relaxed">${data.details}</p>
        <div class="text-[10px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">${mediaNote}</div>
        <div class="text-[10px] text-slate-400">🕒 Reported just now by ${newReport.author}</div>
      </div>
    `);
    marker.on("click", () => displayPoiDetails(newHazard));
    layers.hazard.addLayer(marker);
    allMarkers[newHazard.id] = marker;

    // Fly to new hazard location on map
    if (map) {
      map.flyTo([newHazard.lat, newHazard.lng], 15.5, { duration: 1.2 });
      setTimeout(() => marker.openPopup(), 1300);
    }

    renderPoiList();
  }

  // Update counter badges
  const totalElem = document.getElementById("totalReportsCount");
  if (totalElem) {
    totalElem.textContent = `${342 + feedData.length - 5} Today`;
  }

  showToast("Citizen Report Broadcasted! Added to live feed & pinned to city map.", "success");
}

/* -------------------------------------------------------------
 * 7. TOAST NOTIFICATION SYSTEM
 * ------------------------------------------------------------- */
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  const bg = type === "success" ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
    : type === "warning" ? "bg-amber-950/90 border-amber-500/50 text-amber-200"
    : "bg-slate-900/90 border-slate-700 text-slate-200";

  const icon = type === "success" ? "check-circle" : type === "warning" ? "alert-triangle" : "info";

  toast.className = `p-3.5 rounded-xl border backdrop-blur-md shadow-2xl flex items-center gap-2.5 text-xs transform transition-all duration-300 pointer-events-auto ${bg}`;
  toast.innerHTML = `
    <i data-lucide="${icon}" class="w-4 h-4 shrink-0"></i>
    <span class="font-medium">${message}</span>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* -------------------------------------------------------------
 * 8. EVENT HANDLERS & MODAL CONTROLS
 * ------------------------------------------------------------- */
function setupEventHandlers() {
  // Layer Toggles
  const foodToggle = document.getElementById("layerFood");
  const heritageToggle = document.getElementById("layerHeritage");
  const hazardToggle = document.getElementById("layerHazard");
  const corridorToggle = document.getElementById("layerSafeCorridors");

  if (foodToggle) {
    foodToggle.addEventListener("change", (e) => {
      if (e.target.checked) map.addLayer(layers.food);
      else map.removeLayer(layers.food);
    });
  }

  if (heritageToggle) {
    heritageToggle.addEventListener("change", (e) => {
      if (e.target.checked) map.addLayer(layers.heritage);
      else map.removeLayer(layers.heritage);
    });
  }

  if (hazardToggle) {
    hazardToggle.addEventListener("change", (e) => {
      if (e.target.checked) map.addLayer(layers.hazard);
      else map.removeLayer(layers.hazard);
    });
  }

  if (corridorToggle) {
    corridorToggle.addEventListener("change", (e) => {
      if (e.target.checked) map.addLayer(layers.safeCorridors);
      else map.removeLayer(layers.safeCorridors);
    });
  }

  // Recenter button
  const resetBtn = document.getElementById("resetMapCenterBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      map.flyTo([28.6220, 77.2180], 14, { duration: 1.0 });
    });
  }

  // Show only hazards button
  const hazardsBtn = document.getElementById("showOnlyHazardsBtn");
  if (hazardsBtn) {
    hazardsBtn.addEventListener("click", () => {
      if (foodToggle) foodToggle.checked = false;
      if (heritageToggle) heritageToggle.checked = false;
      if (hazardToggle) hazardToggle.checked = true;
      map.removeLayer(layers.food);
      map.removeLayer(layers.heritage);
      map.addLayer(layers.hazard);
      map.flyTo([28.6210, 77.2020], 14.5, { duration: 1.0 });
      showToast("Filtered map: Showing active caution and hazard zones only.", "warning");
    });
  }

  // Base Map Style Switcher (Google Satellite / Roads / Dark)
  const btnSat = document.getElementById("btnMapSatellite");
  if (btnSat) btnSat.addEventListener("click", () => setBaseMap("satellite"));

  const btnRoad = document.getElementById("btnMapRoadmap");
  if (btnRoad) btnRoad.addEventListener("click", () => setBaseMap("roadmap"));

  const btnDark = document.getElementById("btnMapDark");
  if (btnDark) btnDark.addEventListener("click", () => setBaseMap("dark"));

  // POI Search input
  const searchInput = document.getElementById("poiSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderPoiList(e.target.value);
    });
  }

  // Route Draw Buttons
  const drawFastBtn = document.getElementById("drawFastestRouteBtn");
  if (drawFastBtn) drawFastBtn.addEventListener("click", drawFastestRoute);

  const drawSafeBtn = document.getElementById("drawSaferRouteBtn");
  if (drawSafeBtn) drawSafeBtn.addEventListener("click", drawSaferRoute);

  // Feed Category Filter Buttons
  const filterBtns = document.querySelectorAll(".feed-filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => {
        b.classList.remove("bg-gradient-to-r", "from-amber-500", "to-orange-500", "text-white", "font-bold");
        b.classList.add("text-slate-600", "font-medium");
      });
      btn.classList.add("bg-gradient-to-r", "from-amber-500", "to-orange-500", "text-white", "font-bold");
      btn.classList.remove("text-slate-600", "font-medium");
      activeFilter = btn.dataset.filter;
      renderSmartFeed();
    });
  });

  // Sidebar Citizen Form
  const sideForm = document.getElementById("sideReportForm");
  if (sideForm) {
    sideForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        category: document.getElementById("reportCategory").value,
        location: document.getElementById("reportLocation").value,
        urgency: document.getElementById("reportUrgency").value,
        author: document.getElementById("reportAuthor").value || "Anonymous Citizen",
        details: document.getElementById("reportDetails").value
      };
      handleReportSubmission(data);
      sideForm.reset();
    });
  }

  // Heatmap Dropdown Selector
  const heatmapSelect = document.getElementById("selectHeatmapMode");
  if (heatmapSelect) {
    heatmapSelect.addEventListener("change", (e) => {
      setHeatmapMode(e.target.value);
    });
  }

  // Modal Setup
  const modal = document.getElementById("reportModal");
  const modalCard = document.getElementById("modalCard");
  const openModalBtn = document.getElementById("openReportModalBtn");
  const quickTopBtn = document.getElementById("quickReportTopBtn");
  const closeModalBtn = document.getElementById("closeReportModalBtn");
  const cancelModalBtn = document.getElementById("cancelReportModalBtn");
  const modalForm = document.getElementById("modalReportForm");

  // Voice Note Simulation State
  let isVoiceRecording = false;
  let voiceRecordInterval = null;
  let voiceSeconds = 0;
  let photoAttached = false;

  const voiceBtn = document.getElementById("modalVoiceRecordBtn");
  const voiceBtnText = document.getElementById("modalVoiceBtnText");
  const waveform = document.getElementById("modalWaveform");
  const voiceTimer = document.getElementById("modalVoiceTimer");
  const voiceStatusBadge = document.getElementById("voiceStatusBadge");
  const photoInput = document.getElementById("modalPhotoInput");
  const photoBadge = document.getElementById("modalPhotoBadge");

  if (voiceBtn) {
    voiceBtn.addEventListener("click", () => {
      if (!isVoiceRecording) {
        isVoiceRecording = true;
        voiceSeconds = 0;
        if (waveform) waveform.classList.add("is-recording");
        if (voiceBtnText) voiceBtnText.textContent = "Stop & Save Memo";
        voiceBtn.classList.remove("bg-gradient-to-r", "from-amber-500", "to-orange-500");
        voiceBtn.classList.add("bg-rose-600");
        if (voiceStatusBadge) {
          voiceStatusBadge.textContent = "🔴 Recording voice note...";
          voiceStatusBadge.classList.add("text-rose-400");
        }

        voiceRecordInterval = setInterval(() => {
          voiceSeconds++;
          const mins = String(Math.floor(voiceSeconds / 60)).padStart(2, "0");
          const secs = String(voiceSeconds % 60).padStart(2, "0");
          if (voiceTimer) voiceTimer.textContent = `${mins}:${secs}`;
        }, 1000);
      } else {
        isVoiceRecording = false;
        clearInterval(voiceRecordInterval);
        if (waveform) waveform.classList.remove("is-recording");
        voiceBtn.classList.remove("bg-rose-600");
        voiceBtn.classList.add("bg-emerald-600");
        if (voiceBtnText) voiceBtnText.textContent = "Voice Memo Saved";
        if (voiceStatusBadge) {
          voiceStatusBadge.textContent = `✓ Recorded (${voiceTimer ? voiceTimer.textContent : '00:05'}) • Attached`;
          voiceStatusBadge.classList.remove("text-rose-400");
          voiceStatusBadge.classList.add("text-emerald-400");
        }
        showToast("Voice note recorded and attached to incident report.", "success");
      }
    });
  }

  if (photoInput) {
    photoInput.addEventListener("change", () => {
      if (photoInput.files && photoInput.files[0]) {
        photoAttached = true;
        if (photoBadge) {
          photoBadge.classList.remove("hidden");
          photoBadge.textContent = `📷 ${photoInput.files[0].name.substring(0, 16)}... Attached`;
        }
        showToast("Hazard photo attached to incident report.", "success");
      }
    });
  }

  function resetModalInputs() {
    isVoiceRecording = false;
    clearInterval(voiceRecordInterval);
    voiceSeconds = 0;
    photoAttached = false;
    if (waveform) waveform.classList.remove("is-recording");
    if (voiceBtn) {
      voiceBtn.classList.remove("bg-rose-600", "bg-emerald-600");
      voiceBtn.classList.add("bg-gradient-to-r", "from-amber-500", "to-orange-500");
    }
    if (voiceBtnText) voiceBtnText.textContent = "Record Voice Note";
    if (voiceTimer) voiceTimer.textContent = "00:00";
    if (voiceStatusBadge) {
      voiceStatusBadge.textContent = "Tap to record";
      voiceStatusBadge.classList.remove("text-rose-400", "text-emerald-400");
    }
    if (photoBadge) photoBadge.classList.add("hidden");
    if (photoInput) photoInput.value = "";
  }

  function openModal() {
    if (!modal) return;
    modal.classList.remove("hidden");
    setTimeout(() => {
      modal.classList.remove("opacity-0");
      if (modalCard) modalCard.classList.remove("scale-95");
    }, 10);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add("opacity-0");
    if (modalCard) modalCard.classList.add("scale-95");
    setTimeout(() => {
      modal.classList.add("hidden");
      resetModalInputs();
    }, 200);
  }

  if (openModalBtn) openModalBtn.addEventListener("click", openModal);
  if (quickTopBtn) quickTopBtn.addEventListener("click", openModal);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener("click", closeModal);

  if (modalForm) {
    modalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        category: document.getElementById("modalCategory").value,
        location: document.getElementById("modalLocation").value,
        urgency: document.getElementById("modalUrgency").value,
        author: document.getElementById("modalAuthor").value || "Anonymous Citizen",
        details: document.getElementById("modalDetails").value,
        hasVoiceMemo: voiceSeconds > 0,
        hasPhoto: photoAttached
      };
      handleReportSubmission(data);
      modalForm.reset();
      closeModal();
    });
  }
}

/* -------------------------------------------------------------
 * 9. VISUAL "BEST VS WORST" CITY HEATMAP OVERLAYS
 * ------------------------------------------------------------- */
function setHeatmapMode(mode) {
  if (!layers.heatmap) return;
  layers.heatmap.clearLayers();

  if (!mode || mode === "none") {
    showToast("City heatmap overlay deactivated.", "info");
    return;
  }

  CITY_ZONES_HEATMAP.forEach((zone) => {
    const val = zone.metrics[mode];
    let strokeColor = "#10b981";
    let fillColor = "#10b981";
    let fillOpacity = 0.35;

    if (mode === "affordability") {
      if (val >= 80) {
        strokeColor = "#10b981"; fillColor = "#10b981";
      } else if (val >= 60) {
        strokeColor = "#f59e0b"; fillColor = "#f59e0b";
      } else {
        strokeColor = "#f43f5e"; fillColor = "#f43f5e";
      }
    } else {
      if (val >= 80) {
        strokeColor = "#10b981"; fillColor = "#10b981";
      } else if (val >= 60) {
        strokeColor = "#f59e0b"; fillColor = "#f59e0b";
      } else {
        strokeColor = "#ef4444"; fillColor = "#ef4444";
      }
    }

    const polygon = L.polygon(zone.polygon, {
      color: strokeColor,
      weight: 2.5,
      fillColor: fillColor,
      fillOpacity: fillOpacity,
      dashArray: val < 60 ? "4, 6" : null
    });

    const modeLabels = {
      safety: "🛡️ Safety Index",
      cleanliness: "🧹 Cleanliness Score",
      affordability: "💰 Affordability Index",
      accessibility: "♿ Accessibility Score"
    };

    const tooltipContent = `
      <div class="p-2 space-y-1 bg-white text-slate-800 rounded-xl shadow-lg border border-orange-100">
        <div class="font-bold text-slate-900 text-xs">${zone.name}</div>
        <div class="text-[11px] text-orange-600 font-semibold">${modeLabels[mode] || mode}: ${val}/100</div>
        <div class="text-[10px] text-slate-600">Status: <strong>${zone.status}</strong></div>
        <div class="text-[10px] text-slate-500 italic">${zone.dominantVibe}</div>
      </div>
    `;

    polygon.bindTooltip(tooltipContent, {
      className: "heatmap-tooltip",
      sticky: true
    });

    polygon.on("click", () => {
      openZoneCompareModalWith(zone.id);
    });

    layers.heatmap.addLayer(polygon);
  });

  showToast(`Heatmap Active: Visualizing ${mode.toUpperCase()} index across city sectors.`, "success");
}

/* -------------------------------------------------------------
 * 10. SIDE-BY-SIDE LOCATION COMPARISON MODAL
 * ------------------------------------------------------------- */
function initZoneCompareModal() {
  const modal = document.getElementById("zoneCompareModal");
  const card = document.getElementById("zoneCompareCard");
  const openBtn = document.getElementById("btnOpenZoneCompare");
  const closeBtn = document.getElementById("closeZoneCompareBtn");
  const selectA = document.getElementById("modalCompareSelectA");
  const selectB = document.getElementById("modalCompareSelectB");

  if (!modal || !selectA || !selectB) return;

  const optionsHtml = CITY_ZONES_HEATMAP.map(z => `<option value="${z.id}">${z.name}</option>`).join("");
  selectA.innerHTML = optionsHtml;
  selectB.innerHTML = optionsHtml;

  selectA.value = CITY_ZONES_HEATMAP[0].id;
  selectB.value = CITY_ZONES_HEATMAP[2].id;

  function openModal() {
    modal.classList.remove("hidden");
    setTimeout(() => {
      modal.classList.remove("opacity-0");
      if (card) card.classList.remove("scale-95");
    }, 10);
    renderZoneComparison();
  }

  function closeModal() {
    modal.classList.add("opacity-0");
    if (card) card.classList.add("scale-95");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 200);
  }

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  selectA.addEventListener("change", renderZoneComparison);
  selectB.addEventListener("change", renderZoneComparison);

  renderZoneComparison();
}

function openZoneCompareModalWith(zoneId) {
  const modal = document.getElementById("zoneCompareModal");
  const card = document.getElementById("zoneCompareCard");
  const selectA = document.getElementById("modalCompareSelectA");
  if (!modal || !selectA) return;

  selectA.value = zoneId;
  modal.classList.remove("hidden");
  setTimeout(() => {
    modal.classList.remove("opacity-0");
    if (card) card.classList.remove("scale-95");
  }, 10);
  renderZoneComparison();
}

function renderZoneComparison() {
  const selectA = document.getElementById("modalCompareSelectA");
  const selectB = document.getElementById("modalCompareSelectB");
  const container = document.getElementById("modalCompareContentGrid");
  if (!selectA || !selectB || !container) return;

  const zoneA = CITY_ZONES_HEATMAP.find(z => z.id === selectA.value) || CITY_ZONES_HEATMAP[0];
  const zoneB = CITY_ZONES_HEATMAP.find(z => z.id === selectB.value) || CITY_ZONES_HEATMAP[1];

  function renderCard(zone, isWinner) {
    const isSafe = zone.metrics.safety >= 75;
    return `
      <div class="glass-panel bg-white p-5 rounded-2xl border ${isSafe ? 'border-emerald-300' : 'border-rose-300'} shadow-sm space-y-4">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isSafe ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}">
                ${zone.status}
              </span>
              ${isWinner ? '<span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">★ Overall Leader</span>' : ''}
            </div>
            <h4 class="text-base font-bold text-slate-900 mt-1.5 leading-snug">${zone.name}</h4>
            <p class="text-[11px] text-slate-500 mt-0.5">${zone.dominantVibe}</p>
          </div>
        </div>

        <div class="space-y-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-slate-600 font-medium">🛡️ Safety Score:</span>
              <span class="font-bold ${zone.metrics.safety >= 75 ? 'text-emerald-700' : 'text-rose-700'}">${zone.metrics.safety}/100</span>
            </div>
            <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div class="${zone.metrics.safety >= 75 ? 'bg-emerald-500' : 'bg-rose-500'} h-full rounded-full transition-all duration-500" style="width: ${zone.metrics.safety}%"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-slate-600 font-medium">🧹 Cleanliness Index:</span>
              <span class="font-bold ${zone.metrics.cleanliness >= 70 ? 'text-amber-600' : 'text-orange-600'}">${zone.metrics.cleanliness}/100</span>
            </div>
            <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div class="${zone.metrics.cleanliness >= 70 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-orange-500'} h-full rounded-full transition-all duration-500" style="width: ${zone.metrics.cleanliness}%"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-slate-600 font-medium">💰 Affordability (Budget Ease):</span>
              <span class="font-bold text-slate-800">${zone.metrics.affordability}/100</span>
            </div>
            <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div class="bg-amber-500 h-full rounded-full transition-all duration-500" style="width: ${zone.metrics.affordability}%"></div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-slate-600 font-medium">♿ Accessibility & Transit:</span>
              <span class="font-bold text-orange-600">${zone.metrics.accessibility}/100</span>
            </div>
            <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500" style="width: ${zone.metrics.accessibility}%"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const avgA = (zoneA.metrics.safety + zoneA.metrics.cleanliness + zoneA.metrics.affordability + zoneA.metrics.accessibility) / 4;
  const avgB = (zoneB.metrics.safety + zoneB.metrics.cleanliness + zoneB.metrics.affordability + zoneB.metrics.accessibility) / 4;

  container.innerHTML = `
    ${renderCard(zoneA, avgA >= avgB)}
    ${renderCard(zoneB, avgB > avgA)}
  `;
}

/* -------------------------------------------------------------
 * 11. "SAFE WALK" COMPANION & EMERGENCY ALERT
 * ------------------------------------------------------------- */
function initEmergencySos() {
  const navBtn = document.getElementById("navbarSosBtn");
  const floatingBtn = document.getElementById("floatingSosBtn");
  const modal = document.getElementById("emergencySosModal");
  const card = document.getElementById("emergencySosCard");
  const closeBtn = document.getElementById("closeSosModalBtn");
  const broadcastBtn = document.getElementById("btnBroadcastSosDistress");

  function openSos() {
    if (!modal) return;
    modal.classList.remove("hidden");
    setTimeout(() => {
      modal.classList.remove("opacity-0");
      if (card) card.classList.remove("scale-95");
    }, 10);
  }

  function closeSos() {
    if (!modal) return;
    modal.classList.add("opacity-0");
    if (card) card.classList.add("scale-95");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 200);
  }

  if (navBtn) navBtn.addEventListener("click", openSos);
  if (floatingBtn) floatingBtn.addEventListener("click", openSos);
  if (closeBtn) closeBtn.addEventListener("click", closeSos);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeSos();
    });
  }

  // Keyboard shortcut: press 's' or 'S' outside input fields to simulate shake alert
  window.addEventListener("keydown", (e) => {
    if ((e.key === "s" || e.key === "S") && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
      openSos();
      showToast("⚡ Shake / Emergency Sensor Triggered: SOS Mode Active!", "warning");
    }
  });

  if (broadcastBtn) {
    broadcastBtn.addEventListener("click", () => {
      const distressReport = {
        id: `sos-${Date.now()}`,
        type: "citizen",
        category: "Safety Hazard",
        title: "🚨 EMERGENCY SOS DISTRESS SIGNAL BROADCASTED",
        location: EMERGENCY_SERVICES.currentSimulatedGps.address,
        coords: [EMERGENCY_SERVICES.currentSimulatedGps.lat, EMERGENCY_SERVICES.currentSimulatedGps.lng],
        timestamp: "Just now (LIVE DISTRESS)",
        author: "Active User Companion",
        urgency: "High",
        description: `Urgent citizen emergency beacon triggered at ${EMERGENCY_SERVICES.currentSimulatedGps.address}. GPS: ${EMERGENCY_SERVICES.currentSimulatedGps.lat}, ${EMERGENCY_SERVICES.currentSimulatedGps.lng}. Nearest sanctuary: ${EMERGENCY_SERVICES.nearestSafeSanctuary.name} (${EMERGENCY_SERVICES.nearestSafeSanctuary.distanceMeters}m).`,
        votes: 16,
        hasVoted: true,
        status: "DISPATCH INITIATED: Police & Medical Escort Responding",
        hasMedia: true,
        mediaNote: "🚨 Live differential GPS telemetry transmitted"
      };

      feedData.unshift(distressReport);
      renderSmartFeed();

      if (map && layers.hazard) {
        const sosMarker = L.marker(distressReport.coords, {
          icon: L.divIcon({
            className: "sos-map-marker",
            html: `
              <div class="relative flex items-center justify-center">
                <div class="sos-beacon-ring" style="width: 44px; height: 44px;"></div>
                <div class="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center text-sm font-extrabold border-2 border-white shadow-xl animate-bounce">🚨</div>
              </div>
            `,
            iconSize: [36, 36]
          })
        }).addTo(layers.hazard);

        sosMarker.bindPopup(`
          <div class="p-3 text-xs space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-rose-600 text-white font-extrabold text-[10px] uppercase">🚨 Live Distress SOS</span>
            <div class="font-bold text-white text-sm">${EMERGENCY_SERVICES.currentSimulatedGps.address}</div>
            <p class="text-rose-200">Patrol Units Notified. Stay at nearest illuminated sanctuary (${EMERGENCY_SERVICES.nearestSafeSanctuary.distanceMeters}m).</p>
          </div>
        `).openPopup();

        map.flyTo(distressReport.coords, 16.5, { duration: 1.0 });
      }

      closeSos();
      showToast("🚨 EMERGENCY DISTRESS BROADCASTED: Live coordinates sent to 112 Dispatch and live feed!", "warning");
    });
  }
}

/* -------------------------------------------------------------
 * 12. AI-POWERED "CHAOS-TO-CALM" DYNAMIC ITINERARY BUILDER
 * ------------------------------------------------------------- */
let itineraryBudget = "low";
let itineraryTime = 4;
let isItineraryRerouted = false;

function initItineraryBuilder() {
  const budgetBtns = document.querySelectorAll(".itinerary-budget-btn");
  const timeBtns = document.querySelectorAll(".itinerary-time-btn");
  const btnGenerate = document.getElementById("btnGenerateItinerary");
  const btnReroute = document.getElementById("btnWeatherReroute");

  budgetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      budgetBtns.forEach(b => {
        b.classList.remove("border-orange-500", "bg-gradient-to-r", "from-amber-500", "to-orange-500", "text-white", "font-bold", "shadow-sm");
        b.classList.add("border-slate-200", "bg-slate-50", "text-slate-700", "font-medium");
      });
      btn.classList.add("border-orange-500", "bg-gradient-to-r", "from-amber-500", "to-orange-500", "text-white", "font-bold", "shadow-sm");
      btn.classList.remove("border-slate-200", "bg-slate-50", "text-slate-700", "font-medium");
      itineraryBudget = btn.dataset.budget;
      generateItinerary(isItineraryRerouted);
    });
  });

  timeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      timeBtns.forEach(b => {
        b.classList.remove("border-orange-500", "bg-gradient-to-r", "from-amber-500", "to-orange-500", "text-white", "font-bold", "shadow-sm");
        b.classList.add("border-slate-200", "bg-slate-50", "text-slate-700", "font-medium");
      });
      btn.classList.add("border-orange-500", "bg-gradient-to-r", "from-amber-500", "to-orange-500", "text-white", "font-bold", "shadow-sm");
      btn.classList.remove("border-slate-200", "bg-slate-50", "text-slate-700", "font-medium");
      itineraryTime = parseInt(btn.dataset.time, 10);
      generateItinerary(isItineraryRerouted);
    });
  });

  if (btnGenerate) {
    btnGenerate.addEventListener("click", () => {
      isItineraryRerouted = false;
      generateItinerary(false);
      showToast("✨ AI Day Itinerary Generated for your preferences!", "success");
    });
  }

  if (btnReroute) {
    btnReroute.addEventListener("click", () => {
      isItineraryRerouted = !isItineraryRerouted;
      generateItinerary(isItineraryRerouted);
      if (isItineraryRerouted) {
        showToast("⛈️ Sudden Weather/Traffic Chaos Simulated: Itinerary rerouted to covered indoor gems!", "warning");
      } else {
        showToast("☀️ Weather Cleared: Restored outdoor cultural exploration itinerary.", "info");
      }
    });
  }

  generateItinerary(false);
}

function generateItinerary(isRerouted = false) {
  const container = document.getElementById("itineraryTimelineContainer");
  const rerouteBanner = document.getElementById("itineraryRerouteBanner");
  const costSummary = document.getElementById("itineraryCostSummary");
  const safetySummary = document.getElementById("itinerarySafetySummary");
  const stopsSummary = document.getElementById("itineraryStopsCount");

  if (!container) return;

  if (isRerouted) {
    if (rerouteBanner) rerouteBanner.classList.remove("hidden");
  } else {
    if (rerouteBanner) rerouteBanner.classList.add("hidden");
  }

  let steps = [];

  if (isRerouted) {
    steps = [
      {
        step: 1,
        time: "10:30 AM - 12:00 PM",
        name: "Subterranean Water Pavilion & Acoustic Arches",
        type: "Heritage Secret (Rain-Proof & Covered)",
        cost: "$0 (Free Public)",
        duration: "1.5 hours",
        lat: 28.6160,
        lng: 77.2120,
        tip: "14th-century arched subterranean haven sheltered from storms with natural cooling.",
        safeTransit: "Safe Corridor #2 (Underpass covered walkway with CCTV)",
        icon: "shield-check"
      },
      {
        step: 2,
        time: "12:15 PM - 1:45 PM",
        name: "Solar Rooftop Conservatory & Botanical Nook",
        type: "Chaos-to-Calm Indoor Haven",
        cost: "$3 - $5 (Organic Roast)",
        duration: "1.5 hours",
        lat: 28.6195,
        lng: 77.2240,
        tip: "Double-glazed tropical glass dome with quiet acoustic zones while storms pass outside.",
        safeTransit: "Connected via Cyber Core Skywalk (100% weather sheltered)",
        icon: "coffee"
      },
      {
        step: 3,
        time: "2:00 PM - 3:30 PM",
        name: "Antique Lithograph & Cartography Archive Gallerias",
        type: "Covered Heritage Arcade",
        cost: "$0 (Free Entry)",
        duration: "1.5 hours",
        lat: 28.6365,
        lng: 77.2290,
        tip: "Colonnaded stone archway with historic 1850s city maps, completely safe from street gridlock.",
        safeTransit: "Metro Line 3 directly exits into indoor heritage concourse",
        icon: "compass"
      }
    ];
  } else {
    if (itineraryBudget === "low") {
      steps = [
        {
          step: 1,
          time: "09:30 AM - 11:00 AM",
          name: "Ancient Observatory & Stepwell (Baoli)",
          type: "Heritage Wonder",
          cost: "Free Admission",
          duration: "1.5 hours",
          lat: 28.6145,
          lng: 77.2140,
          tip: "Medieval engineering wonder with natural cooling and shaded walkways.",
          safeTransit: "Greenwood Safe Corridor (Illuminated)",
          icon: "landmark"
        },
        {
          step: 2,
          time: "11:30 AM - 1:00 PM",
          name: "The Corner Baker & Artisanal Roastery",
          type: "Budget-Friendly Cafe",
          cost: "$2 - $4",
          duration: "1.5 hours",
          lat: 28.6180,
          lng: 77.1980,
          tip: "Fresh sourdough and pour-overs along a leafy, well-patrolled boulevard.",
          safeTransit: "Smart Transit Bicycle / Walking Path",
          icon: "coffee"
        },
        {
          step: 3,
          time: "1:30 PM - 3:30 PM",
          name: "Royal Fortress & Grand Citadel",
          type: "UNESCO Heritage Landmark",
          cost: "$1 (Student) / $2",
          duration: "2 hours",
          lat: 28.6410,
          lng: 77.2380,
          tip: "Magnificent ramparts with tourist police booths and verified guides.",
          safeTransit: "Citadel North Safe Corridor",
          icon: "shield-check"
        },
        {
          step: 4,
          time: "5:00 PM - 7:00 PM",
          name: "Neon Alley Night Market & Sizzle Stalls",
          type: "Street Food Safari",
          cost: "$3 - $6",
          duration: "2 hours",
          lat: 28.6255,
          lng: 77.2185,
          tip: "Famous sizzling wok noodles, dumplings, and skewers. Verified hygienic vendors.",
          safeTransit: "Protected Night Food SafeWalk Promenade",
          icon: "utensils"
        }
      ];
    } else if (itineraryBudget === "mid") {
      steps = [
        {
          step: 1,
          time: "10:00 AM - 12:00 PM",
          name: "Royal Fortress & Grand Citadel Audio Tour",
          type: "Curated Cultural Deep Dive",
          cost: "$4 (Guide included)",
          duration: "2 hours",
          lat: 28.6410,
          lng: 77.2380,
          tip: "Sandstone corridors with historic exhibits and scenic viewpoints.",
          safeTransit: "North Escort Corridor",
          icon: "landmark"
        },
        {
          step: 2,
          time: "12:30 PM - 2:00 PM",
          name: "Spice Symphony Heritage Dhaba",
          type: "Iconic Traditional Feast",
          cost: "$7 - $12",
          duration: "1.5 hours",
          lat: 28.6340,
          lng: 77.2250,
          tip: "Traditional slow-cooked dal makhani, butter naan, and saffron kulhad chai.",
          safeTransit: "Bazaar Well-Lit Main Spine",
          icon: "utensils"
        },
        {
          step: 3,
          time: "2:30 PM - 4:30 PM",
          name: "Subterranean Water Pavilion & Acoustic Arches",
          type: "Hidden Heritage Wonder",
          cost: "Free Admission",
          duration: "2 hours",
          lat: 28.6160,
          lng: 77.2120,
          tip: "Subterranean acoustic arches and medieval water purification channels.",
          safeTransit: "Connected via Safe Corridor #2",
          icon: "compass"
        }
      ];
    } else {
      steps = [
        {
          step: 1,
          time: "11:00 AM - 1:00 PM",
          name: "Private Heritage Walk & Royal Citadel VIP",
          type: "Exclusive Cultural Access",
          cost: "$15 entry & historian guide",
          duration: "2 hours",
          lat: 28.6410,
          lng: 77.2380,
          tip: "Private access to 17th-century chambers and antique manuscripts.",
          safeTransit: "Dedicated Heritage Security Escort",
          icon: "landmark"
        },
        {
          step: 2,
          time: "1:30 PM - 3:30 PM",
          name: "Skyline Rooftop Bistro & Lounge",
          type: "Upscale Panoramic Dining",
          cost: "$25 - $40 / person",
          duration: "2 hours",
          lat: 28.6080,
          lng: 77.2280,
          tip: "Panoramic metro views, guarded access, valet, and artisanal culinary pairings.",
          safeTransit: "Cyber Core High-Security District",
          icon: "coffee"
        },
        {
          step: 3,
          time: "4:00 PM - 6:00 PM",
          name: "Solar Rooftop Conservatory & Private Lounge",
          type: "VIP Calm Sanctuary",
          cost: "$10 signature brew",
          duration: "2 hours",
          lat: 28.6195,
          lng: 77.2240,
          tip: "Botanical sanctuary high above city noise with private seating pods.",
          safeTransit: "Monitored Express Corridor",
          icon: "shield-check"
        }
      ];
    }
  }

  if (itineraryTime === 2) {
    steps = steps.slice(0, 2);
  } else if (itineraryTime === 4) {
    steps = steps.slice(0, 3);
  }

  container.innerHTML = steps.map((s) => `
    <div class="glass-panel bg-white/85 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-orange-100/90 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 space-y-3 relative overflow-hidden group">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 text-orange-700 font-extrabold flex items-center justify-center border border-orange-200 text-sm shadow-xs">
            0${s.step}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
                ${s.time}
              </span>
              <span class="text-[10px] font-semibold text-emerald-700">
                ${s.cost}
              </span>
            </div>
            <h4 class="text-sm sm:text-base font-bold text-slate-900 mt-1 group-hover:text-orange-600 transition-colors">${s.name}</h4>
          </div>
        </div>

        <button onclick="zoomToCoords(${s.lat}, ${s.lng})" class="px-3.5 py-1.5 rounded-full bg-white hover:bg-orange-50 text-orange-600 text-xs font-semibold flex items-center gap-1 border border-orange-200 shadow-xs shrink-0 transition-all hover:scale-105">
          <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
          <span>View</span>
        </button>
      </div>

      <p class="text-xs text-slate-600 leading-relaxed">${s.tip}</p>

      <div class="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <div class="flex items-center gap-1.5 text-emerald-700 font-medium">
          <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
          <span>${s.safeTransit}</span>
        </div>
        <span class="text-slate-400">Est. Duration: ${s.duration}</span>
      </div>
    </div>
  `).join("");

  if (costSummary) {
    if (isRerouted) costSummary.textContent = "$3 - $6 (Budget Indoor Haven)";
    else if (itineraryBudget === "low") costSummary.textContent = "$6 - $12 total";
    else if (itineraryBudget === "mid") costSummary.textContent = "$15 - $25 total";
    else costSummary.textContent = "$45 - $75 (Upscale)";
  }

  if (safetySummary) {
    safetySummary.textContent = isRerouted ? "98/100 (Sheltered & Weather-Proof)" : "96/100 (SafeWalk Verified)";
  }

  if (stopsSummary) {
    stopsSummary.textContent = `${steps.length} Curated Locations (${itineraryTime}h Window)`;
  }

  lucide.createIcons();
}

/* -------------------------------------------------------------
 * 13. MICRO-GAMIFICATION: BADGES & HIDDEN SECRETS RADAR
 * ------------------------------------------------------------- */
let userXp = 1450;

function initGamification() {
  renderBadges();
  renderHiddenGems();

  const checkinBtn = document.getElementById("btnGamificationCheckin");
  if (checkinBtn) {
    checkinBtn.addEventListener("click", () => {
      userXp += 50;
      const xpElem = document.getElementById("userTotalXp");
      if (xpElem) xpElem.textContent = `${userXp.toLocaleString()} XP`;

      const lockedBadge = EXPLORER_BADGES.find(b => !b.isUnlocked);
      if (lockedBadge) {
        lockedBadge.progress = Math.min(100, lockedBadge.progress + 20);
        if (lockedBadge.progress >= 100) {
          lockedBadge.isUnlocked = true;
          showToast(`🏆 UNLOCKED NEW BADGE: ${lockedBadge.title}! You are now an official ${lockedBadge.level}!`, "success");
        } else {
          showToast(`🎉 +50 XP Earned! City Explorer check-in recorded at safe corridor hub.`, "success");
        }
        renderBadges();
      } else {
        showToast(`🎉 +50 XP Earned! All city explorer badges achieved!`, "success");
      }
    });
  }
}

function renderBadges() {
  const container = document.getElementById("badgesContainer");
  if (!container) return;

  container.innerHTML = EXPLORER_BADGES.map(b => `
    <div class="glass-panel bg-white/90 p-4 rounded-2xl border ${b.isUnlocked ? 'border-orange-200 shadow-sm' : 'border-slate-200/80 shadow-xs opacity-85'} flex items-center gap-3.5 transition-all">
      <div class="w-11 h-11 rounded-xl ${b.isUnlocked ? 'bg-gradient-to-br from-amber-50 to-orange-100 text-orange-600 border border-orange-200' : 'bg-slate-100 text-slate-400 border border-slate-200'} flex items-center justify-center shrink-0">
        <i data-lucide="${b.icon}" class="w-5 h-5"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-bold text-slate-900 truncate">${b.title}</h4>
          <span class="text-[10px] font-bold ${b.isUnlocked ? 'text-orange-600 font-extrabold' : 'text-slate-400'}">
            ${b.isUnlocked ? '★ ' + b.points + ' XP' : b.progress + '%'}
          </span>
        </div>
        <p class="text-[11px] text-slate-500 mt-0.5 truncate">${b.description}</p>
        <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
          <div class="${b.isUnlocked ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-slate-400'} h-full rounded-full transition-all duration-500" style="width: ${b.progress}%"></div>
        </div>
      </div>
    </div>
  `).join("");

  lucide.createIcons();
}

function renderHiddenGems() {
  const container = document.getElementById("hiddenGemsContainer");
  if (!container) return;

  container.innerHTML = HIDDEN_GEMS.map(g => `
    <div class="glass-panel bg-white/90 p-4 rounded-2xl border border-orange-100/80 shadow-xs hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5 transition-all duration-300 space-y-2 group">
      <div class="flex items-start justify-between gap-2">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
              📍 ${g.distanceMeters}m (${g.walkTime})
            </span>
            <span class="text-[10px] font-bold text-amber-600">${g.cost}</span>
          </div>
          <h4 class="text-xs sm:text-sm font-bold text-slate-900 mt-1 group-hover:text-orange-600 transition-colors">${g.name}</h4>
        </div>
        <button onclick="zoomToGem(${g.lat}, ${g.lng}, '${g.name.replace(/'/g, "\\'")}', '${g.vibe.replace(/'/g, "\\'")}')" class="px-3.5 py-1 rounded-full bg-white hover:bg-orange-50 text-orange-600 text-[11px] font-semibold border border-orange-200 shadow-xs shrink-0 transition-all hover:scale-105">
          Radar Pin
        </button>
      </div>
      <p class="text-[11px] text-slate-600 leading-relaxed">${g.vibe}</p>
      <div class="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
        <span class="text-emerald-700 font-semibold">🛡️ Safety Score: ${g.safetyScore}/100</span>
        <span class="italic text-slate-400">${g.tip}</span>
      </div>
    </div>
  `).join("");

  lucide.createIcons();
}

function zoomToGem(lat, lng, name, vibe) {
  if (map) {
    map.flyTo([lat, lng], 16.5, { duration: 1.0 });

    const gemIcon = L.divIcon({
      className: "custom-gem-pin",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="safe-pulse-ring" style="width: 36px; height: 36px;"></div>
          <div class="w-7 h-7 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg">💎</div>
        </div>
      `,
      iconSize: [30, 30]
    });

    const marker = L.marker([lat, lng], { icon: gemIcon }).addTo(map);
    marker.bindPopup(`
      <div class="p-2.5 text-xs space-y-1 bg-white text-slate-800 rounded-xl shadow-lg border border-orange-100">
        <span class="text-[10px] font-bold text-orange-600 uppercase">Hidden Secret Radar</span>
        <div class="font-bold text-slate-900 text-sm">${name}</div>
        <p class="text-slate-600">${vibe}</p>
      </div>
    `).openPopup();
  }

  const mapElem = document.getElementById("mapSection");
  if (mapElem) mapElem.scrollIntoView({ behavior: "smooth" });
  showToast(`Radar targeted: ${name}`, "info");
}

/* -------------------------------------------------------------
 * 14. SCROLL REVEAL & INTERSECTION OBSERVER ANIMATIONS
 * ------------------------------------------------------------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  const progressBar = document.getElementById("scrollProgressBar");
  const backToTopBtn = document.getElementById("backToTopBtn");

  // Top scroll progress bar & back-to-top button
  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && progressBar) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }

    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.remove("opacity-0", "pointer-events-none");
        backToTopBtn.classList.add("opacity-100", "pointer-events-auto");
      } else {
        backToTopBtn.classList.add("opacity-0", "pointer-events-none");
        backToTopBtn.classList.remove("opacity-100", "pointer-events-auto");
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // IntersectionObserver for staggered reveals
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px"
    });

    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add("revealed"));
  }
}

/* -------------------------------------------------------------
 * 15. GLOBAL WORLDWIDE EXPLORATION ENGINE & METROPOLIS SWITCHER
 * ------------------------------------------------------------- */
function initGlobalExplorer() {
  const searchInput = document.getElementById("globalCitySearchInput");
  const searchBtn = document.getElementById("btnGlobalSearch");
  const searchDropdown = document.getElementById("globalSearchDropdown");
  const myLocationBtn = document.getElementById("btnUseMyLocation");
  const dropPinBtn = document.getElementById("btnToggleDropPinMode");
  const dropPinBtnText = document.getElementById("dropPinBtnText");
  const presetPills = document.querySelectorAll("#metropolisPresetsBar .global-preset-pill");

  // Preset pill clicks
  presetPills.forEach(pill => {
    pill.addEventListener("click", () => {
      const cityId = pill.dataset.city;
      const targetCity = GLOBAL_CITIES_PRESETS.find(c => c.id === cityId);
      if (targetCity) {
        presetPills.forEach(p => p.classList.remove("city-preset-active"));
        pill.classList.add("city-preset-active");
        switchGlobalCity(targetCity);
      }
    });
  });

  // Search execution
  async function executeWorldSearch(query) {
    if (!query || !query.trim()) return;
    const cleanQuery = query.trim().toLowerCase();

    // Check presets first
    const presetMatch = GLOBAL_CITIES_PRESETS.find(c => 
      c.name.toLowerCase().includes(cleanQuery) || 
      c.country.toLowerCase().includes(cleanQuery) ||
      cleanQuery.includes(c.name.toLowerCase())
    );

    if (presetMatch) {
      if (searchDropdown) searchDropdown.classList.add("hidden");
      switchGlobalCity(presetMatch);
      return;
    }

    // Geocode via OpenStreetMap Nominatim for ANY location on Earth
    showToast(`Searching worldwide map for "${query}"...`, "info");
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`, {
        headers: { "Accept-Language": "en" }
      });
      const results = await response.json();

      if (results && results.length > 0) {
        if (searchDropdown) searchDropdown.classList.add("hidden");
        const topResult = results[0];
        const lat = parseFloat(topResult.lat);
        const lng = parseFloat(topResult.lon);
        const dynamicCity = generateDynamicCityDataset(topResult.display_name, lat, lng);
        switchGlobalCity(dynamicCity);
      } else {
        // Fallback geocode approximation
        showToast(`Locating approximate coordinates for "${query}"...`, "warning");
        const hashLat = 20 + ((query.split("").reduce((a,c)=>a+c.charCodeAt(0),0) % 50) - 20);
        const hashLng = ((query.split("").reduce((a,c)=>a+c.charCodeAt(0),0) * 7) % 360) - 180;
        const dynamicCity = generateDynamicCityDataset(query, hashLat, hashLng);
        switchGlobalCity(dynamicCity);
      }
    } catch (err) {
      console.warn("Global geocode fetch, using dynamic synthesizer:", err);
      const hashLat = 35.0 + (Math.random() * 20 - 10);
      const hashLng = 10.0 + (Math.random() * 40 - 20);
      const dynamicCity = generateDynamicCityDataset(query, hashLat, hashLng);
      switchGlobalCity(dynamicCity);
    }
  }

  // Autocomplete suggestions on input
  let searchDebounceTimer = null;
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchDebounceTimer);
      const val = e.target.value.trim().toLowerCase();
      if (!val || val.length < 2) {
        if (searchDropdown) searchDropdown.classList.add("hidden");
        return;
      }

      searchDebounceTimer = setTimeout(async () => {
        const matchedPresets = GLOBAL_CITIES_PRESETS.filter(c => 
          c.name.toLowerCase().includes(val) || c.country.toLowerCase().includes(val)
        );

        let itemsHtml = matchedPresets.map(c => `
          <div class="p-3 hover:bg-orange-50/80 cursor-pointer flex items-center justify-between transition-colors search-result-item" data-preset="${c.id}">
            <div class="flex items-center gap-2">
              <span class="text-base">${c.flag}</span>
              <div>
                <div class="font-bold text-slate-900 text-xs">${c.name}, ${c.country}</div>
                <div class="text-[10px] text-orange-600">Verified Metropolis &bull; Safety: ${c.safetyScore}/100</div>
              </div>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-orange-100/80 text-orange-700 font-semibold border border-orange-200/80">Explore &rarr;</span>
          </div>
        `).join("");

        if (searchDropdown) {
          if (itemsHtml) {
            searchDropdown.innerHTML = itemsHtml;
            searchDropdown.classList.remove("hidden");
            searchDropdown.querySelectorAll(".search-result-item").forEach(item => {
              item.addEventListener("click", () => {
                const city = GLOBAL_CITIES_PRESETS.find(c => c.id === item.dataset.preset);
                if (city) {
                  searchDropdown.classList.add("hidden");
                  searchInput.value = `${city.name}, ${city.country}`;
                  switchGlobalCity(city);
                }
              });
            });
          } else {
            searchDropdown.innerHTML = `
              <div class="p-3 text-xs text-slate-500 flex items-center justify-between">
                <span>Search worldwide for "<strong>${val}</strong>"</span>
                <span class="text-orange-600 font-semibold">Press Enter</span>
              </div>
            `;
            searchDropdown.classList.remove("hidden");
          }
        }
      }, 250);
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        executeWorldSearch(searchInput.value);
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      executeWorldSearch(searchInput ? searchInput.value : "");
    });
  }

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (searchDropdown && !searchDropdown.contains(e.target) && e.target !== searchInput) {
      searchDropdown.classList.add("hidden");
    }
  });

  // My Location detector
  if (myLocationBtn) {
    myLocationBtn.addEventListener("click", () => {
      if ("geolocation" in navigator) {
        showToast("Detecting your GPS location...", "info");
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            let detectedName = `GPS Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`;
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
              const data = await res.json();
              if (data && data.address) {
                detectedName = data.address.city || data.address.town || data.address.state || detectedName;
              }
            } catch(e) {}
            const myCity = generateDynamicCityDataset(detectedName, lat, lng);
            switchGlobalCity(myCity);
            showToast(`📍 Centered to your current location: ${detectedName}!`, "success");
          },
          () => {
            showToast("Geolocation access declined. Teleporting to Paris, France.", "warning");
            const fallback = GLOBAL_CITIES_PRESETS.find(c => c.id === "paris");
            if (fallback) switchGlobalCity(fallback);
          },
          { timeout: 7000 }
        );
      } else {
        showToast("Geolocation not supported by browser.", "warning");
      }
    });
  }

  // Drop Pin Anywhere on Earth Mode
  if (dropPinBtn) {
    dropPinBtn.addEventListener("click", () => {
      isDropPinMode = !isDropPinMode;
      if (isDropPinMode) {
        dropPinBtn.classList.remove("bg-slate-800/90", "text-emerald-300");
        dropPinBtn.classList.add("bg-emerald-600", "text-white");
        if (dropPinBtnText) dropPinBtnText.textContent = "Click Map to Pin!";
        showToast("📍 Drop Pin Mode ACTIVE: Click ANY location on the world map to inspect local safety!", "success");
      } else {
        dropPinBtn.classList.remove("bg-emerald-600", "text-white");
        dropPinBtn.classList.add("bg-slate-800/90", "text-emerald-300");
        if (dropPinBtnText) dropPinBtnText.textContent = "Drop Pin Anywhere";
        showToast("Drop Pin Mode deactivated.", "info");
      }
    });
  }
}

function switchGlobalCity(cityData) {
  if (!map || !cityData) return;

  activeCityData = cityData;

  // Clear previous layers
  if (layers.food) layers.food.clearLayers();
  if (layers.heritage) layers.heritage.clearLayers();
  if (layers.hazard) layers.hazard.clearLayers();
  if (layers.safeCorridors) layers.safeCorridors.clearLayers();
  if (layers.globalPins) layers.globalPins.clearLayers();
  if (layers.heatmap) layers.heatmap.clearLayers();
  if (layers.navigation) layers.navigation.clearLayers();

  // Reset POI_DATA and re-populate
  POI_DATA.length = 0;
  if (cityData.pois && cityData.pois.length > 0) {
    cityData.pois.forEach(p => POI_DATA.push(p));
  }

  // Update corridors
  if (cityData.safeCorridors) {
    cityData.safeCorridors.forEach(corridor => {
      const polyline = L.polyline(corridor.coordinates, {
        color: "#10b981",
        weight: 6,
        opacity: 0.85,
        lineCap: "round",
        lineJoin: "round"
      });
      polyline.bindPopup(`
        <div class="p-3 text-xs space-y-1">
          <div class="font-bold text-emerald-400 flex items-center gap-1.5">
            <span>🛡️ ${corridor.name}</span>
          </div>
          <p class="text-slate-300">Continuous LED illuminated safe greenway with CCTV surveillance.</p>
        </div>
      `);
      layers.safeCorridors.addLayer(polyline);

      const bufferLine = L.polyline(corridor.coordinates, {
        color: "#34d399",
        weight: 12,
        opacity: 0.25
      });
      layers.safeCorridors.addLayer(bufferLine);
    });
  }

  // Update zones for heatmap if available
  if (cityData.zones) {
    CITY_ZONES_HEATMAP.length = 0;
    cityData.zones.forEach(z => CITY_ZONES_HEATMAP.push(z));
    const heatmapSelect = document.getElementById("selectHeatmapMode");
    if (heatmapSelect && heatmapSelect.value !== "none") {
      setHeatmapMode(heatmapSelect.value);
    }
  }

  // Render POI markers
  POI_DATA.forEach(item => {
    const marker = L.marker([item.lat, item.lng], {
      icon: createCustomMarker(item)
    });
    marker.bindPopup(generatePopupHtml(item));
    marker.on("click", () => displayPoiDetails(item));

    if (item.category === "food") layers.food.addLayer(marker);
    else if (item.category === "heritage") layers.heritage.addLayer(marker);
    else if (item.category === "hazard") {
      layers.hazard.addLayer(marker);
      const circle = L.circle([item.lat, item.lng], {
        color: "#f43f5e",
        fillColor: "#f43f5e",
        fillOpacity: 0.18,
        weight: 1.5,
        dashArray: "4, 6",
        radius: 200
      });
      layers.hazard.addLayer(circle);
    }
    allMarkers[item.id] = marker;
  });

  // Re-render sidebar drawer
  renderPoiList();
  if (POI_DATA.length > 0) displayPoiDetails(POI_DATA[0]);

  // Update telemetry and labels
  const cityLabel = document.getElementById("activeCityLabel");
  if (cityLabel) cityLabel.textContent = `${cityData.name} ${cityData.flag || ''}`;

  const tickerTemp = document.getElementById("tickerTemp");
  if (tickerTemp) tickerTemp.textContent = `${cityData.temp || '22°C'} Breezy`;

  const tickerAqi = document.getElementById("tickerAqi");
  if (tickerAqi) tickerAqi.textContent = `AQI ${cityData.aqi || '25'} (Optimal)`;

  const tickerSafety = document.getElementById("tickerSafetyScore");
  if (tickerSafety) tickerSafety.textContent = `${cityData.safetyScore || 90}/100`;

  // Update pills active state
  document.querySelectorAll("#metropolisPresetsBar .global-preset-pill").forEach(pill => {
    if (pill.dataset.city === cityData.id) {
      pill.classList.add("city-preset-active");
    } else {
      pill.classList.remove("city-preset-active");
    }
  });

  // Fly to destination smoothly
  map.flyTo([cityData.lat, cityData.lng], cityData.zoom || 14, {
    duration: 1.5,
    easeLinearity: 0.25
  });

  showToast(`${cityData.flag || '🌍'} Welcome to ${cityData.name}! UrbanWay safety & exploration loaded.`, "success");
}

function handleGlobalMapClick(e) {
  if (!map) return;
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  const dynamicSafety = 80 + Math.floor(Math.sin(lat * 5 + lng * 3) * 15);
  const isSafe = dynamicSafety >= 80;

  if (layers.globalPins) layers.globalPins.clearLayers();

  const customPin = L.divIcon({
    className: "worldwide-dropped-pin",
    html: `
      <div class="relative flex items-center justify-center">
        <div class="global-pin-pulse" style="width: 40px; height: 40px;"></div>
        <div class="w-8 h-8 rounded-full ${isSafe ? 'bg-cyan-500' : 'bg-amber-500'} text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-xl">
          📍
        </div>
      </div>
    `,
    iconSize: [32, 32]
  });

  const marker = L.marker([lat, lng], { icon: customPin }).addTo(layers.globalPins);
  marker.bindPopup(`
    <div class="p-3 text-xs space-y-2 bg-white text-slate-800 rounded-xl shadow-lg border border-orange-100">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded-full bg-orange-100/80 text-orange-700 font-bold uppercase text-[10px] border border-orange-200/80">
          Worldwide Point Analysis
        </span>
        <span class="${isSafe ? 'text-emerald-600' : 'text-amber-600'} font-bold">Safety: ${dynamicSafety}/100</span>
      </div>
      <h4 class="font-bold text-slate-900 text-sm">Coordinates: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°</h4>
      <p class="text-slate-600 text-[11px]">
        UrbanWay Telemetry: ${isSafe ? 'Verified peaceful zone with good street visibility.' : 'Moderate caution advised after dark. Follow main illuminated corridors.'}
      </p>
      <div class="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
        <span>Nearest Sanctuary: ~350m</span>
        <button onclick="zoomToCoords(${lat}, ${lng})" class="text-orange-600 hover:text-orange-700 hover:underline font-semibold">Center Point</button>
      </div>
    </div>
  `).openPopup();

  showToast(`Analyzed point at [${lat.toFixed(3)}°, ${lng.toFixed(3)}°] — Safety Score: ${dynamicSafety}/100`, isSafe ? "success" : "warning");
}

/* -------------------------------------------------------------
 * 14. HAZARD REPORT MODAL HELPER
 * ------------------------------------------------------------- */
function openHazardReportModal() {
  const modal = document.getElementById("reportModal");
  const modalCard = document.getElementById("modalCard");
  if (modal) {
    modal.classList.remove("hidden");
    setTimeout(() => {
      if (modalCard) {
        modalCard.classList.remove("scale-95", "opacity-0");
        modalCard.classList.add("scale-100", "opacity-100");
      }
    }, 10);
    lucide.createIcons();
  }
}

/* -------------------------------------------------------------
 * 15. THEME SWITCHER (OBSIDIAN DARK & CRISP SLATE LIGHT THEME)
 * ------------------------------------------------------------- */
function initThemeSwitcher() {
  const toggleBtn = document.getElementById("themeToggleBtn");
  const sunIcon = document.getElementById("themeIconSun");
  const moonIcon = document.getElementById("themeIconMoon");

  const savedTheme = localStorage.getItem("urbanway_theme") || "light";
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isCurrentlyLight = document.body.classList.contains("light-theme");
      const nextTheme = isCurrentlyLight ? "dark" : "light";
      applyTheme(nextTheme);
      showToast(nextTheme === "light" ? "Switched to Crisp Slate Light mode" : "Switched to Obsidian Dark mode", "info");
    });
  }

  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.classList.add("light-theme");
      document.body.classList.add("light-theme");
      if (sunIcon) sunIcon.classList.add("hidden");
      if (moonIcon) moonIcon.classList.remove("hidden");
      localStorage.setItem("urbanway_theme", "light");
    } else {
      document.documentElement.classList.remove("light-theme");
      document.body.classList.remove("light-theme");
      if (sunIcon) sunIcon.classList.remove("hidden");
      if (moonIcon) moonIcon.classList.add("hidden");
      localStorage.setItem("urbanway_theme", "dark");
    }
    lucide.createIcons();
  }
}

/* -------------------------------------------------------------
 * 16. INTERACTIVE MAP HUD CONTROLS (FLOATING CHIPS & PILLS)
 * ------------------------------------------------------------- */
function initMapHudControls() {
  const chipSafe = document.getElementById("hudChipSafe");
  const chipFood = document.getElementById("hudChipFood");
  const chipHeritage = document.getElementById("hudChipHeritage");
  const chipHazard = document.getElementById("hudChipHazard");
  const chipBase = document.getElementById("hudChipBaseToggle");
  const baseLabel = document.getElementById("hudBaseLabel");

  const sideSafe = document.getElementById("layerSafeCorridors");
  const sideFood = document.getElementById("layerFood");
  const sideHeritage = document.getElementById("layerHeritage");
  const sideHazard = document.getElementById("layerHazard");

  function updateChipVisuals() {
    if (!map) return;
    const isSafeOn = layers.safeCorridors && map.hasLayer(layers.safeCorridors);
    const isFoodOn = layers.food && map.hasLayer(layers.food);
    const isHeritageOn = layers.heritage && map.hasLayer(layers.heritage);
    const isHazardOn = layers.hazard && map.hasLayer(layers.hazard);

    if (chipSafe) {
      chipSafe.classList.toggle("hud-chip-active-emerald", !!isSafeOn);
      chipSafe.classList.toggle("opacity-60", !isSafeOn);
    }
    if (chipFood) {
      chipFood.classList.toggle("hud-chip-active-amber", !!isFoodOn);
      chipFood.classList.toggle("opacity-60", !isFoodOn);
    }
    if (chipHeritage) {
      chipHeritage.classList.toggle("hud-chip-active-cyan", !!isHeritageOn);
      chipHeritage.classList.toggle("opacity-60", !isHeritageOn);
    }
    if (chipHazard) {
      chipHazard.classList.toggle("hud-chip-active-rose", !!isHazardOn);
      chipHazard.classList.toggle("opacity-60", !isHazardOn);
    }
  }

  if (chipSafe) {
    chipSafe.addEventListener("click", () => {
      if (!map || !layers.safeCorridors) return;
      if (map.hasLayer(layers.safeCorridors)) {
        map.removeLayer(layers.safeCorridors);
        if (sideSafe) sideSafe.checked = false;
        showToast("Safe Corridors hidden from HUD", "info");
      } else {
        map.addLayer(layers.safeCorridors);
        if (sideSafe) sideSafe.checked = true;
        showToast("Safe Corridors enabled (illuminated pathways)", "success");
      }
      updateChipVisuals();
    });
  }

  if (chipFood) {
    chipFood.addEventListener("click", () => {
      if (!map || !layers.food) return;
      if (map.hasLayer(layers.food)) {
        map.removeLayer(layers.food);
        if (sideFood) sideFood.checked = false;
        showToast("Food spots hidden", "info");
      } else {
        map.addLayer(layers.food);
        if (sideFood) sideFood.checked = true;
        showToast("Food & attractions displayed", "success");
      }
      updateChipVisuals();
    });
  }

  if (chipHeritage) {
    chipHeritage.addEventListener("click", () => {
      if (!map || !layers.heritage) return;
      if (map.hasLayer(layers.heritage)) {
        map.removeLayer(layers.heritage);
        if (sideHeritage) sideHeritage.checked = false;
        showToast("Heritage sites hidden", "info");
      } else {
        map.addLayer(layers.heritage);
        if (sideHeritage) sideHeritage.checked = true;
        showToast("Heritage & cultural sites displayed", "success");
      }
      updateChipVisuals();
    });
  }

  if (chipHazard) {
    chipHazard.addEventListener("click", () => {
      if (!map || !layers.hazard) return;
      if (map.hasLayer(layers.hazard)) {
        map.removeLayer(layers.hazard);
        if (sideHazard) sideHazard.checked = false;
        showToast("Hazard blackspots hidden", "info");
      } else {
        map.addLayer(layers.hazard);
        if (sideHazard) sideHazard.checked = true;
        showToast("Hazard blackspots active on HUD", "warning");
      }
      updateChipVisuals();
    });
  }

  // Base map cycle toggle
  const baseOrder = ["satellite", "roadmap", "dark"];
  let baseIdx = 0;
  if (chipBase) {
    chipBase.addEventListener("click", () => {
      baseIdx = (baseIdx + 1) % baseOrder.length;
      const nextKey = baseOrder[baseIdx];
      setBaseMap(nextKey);
      if (baseLabel) {
        baseLabel.textContent = nextKey === "satellite" ? "Satellite" : nextKey === "roadmap" ? "Roads" : "Dark";
      }
    });
  }

  // Sync when sidebar checkboxes are clicked
  [sideSafe, sideFood, sideHeritage, sideHazard].forEach(cb => {
    if (cb) cb.addEventListener("change", () => setTimeout(updateChipVisuals, 50));
  });

  updateChipVisuals();
}

/* -------------------------------------------------------------
 * 17. QUICK SEARCH COMMAND BAR (Ctrl + K / ⌘K)
 * ------------------------------------------------------------- */
function initCommandPalette() {
  const modal = document.getElementById("commandPaletteModal");
  const input = document.getElementById("commandPaletteInput");
  const resultsContainer = document.getElementById("commandPaletteResults");
  const closeBtn = document.getElementById("closeCmdPaletteBtn");
  const navTrigger = document.getElementById("navCommandBarBtn");
  const heroTrigger = document.getElementById("heroOpenCmdBtn");

  if (!modal || !input || !resultsContainer) return;

  let selectedIndex = 0;
  let currentResults = [];

  const quickActions = [
    {
      id: "act-safe",
      type: "action",
      icon: "shield-check",
      iconColor: "text-emerald-400",
      title: "Start SafeWalk Navigation",
      desc: "Plot verified well-lit corridors avoiding dark alleyways & high-risk zones",
      action: () => {
        document.getElementById("navigationSection")?.scrollIntoView({ behavior: "smooth" });
        drawSaferRoute();
      }
    },
    {
      id: "act-sos",
      type: "action",
      icon: "shield-alert",
      iconColor: "text-rose-400",
      title: "Trigger Emergency SOS & Shake Alert",
      desc: "Instant live GPS coordinates beacon, emergency hotlines & audible alert",
      action: () => {
        triggerEmergencySosModal();
      }
    },
    {
      id: "act-ai",
      type: "action",
      icon: "sparkles",
      iconColor: "text-purple-400",
      title: "AI Chaos-to-Calm Itinerary Builder",
      desc: "Generate personalized step-by-step route tailored to your budget & hours",
      action: () => {
        document.getElementById("itinerarySection")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      id: "act-compare",
      type: "action",
      icon: "scale",
      iconColor: "text-amber-400",
      title: "Compare Best vs Worst City Zones",
      desc: "Side-by-side breakdown of safety, cleanliness, and accessibility ratings",
      action: () => {
        document.getElementById("compareSection")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      id: "act-report",
      type: "action",
      icon: "alert-triangle",
      iconColor: "text-orange-500",
      title: "Report City Hazard or Roadblock",
      desc: "Submit crowdsourced incident report with GPS coordinates & voice memo",
      action: () => {
        openHazardReportModal();
      }
    },
    {
      id: "act-satellite",
      type: "action",
      icon: "satellite",
      iconColor: "text-amber-500",
      title: "Switch to Google Satellite View",
      desc: "High-definition satellite imagery with road labels worldwide",
      action: () => {
        setBaseMap("satellite");
      }
    },
    {
      id: "act-theme",
      type: "action",
      icon: "moon",
      iconColor: "text-amber-400",
      title: "Toggle Dark / Light Mode",
      desc: "Switch between Obsidian Dark theme and Crisp Slate Light theme",
      action: () => {
        document.getElementById("themeToggleBtn")?.click();
      }
    }
  ];

  function openCommandPalette() {
    modal.classList.remove("hidden");
    input.value = "";
    selectedIndex = 0;
    renderResults("");
    setTimeout(() => input.focus(), 60);
  }

  function closeCommandPalette() {
    modal.classList.add("hidden");
  }

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (modal.classList.contains("hidden")) {
        openCommandPalette();
      } else {
        closeCommandPalette();
      }
    } else if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeCommandPalette();
    }
  });

  if (navTrigger) navTrigger.addEventListener("click", openCommandPalette);
  if (heroTrigger) heroTrigger.addEventListener("click", openCommandPalette);
  if (closeBtn) closeBtn.addEventListener("click", closeCommandPalette);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeCommandPalette();
  });

  input.addEventListener("input", (e) => {
    selectedIndex = 0;
    renderResults(e.target.value.trim().toLowerCase());
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (currentResults.length > 0) {
        selectedIndex = (selectedIndex + 1) % currentResults.length;
        updateSelectionVisuals();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (currentResults.length > 0) {
        selectedIndex = (selectedIndex - 1 + currentResults.length) % currentResults.length;
        updateSelectionVisuals();
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentResults[selectedIndex]) {
        executeResult(currentResults[selectedIndex]);
      }
    }
  });

  function renderResults(query) {
    let matches = [];

    if (!query) {
      matches = [...quickActions];
      if (typeof GLOBAL_CITIES_PRESETS !== "undefined") {
        GLOBAL_CITIES_PRESETS.slice(0, 5).forEach(c => {
          matches.push({
            id: `city-${c.id}`,
            type: "city",
            icon: "compass",
            iconColor: "text-orange-500",
            title: `Explore ${c.flag} ${c.name}`,
            desc: `Fly to ${c.country} — Safety Score: ${c.safetyScore}/100`,
            cityData: c
          });
        });
      }
    } else {
      quickActions.forEach(act => {
        if (act.title.toLowerCase().includes(query) || act.desc.toLowerCase().includes(query)) {
          matches.push(act);
        }
      });

      if (typeof GLOBAL_CITIES_PRESETS !== "undefined") {
        GLOBAL_CITIES_PRESETS.forEach(c => {
          if (c.name.toLowerCase().includes(query) || c.country.toLowerCase().includes(query)) {
            matches.push({
              id: `city-${c.id}`,
              type: "city",
              icon: "compass",
              iconColor: "text-orange-500",
              title: `Explore ${c.flag} ${c.name}`,
              desc: `${c.country} metropolis &bull; Safety: ${c.safetyScore}/100`,
              cityData: c
            });
          }
        });
      }

      if (typeof POI_DATA !== "undefined") {
        POI_DATA.forEach(poi => {
          if (poi.name.toLowerCase().includes(query) || poi.category.toLowerCase().includes(query) || (poi.tags && poi.tags.some(t => t.toLowerCase().includes(query)))) {
            const isHazard = poi.category === "hazard";
            const isFood = poi.category === "food";
            matches.push({
              id: `poi-${poi.id}`,
              type: "poi",
              icon: isHazard ? "alert-octagon" : isFood ? "utensils" : "landmark",
              iconColor: isHazard ? "text-rose-500" : isFood ? "text-amber-500" : "text-orange-500",
              title: poi.name,
              desc: `${poi.categoryLabel || poi.category.toUpperCase()} &bull; Safety: ${poi.safetyScore}/100`,
              poiData: poi
            });
          }
        });
      }
    }

    currentResults = matches.slice(0, 8);

    if (currentResults.length === 0) {
      resultsContainer.innerHTML = `
        <div class="py-8 text-center text-slate-500 text-xs">
          <p>No matching commands or spots found for "<span class="text-slate-900 font-semibold">${query}</span>"</p>
          <p class="text-[11px] text-slate-400 mt-1">Try searching "Tokyo", "SafeWalk", "Heritage", "SOS", or "Roadmap"</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = currentResults.map((item, index) => {
      const isSelected = index === selectedIndex;
      return `
        <div class="cmd-item p-2.5 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all border border-transparent ${isSelected ? 'cmd-item-selected' : 'hover:bg-slate-50'}" data-index="${index}">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/90 flex items-center justify-center shrink-0 ${item.iconColor}">
              <i data-lucide="${item.icon}" class="w-4 h-4"></i>
            </div>
            <div>
              <div class="text-xs sm:text-sm font-semibold text-slate-900">${item.title}</div>
              <div class="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md">${item.desc}</div>
            </div>
          </div>
          <span class="text-[10px] text-slate-500 hidden sm:inline-block font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0">
            ${item.type.toUpperCase()}
          </span>
        </div>
      `;
    }).join("");

    lucide.createIcons();

    const rows = resultsContainer.querySelectorAll(".cmd-item");
    rows.forEach(r => {
      r.addEventListener("click", () => {
        const idx = parseInt(r.getAttribute("data-index"), 10);
        if (currentResults[idx]) {
          executeResult(currentResults[idx]);
        }
      });
    });
  }

  function updateSelectionVisuals() {
    const rows = resultsContainer.querySelectorAll(".cmd-item");
    rows.forEach((r, idx) => {
      r.classList.toggle("cmd-item-selected", idx === selectedIndex);
    });
  }

  function executeResult(item) {
    closeCommandPalette();
    if (item.type === "action" && typeof item.action === "function") {
      item.action();
    } else if (item.type === "city" && item.cityData) {
      switchGlobalCity(item.cityData);
      document.getElementById("mapSection")?.scrollIntoView({ behavior: "smooth" });
    } else if (item.type === "poi" && item.poiData) {
      focusOnPoi(item.poiData.id);
      document.getElementById("mapSection")?.scrollIntoView({ behavior: "smooth" });
    }
  }
}


