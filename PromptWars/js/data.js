/**
 * UrbanWay Seed Data & Worldwide Geospatial Engine
 * Realistic geospatial, safety, hospitality, and civic telemetry across all continents
 */

const CITY_CENTER = [28.6139, 77.2090]; // Delhi/NCR Metro coordinates or representative global metro

const POI_DATA = [
  // FOOD & ATTRACTIONS
  {
    id: "food-1",
    name: "Neon Alley Night Market & Sizzle Stalls",
    category: "food",
    categoryLabel: "Street Food & Nightlife",
    lat: 28.6255,
    lng: 77.2185,
    address: "Lane 4, Sector 7 Food Corridor",
    image: "assets/images/food.jpg",
    rating: 4.8,
    reviewsCount: 1420,
    priceLevel: "$",
    priceLabel: "Budget ($1-$4 / meal)",
    safetyScore: 88,
    cleanlinessScore: 82,
    timings: "5:00 PM - 2:30 AM",
    description: "Famous for sizzling pad thai, momos, skewers, and boba teas. Heavily crowded with students and night foodies. Well-lit central lane with private security marshal.",
    tags: ["Street Food", "Late Night", "Budget", "High Footfall", "Student Favorite"],
    crowdDensity: "High",
    isRecommended: true
  },
  {
    id: "food-2",
    name: "Spice Symphony Heritage Dhaba",
    category: "food",
    categoryLabel: "Iconic Traditional Eats",
    lat: 28.6340,
    lng: 77.2250,
    address: "Old Bazaar Gate 2",
    image: "assets/images/food.jpg",
    rating: 4.7,
    reviewsCount: 980,
    priceLevel: "$$",
    priceLabel: "Moderate ($4-$10)",
    safetyScore: 84,
    cleanlinessScore: 86,
    timings: "11:00 AM - 11:30 PM",
    description: "Centuries-old family recipes, butter naan, slow-cooked dal, and saffron chai. Bustling alley with friendly shopkeepers.",
    tags: ["Authentic", "Vegetarian Friendly", "Family Run"],
    crowdDensity: "Moderate",
    isRecommended: true
  },
  {
    id: "food-3",
    name: "Skyline Rooftop Bistro & Lounge",
    category: "food",
    categoryLabel: "Casual Dining & View",
    lat: 28.6080,
    lng: 77.2280,
    address: "Cyber Tower 9, Tech Corridor",
    image: "assets/images/hero.jpg",
    rating: 4.6,
    reviewsCount: 640,
    priceLevel: "$$$",
    priceLabel: "Upscale ($15-$30)",
    safetyScore: 96,
    cleanlinessScore: 95,
    timings: "12:00 PM - 1:00 AM",
    description: "Panoramic view of city lights and monorail tracks. High surveillance area, valet parking, and strictly monitored access.",
    tags: ["Rooftop", "Cocktails", "Safe at Night", "City Views"],
    crowdDensity: "Moderate",
    isRecommended: false
  },
  {
    id: "food-4",
    name: "The Corner Baker & Artisanal Roastery",
    category: "food",
    categoryLabel: "Cafe & Co-working",
    lat: 28.6180,
    lng: 77.1980,
    address: "Greenwood Avenue, Sector 3",
    image: "assets/images/transit.jpg",
    rating: 4.9,
    reviewsCount: 512,
    priceLevel: "$$",
    priceLabel: "Budget-Friendly Cafe",
    safetyScore: 92,
    cleanlinessScore: 94,
    timings: "7:30 AM - 10:00 PM",
    description: "Specialty pourover coffee, organic sourdough, and quiet work tables with gigabit Wi-Fi. Located in a leafy, well-patrolled street.",
    tags: ["Coffee", "Work-friendly", "Outdoor Seating", "Solar Lit"],
    crowdDensity: "Low",
    isRecommended: true
  },

  // HISTORICAL & HERITAGE SITES
  {
    id: "heritage-1",
    name: "Royal Fortress & Grand Citadel",
    category: "heritage",
    categoryLabel: "UNESCO Heritage Landmark",
    lat: 28.6410,
    lng: 77.2380,
    address: "Citadel Hilltop Rd, Old Capital",
    image: "assets/images/heritage.jpg",
    rating: 4.9,
    reviewsCount: 3890,
    priceLevel: "$",
    priceLabel: "Entry Fee $2 (Students $1)",
    safetyScore: 91,
    cleanlinessScore: 89,
    timings: "9:00 AM - 9:00 PM (Light & Sound Show at 7:30 PM)",
    description: "Built in 1648, featuring massive sandstone ramparts, carved archways, and luminous evening lantern displays. Audio guides and tourist police booth at the main gate.",
    tags: ["Architecture", "History", "Photography", "Tourist Police", "Audio Tour"],
    historicalEra: "17th Century Mughal-Rajput Splendor",
    crowdDensity: "High",
    isRecommended: true
  },
  {
    id: "heritage-2",
    name: "Ancient Observatory & Stepwell (Baoli)",
    category: "heritage",
    categoryLabel: "Architectural Wonder",
    lat: 28.6145,
    lng: 77.2140,
    address: "Heritage Lane, South Quarter",
    image: "assets/images/heritage.jpg",
    rating: 4.7,
    reviewsCount: 1220,
    priceLevel: "Free",
    priceLabel: "Free Public Access",
    safetyScore: 85,
    cleanlinessScore: 80,
    timings: "6:00 AM - 6:30 PM",
    description: "A 14-level subterranean stepwell designed for natural cooling and rainwater harvesting. Fascinating acoustics and geometric arches.",
    tags: ["Heritage", "Hidden Gem", "Geometry", "Historical Engineering"],
    historicalEra: "14th Century Medieval Engineering",
    crowdDensity: "Moderate",
    isRecommended: true
  },
  {
    id: "heritage-3",
    name: "Old Bell Tower & Colonial Square",
    category: "heritage",
    categoryLabel: "Cultural Square",
    lat: 28.6300,
    lng: 77.2060,
    address: "Clocktower Roundabout, Central Ward",
    image: "assets/images/transit.jpg",
    rating: 4.5,
    reviewsCount: 750,
    priceLevel: "Free",
    priceLabel: "Free Public Landmark",
    safetyScore: 78,
    cleanlinessScore: 74,
    timings: "Open 24/7",
    description: "Victorian gothic clock tower standing in the central traffic circle. Surrounded by antique booksellers and street musicians during evenings.",
    tags: ["Landmark", "Vintage", "Walking Tour", "Public Square"],
    historicalEra: "Late 19th Century",
    crowdDensity: "Moderate",
    isRecommended: false
  },

  // UNSAFE & ACCIDENT ZONES (CAUTION)
  {
    id: "hazard-1",
    name: "Old Canal Underpass (Dimly Lit / Isolated)",
    category: "hazard",
    categoryLabel: "High Caution Area",
    lat: 28.6210,
    lng: 77.2020,
    address: "Underpass Link towards Railway Yard",
    image: null,
    riskLevel: "High",
    riskSeverity: 88, // 0 = safe, 100 = very dangerous
    safetyScore: 32,
    cleanlinessScore: 38,
    reportedIssues: ["Non-functional streetlights (6 broken)", "Snatching incidents reported after 9 PM", "Blind turn accident hotspot"],
    lastReported: "32 mins ago by Citizen Patrol",
    cautionTip: "Avoid solo walking after 8:30 PM. Use the illuminated Main Boulevard overhead crossing instead.",
    tags: ["Poor Lighting", "Crime Alert", "Accident Hotspot", "Avoid Night Walk"]
  },
  {
    id: "hazard-2",
    name: "Industrial Bypass Interchange Junction",
    category: "hazard",
    categoryLabel: "Accident-Prone Zone",
    lat: 28.6010,
    lng: 77.2150,
    address: "Ring Road Expressway Exit 4",
    image: null,
    riskLevel: "Critical",
    riskSeverity: 85,
    safetyScore: 41,
    cleanlinessScore: 45,
    reportedIssues: ["Heavy truck blind spots", "High frequency of two-wheeler skid accidents", "Waterlogging during rain"],
    lastReported: "1 hour ago by Traffic Police AI Feed",
    cautionTip: "Strict speed limit 40 km/h. Pedestrians must use the Smart Walkway footbridge 200m north.",
    tags: ["Traffic Blackspot", "Heavy Vehicles", "Waterlogging Risk"]
  },
  {
    id: "hazard-3",
    name: "Warehouse Depot Alleyway",
    category: "hazard",
    categoryLabel: "Moderate Caution",
    lat: 28.6360,
    lng: 77.2110,
    address: "Rear Lane behind Freight Terminals",
    image: null,
    riskLevel: "Medium",
    riskSeverity: 68,
    safetyScore: 49,
    cleanlinessScore: 42,
    reportedIssues: ["Zero CCTV coverage", "Pothole filled gravel path", "Deserted after sunset"],
    lastReported: "3 hours ago by Local Resident",
    cautionTip: "Take the bus route #42 via Clocktower instead of walking through this alley.",
    tags: ["No CCTV", "Deserted", "Potholes"]
  },
  {
    id: "hazard-4",
    name: "Riverbank Marsh Overflow Zone",
    category: "hazard",
    categoryLabel: "Environmental & Slipping Hazard",
    lat: 28.6470,
    lng: 77.2280,
    address: "East Embankment Walkway",
    image: null,
    riskLevel: "Medium",
    riskSeverity: 62,
    safetyScore: 54,
    cleanlinessScore: 50,
    reportedIssues: ["Flash flood waterlogging alert", "Slippery algae on stone steps", "No guardrail on outer pier"],
    lastReported: "45 mins ago by City Disaster Mgmt",
    cautionTip: "Embankment access restricted during night hours or rain advisory.",
    tags: ["Waterlogging", "Slippery", "Low Guardrails"]
  }
];

// Well-lit safe corridors & emergency sanctuaries
const SAFE_CORRIDORS = [
  {
    id: "safe-corridor-1",
    name: "Smart Transit Boulevard & Illuminated Greenway",
    type: "corridor",
    coordinates: [
      [28.6139, 77.2090],
      [28.6180, 77.2140],
      [28.6225, 77.2160],
      [28.6255, 77.2185]
    ],
    features: ["100% Smart LED Poles", "Emergency SOS Pillars every 150m", "CCTV AI Sentinel Active", "24/7 Police Patrols"]
  }
];

// PRE-COMPUTED NAVIGATION ROUTES
const NAVIGATION_ROUTES = {
  options: [
    {
      id: "route-metro-to-food",
      name: "Metro Central Hub ➔ Neon Alley Night Market",
      origin: { name: "Metro Central Hub", coords: [28.6139, 77.2090] },
      destination: { name: "Neon Alley Night Market", coords: [28.6255, 77.2185] },
      fastest: {
        distanceKm: "1.6 km",
        walkTimeMin: "15 min",
        safetyScore: 56,
        safetyGrade: "Moderate-Low Caution",
        dangerColor: "#f43f5e",
        pathCoordinates: [
          [28.6139, 77.2090],
          [28.6175, 77.2070],
          [28.6210, 77.2020], // crosses Old Canal Hazard
          [28.6235, 77.2100],
          [28.6255, 77.2185]
        ],
        warnings: [
          "Crosses Old Canal Underpass (Unlit alley with recent theft reports)",
          "Low pedestrian footfall between 8:00 PM and 1:00 AM",
          "Zero emergency response booths on this path"
        ],
        lightingScore: "42%",
        cctvCoverage: "25%",
        crowdFactor: "Low (Deserted stretches)"
      },
      safer: {
        distanceKm: "2.1 km",
        walkTimeMin: "19 min",
        safetyScore: 94,
        safetyGrade: "Highly Safe & Recommended",
        safetyColor: "#10b981",
        pathCoordinates: [
          [28.6139, 77.2090],
          [28.6180, 77.2140], // Smart boulevard
          [28.6225, 77.2160], // Well-lit avenue
          [28.6250, 77.2175], // Main illuminated market gate
          [28.6255, 77.2185]
        ],
        perks: [
          "Follows Smart Transit Boulevard with solar LED streetlights",
          "Passes 2 Active 24/7 Police Assistance Kiosks & SOS buttons",
          "High pedestrian density and open retail shops till 2 AM",
          "98% CCTV network coverage along route"
        ],
        lightingScore: "98%",
        cctvCoverage: "92%",
        crowdFactor: "High & Vibrant"
      }
    },
    {
      id: "route-bazaar-to-fort",
      name: "Old Bazaar Gate ➔ Royal Fortress Citadel",
      origin: { name: "Old Bazaar Gate", coords: [28.6340, 77.2250] },
      destination: { name: "Royal Fortress Citadel", coords: [28.6410, 77.2380] },
      fastest: {
        distanceKm: "1.2 km",
        walkTimeMin: "12 min",
        safetyScore: 61,
        safetyGrade: "Moderate Caution",
        dangerColor: "#f59e0b",
        pathCoordinates: [
          [28.6340, 77.2250],
          [28.6360, 77.2290],
          [28.6380, 77.2320],
          [28.6410, 77.2380]
        ],
        warnings: [
          "Narrow blind corners with heavy e-rickshaw speeding",
          "Intermittent sidewalk blockages due to construction debris"
        ],
        lightingScore: "60%",
        cctvCoverage: "45%",
        crowdFactor: "Moderate"
      },
      safer: {
        distanceKm: "1.5 km",
        walkTimeMin: "15 min",
        safetyScore: 91,
        safetyGrade: "High Safety",
        safetyColor: "#10b981",
        pathCoordinates: [
          [28.6340, 77.2250],
          [28.6350, 77.2310],
          [28.6390, 77.2350],
          [28.6410, 77.2380]
        ],
        perks: [
          "Heritage tourist corridor with dedicated brick walkways",
          "Tourism safety patrol active every 15 minutes",
          "Continuous ambient floodlights illuminating footpaths"
        ],
        lightingScore: "95%",
        cctvCoverage: "88%",
        crowdFactor: "High"
      }
    },
    {
      id: "route-safewalk-exclusive",
      name: "🛡️ SafeWalk Companion: 100% Restricted to High-Security Lit Zones",
      origin: { name: "University Green Concourse", coords: [28.6180, 77.1980] },
      destination: { name: "Cyber Core Metro Terminal", coords: [28.6080, 77.2280] },
      fastest: {
        distanceKm: "1.9 km",
        walkTimeMin: "18 min",
        safetyScore: 52,
        safetyGrade: "Hazard Exposure Warning",
        dangerColor: "#f43f5e",
        pathCoordinates: [
          [28.6180, 77.1980],
          [28.6210, 77.2020], // Old canal dark cut
          [28.6140, 77.2150],
          [28.6080, 77.2280]
        ],
        warnings: [
          "Bypasses through unlit canal alley with 4 reported streetlight blackouts",
          "Includes 400m blind truck corridor with poor pedestrian sidewalks",
          "High risk for solo travelers after dusk"
        ],
        lightingScore: "38%",
        cctvCoverage: "20%",
        crowdFactor: "Isolated / Deserted"
      },
      safer: {
        distanceKm: "2.6 km",
        walkTimeMin: "23 min",
        safetyScore: 98,
        safetyGrade: "100% SafeWalk Companion Certified",
        safetyColor: "#10b981",
        pathCoordinates: [
          [28.6180, 77.1980],
          [28.6139, 77.2090], // Metro Central Hub
          [28.6180, 77.2140], // Smart Boulevard
          [28.6145, 77.2210], // Monorail Greenway
          [28.6080, 77.2280]  // Cyber Core
        ],
        perks: [
          "Restricted 100% to verified Grade-A illuminated smart avenues",
          "Passes 3 active Emergency SOS posts and 2 Police Sentinel booths",
          "Zero traversal through flagged caution or accident blackspots",
          "Continuous AI-monitored CCTV vision and live pedestrian density"
        ],
        lightingScore: "100%",
        cctvCoverage: "96%",
        crowdFactor: "High Density & Vibrant Retail"
      }
    }
  ]
};

// BEST VS WORST PLACES COMPARISON MATRIX DATA
const NEIGHBORHOOD_DATA = [
  {
    id: "tech-cyber-hub",
    name: "Cyber Core & Smart Transit District",
    badge: "Best Overall Infrastructure",
    isBest: true,
    safetyScore: 96,
    cleanlinessScore: 94,
    affordabilityScore: 52, // $$$-$$$$
    affordabilityLabel: "Expensive / Premium",
    rating: 4.8,
    walkabilityScore: 92,
    transitConnectivity: "Excellent (3 Metro Lines, e-Buses)",
    crimeRateLevel: "Very Low (0.4/1000)",
    lightingQuality: "Smart Adaptive LED (99%)",
    airQualityIndex: 58,
    aqiLabel: "Moderate / Filtered Corridors",
    pros: [
      "24/7 AI-monitored street cams and emergency SOS posts",
      "Wide barrier-free sidewalks with tactile paving",
      "Pristine cleanliness and automated nightly vacuum sweepers"
    ],
    cons: [
      "High dining and parking costs",
      "Less authentic street food, mostly corporate chains"
    ],
    bestTimeToVisit: "Evening (6:00 PM - 11:00 PM) for city lights",
    verdict: "Top choice for solo women, night commuters, and tech workers."
  },
  {
    id: "historic-citadel-quarter",
    name: "Historic Citadel & Old Bazaar Ward",
    badge: "Best Cultural & Culinary Vibe",
    isBest: true,
    safetyScore: 82,
    cleanlinessScore: 68,
    affordabilityScore: 95, // $
    affordabilityLabel: "Super Budget Friendly",
    rating: 4.7,
    walkabilityScore: 78,
    transitConnectivity: "Good (Metro Gate 1 + Rickshaws)",
    crimeRateLevel: "Low-Medium (Pickpocket alert in crowds)",
    lightingQuality: "Warm Heritage Lights (75%)",
    airQualityIndex: 110,
    aqiLabel: "Unhealthy for Sensitive Groups",
    pros: [
      "Unmatched historical architecture and cultural soul",
      "Incredible $1-$3 authentic dishes and craft stalls",
      "Lively, bustling community where shopkeepers watch out for guests"
    ],
    cons: [
      "Congested lanes during peak hours, difficult for cars",
      "Litter in side alleys; requires improved civic waste bins"
    ],
    bestTimeToVisit: "Morning 8:00 AM or Dusk 5:30 PM",
    verdict: "Unbeatable for budget explorers, foodies, and heritage enthusiasts."
  },
  {
    id: "greenwood-garden-suburb",
    name: "Greenwood Lake & University Enclave",
    badge: "Best Cleanliness & Green Space",
    isBest: true,
    safetyScore: 89,
    cleanlinessScore: 91,
    affordabilityScore: 82, // $-$$
    affordabilityLabel: "Student Budget Friendly",
    rating: 4.6,
    walkabilityScore: 88,
    transitConnectivity: "Moderate (Bus Routes, Bike Corridors)",
    crimeRateLevel: "Low (1.1/1000)",
    lightingQuality: "Good Residential Lighting (84%)",
    airQualityIndex: 42,
    aqiLabel: "Good (Green Tree Canopy)",
    pros: [
      "Fresh air, cycling tracks, and lush waterfront parks",
      "Affordable cafes, libraries, and student bookshops",
      "Calm, non-chaotic atmosphere"
    ],
    cons: [
      "Fewer public transit options late after 11:30 PM",
      "Certain park corners become poorly lit past 10 PM"
    ],
    bestTimeToVisit: "Afternoons and Sunset picnics",
    verdict: "Ideal for tranquil exploration, jogging, and working remotely."
  },
  {
    id: "old-canal-industrial",
    name: "Old Canal & Freight Warehouse Strip",
    badge: "Worst for Night Exploration (High Caution)",
    isBest: false,
    safetyScore: 34,
    cleanlinessScore: 32,
    affordabilityScore: 88, // Cheap but unsafe
    affordabilityLabel: "Low Cost (Industrial)",
    rating: 2.3,
    walkabilityScore: 36,
    transitConnectivity: "Poor (Occasional freight buses)",
    crimeRateLevel: "High (Reported theft & harassment after dark)",
    lightingQuality: "Severely Broken / Dim (22%)",
    airQualityIndex: 148,
    aqiLabel: "Poor (Dust & Diesel Fumes)",
    pros: [
      "Wholesale repair shops and scrap markets for engineers"
    ],
    cons: [
      "65% of streetlights dysfunctional or vandalized",
      "Lack of sidewalks; open ditches and heavy truck blind spots",
      "Zero night police patrolling"
    ],
    bestTimeToVisit: "Daytime only (10:00 AM - 4:00 PM) with caution",
    verdict: "Avoid for solo travelers, women, and night exploration. City civic intervention requested."
  },
  {
    id: "transit-interchange-outer",
    name: "Intercity Bus Depot Outer Ring",
    badge: "Worst for Cleanliness & Pedestrian Safety",
    isBest: false,
    safetyScore: 48,
    cleanlinessScore: 38,
    affordabilityScore: 75,
    affordabilityLabel: "Inexpensive Fast Food",
    rating: 2.8,
    walkabilityScore: 45,
    transitConnectivity: "High Volume, Chaotic",
    crimeRateLevel: "Medium-High (Touts, luggage theft)",
    lightingQuality: "Uneven (52%)",
    airQualityIndex: 165,
    aqiLabel: "Very Poor (Exhaust & Smog)",
    pros: [
      "24/7 interstate transit buses departing continuously",
      "Cheap 24/7 tea stalls and quick snacks"
    ],
    cons: [
      "Heavy traffic gridlocks, aggressive vehicle horns",
      "Persistent garbage accumulation near terminals",
      "Aggressive unregistered touts and cab solicitors"
    ],
    bestTimeToVisit: "Only when boarding pre-booked long distance travel",
    verdict: "Functional for transit, but stressful for leisure and city discovery."
  }
];

// SMART CITY LIVE FEED DATA (Simulated real-time civic & sensor feeds)
const INITIAL_SMART_FEED = [
  {
    id: "feed-1",
    type: "citizen",
    category: "Safety Hazard",
    title: "Broken Streetlamp Cluster - Canal Link",
    location: "Old Canal Underpass, Pillar 14",
    coords: [28.6210, 77.2020],
    timestamp: "12 mins ago",
    author: "Priya S. (Verified Citizen)",
    urgency: "High",
    urgencyColor: "red",
    description: "4 consecutive solar streetlamps are completely dead. Entire 100m corridor pitch dark. Please take Main Boulevard instead!",
    votes: 42,
    hasVoted: false,
    status: "Forwarded to Municipal Electrical Wing",
    hasMedia: true,
    mediaNote: "📷 Attached 1 photo of dark walkway"
  },
  {
    id: "feed-2",
    type: "traffic",
    category: "Traffic Gridlock",
    title: "Metro Feeder Bus Breakdown causing 25m delay",
    location: "Ring Road Interchange Gate 3",
    coords: [28.6010, 77.2150],
    timestamp: "24 mins ago",
    author: "City Traffic AI Sentinel",
    urgency: "Moderate",
    urgencyColor: "amber",
    description: "Expressway exit restricted to 1 lane due to overheated bus. Tow crane arriving in 10 minutes. Reroute via Avenue 8.",
    votes: 29,
    hasVoted: false,
    status: "Traffic Marshall on site",
    hasMedia: false
  },
  {
    id: "feed-3",
    type: "weather",
    category: "Weather Alert",
    title: "Sudden Thunderstorm & Squall Warning (35 km/h)",
    location: "Metro Wide / Riverbank Zone",
    coords: [28.6470, 77.2280],
    timestamp: "38 mins ago",
    author: "Meteorological Sensor Station #4",
    urgency: "Caution",
    urgencyColor: "amber",
    description: "Sudden cloudburst expected between 11:15 PM and 12:45 AM. Low-lying waterlogging expected on Embankment Walkway.",
    votes: 68,
    hasVoted: false,
    status: "Advisory active for next 3 hours",
    hasMedia: false
  },
  {
    id: "feed-4",
    type: "citizen",
    category: "Civic Improvement",
    title: "Deep Pothole Filled with Water near Fort Gate",
    location: "Citadel West Rampart Approach",
    coords: [28.6380, 77.2340],
    timestamp: "1 hour ago",
    author: "Rohan V. (Daily Cyclist)",
    urgency: "Medium",
    urgencyColor: "amber",
    description: "Hazardous pothole hidden under puddle. Two scooterists stumbled. Citizens placed a wooden branch with caution tape as a warning.",
    votes: 53,
    hasVoted: false,
    status: "Road maintenance ticket #8841 generated",
    hasMedia: true,
    mediaNote: "📷 Attached 1 photo of caution marker"
  },
  {
    id: "feed-5",
    type: "citizen",
    category: "Positive Vibe / Culture",
    title: "Spontaneous Sufi Qawwali Performance",
    location: "Royal Fortress Courtyard 2",
    coords: [28.6410, 77.2380],
    timestamp: "1.5 hours ago",
    author: "Amina K. (Heritage Explorer)",
    urgency: "Low",
    urgencyColor: "emerald",
    description: "Mesmerizing acoustic musical performance under illuminated arches! Very safe and magical crowd, entry is free.",
    votes: 114,
    hasVoted: false,
    status: "Happening now (Estimated till 10:30 PM)",
    hasMedia: true,
    mediaNote: "🎵 Audio & photo snippet verified"
  }
];

// LIVE CITY SENSOR METRICS
const CITY_METRICS = {
  cityName: "Neo-Capital Metro",
  temperature: "24°C",
  weatherCondition: "Clear with Evening Breeze",
  airQualityIndex: 68,
  aqiStatus: "Moderate",
  trafficCongestion: "28% (Flowing Smoothly)",
  safetyIndexOverall: "86/100",
  activePolicePatrols: 14,
  activeCitizenWatchers: 342,
  reportedHazardsToday: 9,
  resolvedIssuesToday: 6
};

// CITY ZONES GEOSPATIAL POLYGONS (For Visual Heatmap Overlays)
const CITY_ZONES_HEATMAP = [
  {
    id: "zone-cyber-core",
    name: "Cyber Core & Smart Transit District",
    polygon: [
      [28.6180, 77.2180],
      [28.6250, 77.2280],
      [28.6160, 77.2340],
      [28.6080, 77.2250]
    ],
    metrics: {
      safety: 96,
      cleanliness: 94,
      affordability: 52,
      accessibility: 95
    },
    status: "Safest & Pristine",
    dominantVibe: "High-tech, solar LED illuminated, active patrols"
  },
  {
    id: "zone-greenwood",
    name: "Greenwood Lake & University Enclave",
    polygon: [
      [28.6100, 77.1920],
      [28.6220, 77.1950],
      [28.6210, 77.2060],
      [28.6110, 77.2040]
    ],
    metrics: {
      safety: 89,
      cleanliness: 91,
      affordability: 82,
      accessibility: 84
    },
    status: "Tranquil & Green",
    dominantVibe: "Student friendly, scenic waterways, tree canopy"
  },
  {
    id: "zone-historic-citadel",
    name: "Historic Citadel & Old Bazaar Ward",
    polygon: [
      [28.6320, 77.2200],
      [28.6460, 77.2280],
      [28.6430, 77.2420],
      [28.6280, 77.2350]
    ],
    metrics: {
      safety: 82,
      cleanliness: 68,
      affordability: 95,
      accessibility: 78
    },
    status: "High Culture & Street Food",
    dominantVibe: "Crowded bustling markets, heritage arches, low prices"
  },
  {
    id: "zone-transit-outer",
    name: "Intercity Bus Depot Outer Ring",
    polygon: [
      [28.5950, 77.2050],
      [28.6060, 77.2120],
      [28.6020, 77.2260],
      [28.5920, 77.2180]
    ],
    metrics: {
      safety: 48,
      cleanliness: 38,
      affordability: 75,
      accessibility: 65
    },
    status: "Congested & Noisy",
    dominantVibe: "High vehicle exhaust, chaotic bus terminals"
  },
  {
    id: "zone-old-canal",
    name: "Old Canal & Freight Warehouse Strip",
    polygon: [
      [28.6220, 77.1980],
      [28.6360, 77.2020],
      [28.6340, 77.2140],
      [28.6200, 77.2080]
    ],
    metrics: {
      safety: 34,
      cleanliness: 32,
      affordability: 88,
      accessibility: 36
    },
    status: "High Caution / Night Risk",
    dominantVibe: "Broken streetlights, blind turns, deserted lanes"
  }
];

// HIDDEN GEMS RADAR DATA
const HIDDEN_GEMS = [
  {
    id: "gem-1",
    name: "The Subterranean Water Pavilion & Acoustic Arches",
    category: "Heritage Secret",
    distanceMeters: 380,
    walkTime: "5 min walk",
    cost: "Free Admission",
    safetyScore: 92,
    lat: 28.6160,
    lng: 77.2120,
    vibe: "Natural cooling chambers built in 1380 with whispering acoustics",
    tip: "Bring a sketchbook; best visited between 4:00 PM and 6:30 PM",
    badge: "Architectural Wonder"
  },
  {
    id: "gem-2",
    name: "Midnight Saffron Milk & Cardamom Chai Cauldron",
    category: "Culinary Secret",
    distanceMeters: 520,
    walkTime: "7 min walk",
    cost: "$1.20 / cup",
    safetyScore: 89,
    lat: 28.6280,
    lng: 77.2210,
    vibe: "Boiled in a 40-liter brass pot over gentle wood embers with roasted pistachios",
    tip: "Open until 3:00 AM; always crowded with local musicians",
    badge: "Local Legend"
  },
  {
    id: "gem-3",
    name: "Solar Rooftop Conservatory & Quiet Reading Nook",
    category: "Calm Haven",
    distanceMeters: 740,
    walkTime: "9 min walk",
    cost: "$2-$4 Coffee",
    safetyScore: 97,
    lat: 28.6195,
    lng: 77.2240,
    vibe: "Over 800 tropical plants inside a double-glazed soundproof glass dome",
    tip: "Free high-speed solar Wi-Fi and safe solo seating pods",
    badge: "Chaos-to-Calm Sanctuary"
  },
  {
    id: "gem-4",
    name: "Antique Lithograph & Cartography Archive Lane",
    category: "Cultural Gem",
    distanceMeters: 890,
    walkTime: "11 min walk",
    cost: "Free Browsing",
    safetyScore: 91,
    lat: 28.6365,
    lng: 77.2290,
    vibe: "Old map prints from 1850s and vintage brass compasses tucked in a stone alley",
    tip: "Friendly multi-generational keepers love explaining city lore",
    badge: "Living History"
  }
];

// EXPLORER GAMIFICATION BADGES
const EXPLORER_BADGES = [
  {
    id: "badge-heritage",
    title: "Heritage Buff",
    icon: "landmark",
    color: "indigo",
    level: "Level 2 Explorer",
    progress: 75,
    points: 350,
    isUnlocked: true,
    description: "Visited 3 ancient citadels & verified 1 historical stepwell."
  },
  {
    id: "badge-foodie",
    title: "Street Food Legend",
    icon: "utensils",
    color: "amber",
    level: "Master Foodie",
    progress: 100,
    points: 500,
    isUnlocked: true,
    description: "Sampled authentic night market stalls and reviewed street hygiene."
  },
  {
    id: "badge-safepath",
    title: "Night Owl Navigator",
    icon: "shield-check",
    color: "emerald",
    level: "Elite Scout",
    progress: 90,
    points: 420,
    isUnlocked: true,
    description: "Completed 5.2 km exclusively on verified illuminated Safe Corridors."
  },
  {
    id: "badge-sentinel",
    title: "Safety Sentinel",
    icon: "radio",
    color: "rose",
    level: "Civic Guardian",
    progress: 60,
    points: 280,
    isUnlocked: false,
    description: "Upvoted & verified 3 citizen hazard reports in real-time."
  },
  {
    id: "badge-cartographer",
    title: "Urban Cartographer",
    icon: "compass",
    color: "cyan",
    level: "Pathfinder",
    progress: 80,
    points: 390,
    isUnlocked: false,
    description: "Toggled all 4 city heatmap layers and inspected 5 secret gems."
  }
];

// EMERGENCY SERVICES & LIVE GPS SIMULATION
const EMERGENCY_SERVICES = {
  currentSimulatedGps: {
    lat: 28.6225,
    lng: 77.2160,
    address: "Smart Transit Boulevard, Pillar SOS-04",
    accuracy: "±4 meters (Differential GPS)",
    sector: "Cyber Core Sector 4"
  },
  contacts: [
    {
      name: "Emergency Police Dispatch",
      number: "112",
      badge: "Direct Line",
      icon: "shield-alert",
      color: "rose",
      desc: "Immediate patrol unit dispatch (Avg response: 3.5 mins)"
    },
    {
      name: "Women Safety SOS Helpline",
      number: "1091",
      badge: "24/7 Dedicated",
      icon: "heart-handshake",
      color: "pink",
      desc: "Specialized rapid response team & safe transport escort"
    },
    {
      name: "Medical Trauma & Ambulance",
      number: "108",
      badge: "Emergency Medical",
      icon: "ambulance",
      color: "emerald",
      desc: "Nearest ICU ambulance stationed at Metro Central (400m)"
    },
    {
      name: "Smart Transit Patrol Sentinel",
      number: "1512",
      badge: "Metro Security",
      icon: "train",
      color: "cyan",
      desc: "Rapid response guards stationed at all illuminated stations"
    }
  ],
  nearestSafeSanctuary: {
    name: "Sector 7 Police Assistance & SOS Kiosk",
    distanceMeters: 140,
    walkTime: "90 seconds",
    status: "Active & Manned 24/7",
    facilities: ["First Aid", "CCTV Monitoring Room", "Emergency Phone", "Distress Beacon"]
  }
};

// =============================================================
// WORLDWIDE GLOBAL CITIES CATALOG & GEOSPATIAL INTELLIGENCE
// =============================================================
const GLOBAL_CITIES_PRESETS = [
  {
    id: "delhi",
    name: "Delhi NCR",
    country: "India",
    flag: "🇮🇳",
    lat: 28.6220,
    lng: 77.2180,
    zoom: 14,
    safetyScore: 86,
    cleanlinessScore: 81,
    walkabilityScore: 84,
    aqi: 68,
    temp: "24°C",
    vibe: "Ancient Mughal monuments, bustling street food bazaars & modern transit corridors",
    pois: POI_DATA,
    safeCorridors: SAFE_CORRIDORS,
    zones: CITY_ZONES_HEATMAP
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    lat: 35.6762,
    lng: 139.6503,
    zoom: 14,
    safetyScore: 98,
    cleanlinessScore: 99,
    walkabilityScore: 97,
    aqi: 22,
    temp: "19°C",
    vibe: "Ultra-safe neon megalopolis, historic Asakusa shrines & Michelin ramen stalls",
    pois: [
      {
        id: "tokyo-food-1",
        name: "Shinjuku Omoide Yokocho (Memory Lane)",
        category: "food",
        categoryLabel: "Yakitori & Sake Stalls",
        lat: 35.6938,
        lng: 139.6998,
        address: "1-2 Nishishinjuku, Shinjuku City",
        rating: 4.8,
        priceLabel: "Budget ($3 - $6)",
        safetyScore: 96,
        cleanlinessScore: 94,
        timings: "4:00 PM - 2:00 AM",
        description: "Post-war lantern-lit alley with sizzling chicken skewers, tsukune, and local hospitality.",
        tags: ["Late Night", "Authentic", "100% CCTV"]
      },
      {
        id: "tokyo-food-2",
        name: "Tsukiji Outer Market Seafood Emporium",
        category: "food",
        categoryLabel: "Artisanal Street Food",
        lat: 35.6655,
        lng: 139.7708,
        address: "4 Chome Tsukiji, Chuo City",
        rating: 4.9,
        priceLabel: "Moderate ($5 - $12)",
        safetyScore: 98,
        cleanlinessScore: 97,
        timings: "8:00 AM - 3:00 PM",
        description: "Freshly torched wagyu skewers, tamagoyaki omelettes, and sashimi bowls.",
        tags: ["Seafood", "Morning Market", "SafeWalk Verified"]
      },
      {
        id: "tokyo-heritage-1",
        name: "Sensō-ji Ancient Temple & Kaminarimon Gate",
        category: "heritage",
        categoryLabel: "Asakusa Buddhist Heritage",
        lat: 35.7148,
        lng: 139.7967,
        address: "2 Chome-3-1 Asakusa, Taito City",
        rating: 4.9,
        priceLabel: "Free Admission",
        safetyScore: 97,
        cleanlinessScore: 98,
        timings: "6:00 AM - 5:00 PM (Illuminated till 11 PM)",
        description: "Tokyo's oldest Buddhist temple founded in 645 AD with giant red paper lantern.",
        tags: ["History", "Architecture", "Night Illumination"]
      },
      {
        id: "tokyo-hazard-1",
        name: "Kabukicho Narrow Rear Alleys",
        category: "hazard",
        categoryLabel: "Night Entertainment Caution",
        lat: 35.6950,
        lng: 139.7025,
        address: "Kabukicho 1-Chome",
        riskLevel: "Medium",
        riskSeverity: 58,
        safetyScore: 72,
        cleanlinessScore: 82,
        cautionTip: "Be mindful of persistent touts and crowded bars after midnight.",
        lastReported: "Active advisory",
        tags: ["Crowd Density", "Touts"]
      }
    ],
    safeCorridors: [
      {
        id: "tokyo-corridor-1",
        name: "Marunouchi - Imperial Palace Solar Lit Greenway",
        coordinates: [
          [35.6812, 139.7671],
          [35.6830, 139.7620],
          [35.6852, 139.7560],
          [35.6868, 139.7525]
        ]
      }
    ],
    zones: [
      {
        id: "tokyo-zone-marunouchi",
        name: "Marunouchi & Ginza Prime Ward",
        polygon: [
          [35.6720, 139.7580],
          [35.6880, 139.7620],
          [35.6850, 139.7740],
          [35.6690, 139.7700]
        ],
        metrics: { safety: 99, cleanliness: 99, affordability: 58, accessibility: 98 },
        status: "Pristine & Ultra-Safe",
        dominantVibe: "Luxury flagships, imperial tree-lined avenues, koban police kiosks"
      },
      {
        id: "tokyo-zone-asakusa",
        name: "Asakusa & Ueno Cultural Quarter",
        polygon: [
          [35.7050, 139.7800],
          [35.7220, 139.7880],
          [35.7190, 139.8050],
          [35.7020, 139.7980]
        ],
        metrics: { safety: 95, cleanliness: 96, affordability: 86, accessibility: 94 },
        status: "High Heritage & Affordable Eats",
        dominantVibe: "Historic wooden shops, incense smoke, peaceful stone lanterns"
      }
    ]
  },
  {
    id: "nyc",
    name: "New York",
    country: "USA",
    flag: "🇺🇸",
    lat: 40.7128,
    lng: -74.0060,
    zoom: 13,
    safetyScore: 89,
    cleanlinessScore: 82,
    walkabilityScore: 96,
    aqi: 35,
    temp: "18°C",
    vibe: "Iconic high-line skywalks, legendary street bagels, Broadway theatre & brownstone alleys",
    pois: [
      {
        id: "nyc-food-1",
        name: "Chelsea Market Artisanal Concourse",
        category: "food",
        categoryLabel: "Gourmet Food Hall",
        lat: 40.7424,
        lng: -74.0061,
        address: "75 9th Ave, New York, NY",
        rating: 4.8,
        priceLabel: "Moderate ($6 - $14)",
        safetyScore: 94,
        cleanlinessScore: 92,
        timings: "8:00 AM - 10:00 PM",
        description: "Indoor concourse inside historic National Biscuit Company factory with tacos and seafood.",
        tags: ["Indoor Haven", "SafeWalk", "Artisanal"]
      },
      {
        id: "nyc-heritage-1",
        name: "Brooklyn Bridge Stone Towers & Promenade",
        category: "heritage",
        categoryLabel: "National Historic Landmark",
        lat: 40.7061,
        lng: -73.9969,
        address: "Brooklyn Bridge Pedestrian Way",
        rating: 4.9,
        priceLabel: "Free Public Access",
        safetyScore: 93,
        cleanlinessScore: 88,
        timings: "Open 24/7 (High Police Presence)",
        description: "Iconic neo-Gothic suspension bridge completed in 1883 with breathtaking skyline views.",
        tags: ["Landmark", "Walking Tour", "Skyline Views"]
      },
      {
        id: "nyc-hazard-1",
        name: "Canal St & West Broadway Unlit Construction Siding",
        category: "hazard",
        categoryLabel: "Pedestrian Chokepoint",
        lat: 40.7200,
        lng: -74.0050,
        address: "Canal St Subway Exit",
        riskLevel: "Medium",
        riskSeverity: 62,
        safetyScore: 68,
        cleanlinessScore: 60,
        cautionTip: "Narrow scaffold walkway with blind turns; stay on lit Broadway avenue.",
        lastReported: "Citizen reported 2h ago",
        tags: ["Scaffolding", "Dim Lighting"]
      }
    ],
    safeCorridors: [
      {
        id: "nyc-corridor-1",
        name: "Broadway & Union Square Illuminated Spine",
        coordinates: [
          [40.7359, -73.9911],
          [40.7280, -73.9950],
          [40.7180, -74.0020],
          [40.7128, -74.0060]
        ]
      }
    ],
    zones: [
      {
        id: "nyc-zone-battery",
        name: "Financial District & Battery Park Green",
        polygon: [
          [40.7010, -74.0180],
          [40.7150, -74.0150],
          [40.7120, -74.0020],
          [40.6990, -74.0080]
        ],
        metrics: { safety: 96, cleanliness: 92, affordability: 54, accessibility: 98 },
        status: "Monitored & Secure",
        dominantVibe: "Harbor views, active security patrols, cobblestone alleys"
      }
    ]
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    flag: "🇫🇷",
    lat: 48.8566,
    lng: 2.3522,
    zoom: 14,
    safetyScore: 91,
    cleanlinessScore: 88,
    walkabilityScore: 98,
    aqi: 28,
    temp: "17°C",
    vibe: "Seine riverbank promenades, historic Latin Quarter bistros, Haussmann stone boulevards",
    pois: [
      {
        id: "paris-food-1",
        name: "Rue Mouffetard Traditional Market & Creperie",
        category: "food",
        categoryLabel: "Artisanal Bakeries & Fromagerie",
        lat: 48.8420,
        lng: 2.3490,
        address: "Rue Mouffetard, 5th Arrondissement",
        rating: 4.8,
        priceLabel: "Budget ($3 - $8)",
        safetyScore: 92,
        cleanlinessScore: 90,
        timings: "9:00 AM - 11:30 PM",
        description: "Medieval cobblestone street market filled with fresh baguettes, cheeses, and crepes.",
        tags: ["Cobblestone", "Local Favorite", "SafeWalk Verified"]
      },
      {
        id: "paris-heritage-1",
        name: "Notre-Dame & Île de la Cité Heritage Core",
        category: "heritage",
        categoryLabel: "Gothic Masterpiece & Seine Island",
        lat: 48.8530,
        lng: 2.3499,
        address: "6 Parvis Notre-Dame",
        rating: 4.9,
        priceLabel: "Free Public Square",
        safetyScore: 95,
        cleanlinessScore: 94,
        timings: "Open 24/7 (Security Escort Active)",
        description: "Historic heart of Paris founded in Roman times on the Seine with illuminated stone flying buttresses.",
        tags: ["UNESCO", "Historical Core", "Tourist Police"]
      },
      {
        id: "paris-hazard-1",
        name: "Gare du Nord North Undercrossing",
        category: "hazard",
        categoryLabel: "Transit Pickpocket Caution",
        lat: 48.8810,
        lng: 2.3550,
        address: "Rue de Dunkerque Periphery",
        riskLevel: "Medium",
        riskSeverity: 64,
        safetyScore: 66,
        cleanlinessScore: 62,
        cautionTip: "High transit crowd congestion; keep valuables secure.",
        lastReported: "Advisory active",
        tags: ["Crowded Transit", "Caution"]
      }
    ],
    safeCorridors: [
      {
        id: "paris-corridor-1",
        name: "Seine Riverbank Illuminated Quai Promenade",
        coordinates: [
          [48.8584, 2.2945],
          [48.8600, 2.3200],
          [48.8550, 2.3450],
          [48.8510, 2.3550]
        ]
      }
    ],
    zones: [
      {
        id: "paris-zone-islands",
        name: "Île de la Cité & Latin Quarter",
        polygon: [
          [48.8450, 2.3380],
          [48.8580, 2.3420],
          [48.8560, 2.3580],
          [48.8430, 2.3520]
        ],
        metrics: { safety: 94, cleanliness: 92, affordability: 72, accessibility: 96 },
        status: "Heritage Haven",
        dominantVibe: "Stone bookshops, illuminated river bridges, students & cafe terraces"
      }
    ]
  },
  {
    id: "london",
    name: "London",
    country: "UK",
    flag: "🇬🇧",
    lat: 51.5074,
    lng: -0.1278,
    zoom: 13,
    safetyScore: 92,
    cleanlinessScore: 90,
    walkabilityScore: 95,
    aqi: 26,
    temp: "16°C",
    vibe: "Thames South Bank cultural spine, Borough Market gourmet stalls, historic Tower ramparts",
    pois: [
      {
        id: "london-food-1",
        name: "Borough Market Culinary Stalls",
        category: "food",
        categoryLabel: "Historic Street Food Market",
        lat: 51.5055,
        lng: -0.0910,
        address: "8 Southwark St, London SE1",
        rating: 4.8,
        priceLabel: "Moderate ($5 - $11)",
        safetyScore: 93,
        cleanlinessScore: 91,
        timings: "10:00 AM - 5:00 PM",
        description: "Trading food for over 1,000 years; world-famous scotch eggs, paella, and sourdough.",
        tags: ["Historic Market", "Street Food", "SafeWalk Verified"]
      },
      {
        id: "london-heritage-1",
        name: "Tower of London & Medieval Fortress",
        category: "heritage",
        categoryLabel: "UNESCO Royal Fortress",
        lat: 51.5081,
        lng: -0.0759,
        address: "Tower Hill, London EC3N",
        rating: 4.9,
        priceLabel: "Entry Fee Required",
        safetyScore: 96,
        cleanlinessScore: 94,
        timings: "9:00 AM - 5:30 PM",
        description: "William the Conqueror's 1078 fortress containing the Crown Jewels and Yeoman Warders.",
        tags: ["Royal Heritage", "High Security", "Museum"]
      },
      {
        id: "london-hazard-1",
        name: "Old Canal Basin Goods Siding",
        category: "hazard",
        categoryLabel: "Low Footfall Caution",
        lat: 51.5180,
        lng: -0.0800,
        address: "Canal Wharf",
        riskLevel: "Low",
        riskSeverity: 45,
        safetyScore: 78,
        cleanlinessScore: 75,
        cautionTip: "Dim lighting after 11 PM; prefer main illuminated High Street.",
        lastReported: "Advisory active",
        tags: ["Low Lighting"]
      }
    ],
    safeCorridors: [
      {
        id: "london-corridor-1",
        name: "Thames South Bank Cultural Greenway",
        coordinates: [
          [51.5033, -0.1195],
          [51.5070, -0.0980],
          [51.5065, -0.0880],
          [51.5040, -0.0750]
        ]
      }
    ],
    zones: [
      {
        id: "london-zone-westminster",
        name: "Westminster & South Bank Cultural Zone",
        polygon: [
          [51.4980, -0.1350],
          [51.5120, -0.1250],
          [51.5080, -0.0850],
          [51.4950, -0.1000]
        ],
        metrics: { safety: 95, cleanliness: 91, affordability: 62, accessibility: 97 },
        status: "Monitored & Safe",
        dominantVibe: "Continuous street lamps, buskers, river views, high police presence"
      }
    ]
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    flag: "🇦🇺",
    lat: -33.8688,
    lng: 151.2093,
    zoom: 14,
    safetyScore: 95,
    cleanlinessScore: 96,
    walkabilityScore: 94,
    aqi: 18,
    temp: "22°C",
    vibe: "Sunlit harbor foreshores, The Rocks sandstone heritage, clean light-rail transit",
    pois: [
      {
        id: "sydney-food-1",
        name: "The Rocks Historic Food & Craft Market",
        category: "food",
        categoryLabel: "Sandstone Waterfront Eats",
        lat: -33.8590,
        lng: 151.2080,
        address: "George St, The Rocks NSW",
        rating: 4.8,
        priceLabel: "Moderate ($6 - $14)",
        safetyScore: 96,
        cleanlinessScore: 96,
        timings: "10:00 AM - 10:00 PM",
        description: "Artisanal burgers, Aussie meat pies, and harbor oysters in Sydney's oldest neighborhood.",
        tags: ["Harbor View", "SafeWalk", "Heritage"]
      },
      {
        id: "sydney-heritage-1",
        name: "Sydney Opera House Foreshore Promenade",
        category: "heritage",
        categoryLabel: "World Heritage Architectural Marvel",
        lat: -33.8568,
        lng: 151.2153,
        address: "Bennelong Point, Sydney",
        rating: 4.9,
        priceLabel: "Free Public Promenade",
        safetyScore: 98,
        cleanlinessScore: 98,
        timings: "Open 24/7 (Monitored)",
        description: "Jørn Utzon's 20th-century masterpiece with white sail shells glowing over Sydney Harbour.",
        tags: ["Architecture", "UNESCO", "Harbor Patrol"]
      }
    ],
    safeCorridors: [
      {
        id: "sydney-corridor-1",
        name: "Circular Quay - Barangaroo Illuminated Foreshore",
        coordinates: [
          [-33.8610, 151.2100],
          [-33.8580, 151.2060],
          [-33.8620, 151.2010],
          [-33.8670, 151.2020]
        ]
      }
    ],
    zones: [
      {
        id: "sydney-zone-harbour",
        name: "Circular Quay & The Rocks Core",
        polygon: [
          [-33.8540, 151.2050],
          [-33.8540, 151.2180],
          [-33.8660, 151.2150],
          [-33.8660, 151.2020]
        ],
        metrics: { safety: 97, cleanliness: 97, affordability: 60, accessibility: 96 },
        status: "Pristine Waterfront",
        dominantVibe: "Fresh ocean breeze, illuminated ferries, security sentinels"
      }
    ]
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
    lat: 25.2048,
    lng: 55.2708,
    zoom: 13,
    safetyScore: 99,
    cleanlinessScore: 99,
    walkabilityScore: 88,
    aqi: 32,
    temp: "29°C",
    vibe: "Ultra-modern sky gardens, 24/7 AI smart city safety, historic creek dhow trading ports",
    pois: [
      {
        id: "dubai-food-1",
        name: "Al Fanar Heritage Seafood & Emirati Eats",
        category: "food",
        categoryLabel: "Traditional Emirati Kitchen",
        lat: 25.2250,
        lng: 55.3500,
        address: "Dubai Festival City & Creek",
        rating: 4.8,
        priceLabel: "Moderate ($8 - $18)",
        safetyScore: 99,
        cleanlinessScore: 99,
        timings: "9:00 AM - 11:00 PM",
        description: "Machboos spiced rice, slow-cooked lamb, and cardamom luqaimat sweet fritters.",
        tags: ["Emirati Lore", "Ultra-Safe", "Family Friendly"]
      },
      {
        id: "dubai-heritage-1",
        name: "Al Fahidi Historical Bastakiya & Wind Towers",
        category: "heritage",
        categoryLabel: "19th Century Gypsum Heritage",
        lat: 25.2630,
        lng: 55.2970,
        address: "Al Fahidi District, Bur Dubai",
        rating: 4.8,
        priceLabel: "Free Public Exploration",
        safetyScore: 99,
        cleanlinessScore: 98,
        timings: "8:00 AM - 10:00 PM",
        description: "Intricately preserved wind-tower architectural quarter with art galleries and coffee museums.",
        tags: ["Living Heritage", "Wind Towers", "Zero Crime Zone"]
      }
    ],
    safeCorridors: [
      {
        id: "dubai-corridor-1",
        name: "Downtown Boulevard Smart LED Safe Corridor",
        coordinates: [
          [25.1972, 55.2744],
          [25.2010, 55.2720],
          [25.2050, 55.2760],
          [25.2080, 55.2810]
        ]
      }
    ],
    zones: [
      {
        id: "dubai-zone-downtown",
        name: "Downtown & Business Bay Smart Sector",
        polygon: [
          [25.1900, 55.2650],
          [25.2100, 55.2680],
          [25.2120, 55.2850],
          [25.1920, 55.2820]
        ],
        metrics: { safety: 99, cleanliness: 99, affordability: 50, accessibility: 96 },
        status: "Pristine Smart Hub",
        dominantVibe: "Smart pole CCTV, palm shade misting, luxury towers"
      }
    ]
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    flag: "🇸🇬",
    lat: 1.3521,
    lng: 103.8198,
    zoom: 14,
    safetyScore: 99,
    cleanlinessScore: 99,
    walkabilityScore: 98,
    aqi: 20,
    temp: "28°C",
    vibe: "Garden city in nature, UNESCO hawker culture, solar supertrees & immaculate pavements",
    pois: [
      {
        id: "singapore-food-1",
        name: "Maxwell Food Centre Hawker Haven",
        category: "food",
        categoryLabel: "UNESCO Hawker Heritage",
        lat: 1.2803,
        lng: 103.8447,
        address: "1 Kadayanallur St, Singapore",
        rating: 4.8,
        priceLabel: "Budget ($3 - $6)",
        safetyScore: 99,
        cleanlinessScore: 98,
        timings: "8:00 AM - 2:00 AM",
        description: "Tian Tian Hainanese Chicken Rice, crispy oyster cakes, and fresh sugarcane juice.",
        tags: ["Hawker", "Budget Feast", "100% SafeWalk"]
      },
      {
        id: "singapore-heritage-1",
        name: "Chinatown Heritage Shophouses & Thian Hock Keng",
        category: "heritage",
        categoryLabel: "1820s Peranakan Architecture",
        lat: 1.2820,
        lng: 103.8475,
        address: "Telok Ayer St, Singapore",
        rating: 4.9,
        priceLabel: "Free Admission",
        safetyScore: 99,
        cleanlinessScore: 99,
        timings: "7:30 AM - 5:30 PM",
        description: "Carved dragon roofs built entirely without nails by seafaring Hokkien settlers.",
        tags: ["Architecture", "Historic Temple", "Pristine"]
      }
    ],
    safeCorridors: [
      {
        id: "singapore-corridor-1",
        name: "Marina Bay - Gardens by the Bay Solar Corridor",
        coordinates: [
          [1.2840, 103.8540],
          [1.2860, 103.8600],
          [1.2820, 103.8640],
          [1.2780, 103.8610]
        ]
      }
    ],
    zones: [
      {
        id: "singapore-zone-marina",
        name: "Marina Bay & Civic District",
        polygon: [
          [1.2750, 103.8450],
          [1.2950, 103.8500],
          [1.2920, 103.8650],
          [1.2720, 103.8600]
        ],
        metrics: { safety: 99, cleanliness: 99, affordability: 65, accessibility: 99 },
        status: "Benchmark Global City",
        dominantVibe: "Lush tropical green canopy, climate-controlled subways, zero crime"
      }
    ]
  },
  {
    id: "sanfrancisco",
    name: "San Francisco",
    country: "USA",
    flag: "🇺🇸",
    lat: 37.7749,
    lng: -122.4194,
    zoom: 13,
    safetyScore: 85,
    cleanlinessScore: 82,
    walkabilityScore: 92,
    aqi: 24,
    temp: "15°C",
    vibe: "Iconic cable car hills, historic Mission murals, Embarcadero waterfront bay breezes",
    pois: [
      {
        id: "sf-food-1",
        name: "Ferry Building Marketplace & Sourdough Bakery",
        category: "food",
        categoryLabel: "Artisanal Bay Emporium",
        lat: 37.7955,
        lng: -122.3937,
        address: "1 Ferry Building, San Francisco",
        rating: 4.8,
        priceLabel: "Moderate ($6 - $14)",
        safetyScore: 94,
        cleanlinessScore: 92,
        timings: "7:00 AM - 8:00 PM",
        description: "Freshly baked sourdough, local artisan cheeses, and oysters overlooking the Bay Bridge.",
        tags: ["Waterfront", "Artisan", "SafeWalk Verified"]
      },
      {
        id: "sf-heritage-1",
        name: "Mission San Francisco de Asís (Mission Dolores)",
        category: "heritage",
        categoryLabel: "1776 Spanish Adobe Landmark",
        lat: 37.7640,
        lng: -122.4268,
        address: "3321 16th St, San Francisco",
        rating: 4.7,
        priceLabel: "Small Donation ($5)",
        safetyScore: 88,
        cleanlinessScore: 86,
        timings: "9:00 AM - 4:00 PM",
        description: "Oldest intact building in San Francisco survived the 1906 earthquake unscathed.",
        tags: ["Historic Adobe", "18th Century", "Quiet Haven"]
      }
    ],
    safeCorridors: [
      {
        id: "sf-corridor-1",
        name: "Embarcadero Waterfront Illuminated Promenade",
        coordinates: [
          [37.8080, -122.4100],
          [37.8000, -122.3980],
          [37.7920, -122.3890],
          [37.7800, -122.3880]
        ]
      }
    ],
    zones: [
      {
        id: "sf-zone-waterfront",
        name: "Embarcadero & Marina Bayfront",
        polygon: [
          [37.7850, -122.4050],
          [37.8050, -122.4150],
          [37.8100, -122.4000],
          [37.7900, -122.3850]
        ],
        metrics: { safety: 94, cleanliness: 90, affordability: 52, accessibility: 95 },
        status: "Scenic & Safe",
        dominantVibe: "Sea lions, palm trees, historic streetcars, harbor breezes"
      }
    ]
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    flag: "🇪🇸",
    lat: 41.3879,
    lng: 2.1699,
    zoom: 14,
    safetyScore: 90,
    cleanlinessScore: 89,
    walkabilityScore: 97,
    aqi: 30,
    temp: "21°C",
    vibe: "Gothic Quarter alleys, Gaudí modernisme marvels, Mediterranean tapas bars & pedestrian ramblas",
    pois: [
      {
        id: "bcn-food-1",
        name: "Mercat de la Boqueria Tapas Stalls",
        category: "food",
        categoryLabel: "Iconic Rambla Market",
        lat: 41.3817,
        lng: 2.1715,
        address: "La Rambla, 91, Barcelona",
        rating: 4.8,
        priceLabel: "Budget-Moderate ($4 - $10)",
        safetyScore: 88,
        cleanlinessScore: 90,
        timings: "8:00 AM - 8:30 PM",
        description: "Fresh seafood a la plancha, jamón ibérico cones, patatas bravas, and fresh fruit juices.",
        tags: ["Tapas", "Vibrant Market", "SafeWalk Verified"]
      },
      {
        id: "bcn-heritage-1",
        name: "Gothic Quarter (Barri Gòtic) Cathedral Square",
        category: "heritage",
        categoryLabel: "Roman & Medieval Stone Heart",
        lat: 41.3839,
        lng: 2.1762,
        address: "Pla de la Seu, Barcelona",
        rating: 4.9,
        priceLabel: "Free Public Square",
        safetyScore: 92,
        cleanlinessScore: 91,
        timings: "Open 24/7 (Illuminated at Night)",
        description: "14th-century Gothic cathedral surrounded by labyrinthine car-free stone alleys and Roman walls.",
        tags: ["Medieval", "Labyrinth", "Pedestrian Only"]
      }
    ],
    safeCorridors: [
      {
        id: "bcn-corridor-1",
        name: "Passeig de Gràcia Illuminated Architectural Avenue",
        coordinates: [
          [41.3860, 2.1700],
          [41.3910, 2.1650],
          [41.3960, 2.1610],
          [41.4000, 2.1580]
        ]
      }
    ],
    zones: [
      {
        id: "bcn-zone-eixample",
        name: "Eixample Modernista Sector",
        polygon: [
          [41.3820, 2.1550],
          [41.3980, 2.1480],
          [41.4050, 2.1700],
          [41.3900, 2.1780]
        ],
        metrics: { safety: 94, cleanliness: 92, affordability: 74, accessibility: 97 },
        status: "Architectural Jewel",
        dominantVibe: "Wide octagonal intersections, Gaudí facades, leafy pedestrian avenues"
      }
    ]
  }
];

// DYNAMIC WORLDWIDE FALLBACK GENERATOR (Works for ANY coordinate or city on Earth!)
function generateDynamicCityDataset(cityName, lat, lng) {
  const cleanName = cityName.split(",")[0].trim();
  const safeScore = 85 + Math.floor(Math.sin(lat * 10) * 10);
  
  return {
    id: `custom-${Date.now()}`,
    name: cleanName,
    country: "Worldwide Exploration",
    flag: "🌍",
    lat: lat,
    lng: lng,
    zoom: 14,
    safetyScore: safeScore,
    cleanlinessScore: 84,
    walkabilityScore: 88,
    aqi: 30,
    temp: "22°C",
    vibe: `Active UrbanWay global exploration active in ${cleanName}. Localized safety telemetry synthesized in real time.`,
    pois: [
      {
        id: `global-food-${Date.now()}`,
        name: `${cleanName} Central Gastronomy Market`,
        category: "food",
        categoryLabel: "Local Delicacies & Street Eats",
        lat: lat + 0.0035,
        lng: lng + 0.0040,
        address: `Downtown Core, ${cleanName}`,
        rating: 4.8,
        priceLabel: "Budget Friendly ($4 - $9)",
        safetyScore: safeScore,
        cleanlinessScore: 86,
        timings: "10:00 AM - 11:00 PM",
        description: `Top rated artisanal food hub and culinary discovery point in ${cleanName}. Verified footfall.`,
        tags: ["Local Eats", "SafeWalk Verified", "High Footfall"]
      },
      {
        id: `global-heritage-${Date.now()}`,
        name: `${cleanName} Historic Plaza & Cultural Sanctuary`,
        category: "heritage",
        categoryLabel: "Cultural Heritage Landmark",
        lat: lat + 0.0065,
        lng: lng - 0.0035,
        address: `Old Quarter, ${cleanName}`,
        rating: 4.9,
        priceLabel: "Free Public Exploration",
        safetyScore: safeScore + 3,
        cleanlinessScore: 88,
        timings: "Open 24/7",
        description: `Historic heart and architectural jewel of ${cleanName}. Monitored civic greenway.`,
        tags: ["Architecture", "Historic Core", "Civic Center"]
      },
      {
        id: `global-hazard-${Date.now()}`,
        name: `${cleanName} Outer Ring Unlit Intersection`,
        category: "hazard",
        categoryLabel: "Caution Blackspot",
        lat: lat - 0.0050,
        lng: lng + 0.0055,
        address: `Peripheral Ring Road, ${cleanName}`,
        riskLevel: "Medium",
        riskSeverity: 60,
        safetyScore: 58,
        cleanlinessScore: 60,
        cautionTip: "Dim evening illumination; pedestrians advised to follow downtown SafeWalk corridor.",
        lastReported: "UrbanWay AI Advisory",
        tags: ["Low Lighting", "Caution"]
      }
    ],
    safeCorridors: [
      {
        id: `global-corridor-${Date.now()}`,
        name: `${cleanName} Smart Greenway Corridor`,
        coordinates: [
          [lat + 0.0070, lng - 0.0040],
          [lat + 0.0030, lng - 0.0010],
          [lat - 0.0010, lng + 0.0020],
          [lat - 0.0040, lng + 0.0050]
        ]
      }
    ],
    zones: [
      {
        id: `global-zone-${Date.now()}`,
        name: `${cleanName} Metropolitan Safe Sector`,
        polygon: [
          [lat + 0.0100, lng - 0.0100],
          [lat + 0.0100, lng + 0.0100],
          [lat - 0.0100, lng + 0.0100],
          [lat - 0.0100, lng - 0.0100]
        ],
        metrics: { safety: safeScore, cleanliness: 84, affordability: 78, accessibility: 90 },
        status: "UrbanWay Verified",
        dominantVibe: `Active community surveillance and verified transit access in ${cleanName}`
      }
    ]
  };
}

