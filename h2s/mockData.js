/**
 * FIFA ArenaPulse 2026 - Stadium Knowledge Base & Mock Data
 * Focuses on BC Place Stadium (Vancouver) configured for FIFA World Cup 2026
 */

const STADIUM_DATA = {
  name: "BC Place Stadium, Vancouver",
  capacity: 54500,
  gates: [
    { id: "A", name: "Gate A (Main Entrance)", location: "North-East", crowdedness: "High", waitTime: "22 mins", accessible: true, status: "Normal" },
    { id: "B", name: "Gate B (Terry Fox Plaza)", location: "East", crowdedness: "Medium", waitTime: "12 mins", accessible: true, status: "Normal" },
    { id: "C", name: "Gate C", location: "South-East", crowdedness: "Low", waitTime: "3 mins", accessible: false, status: "Normal" },
    { id: "D", name: "Gate D", location: "South", crowdedness: "Medium", waitTime: "8 mins", accessible: true, status: "Normal" },
    { id: "E", name: "Gate E", location: "West", crowdedness: "High", waitTime: "25 mins", accessible: true, status: "Redirecting" },
    { id: "H", name: "Gate H (VIP & Accessibility Entrance)", location: "North-West", crowdedness: "Low", waitTime: "4 mins", accessible: true, status: "Priority" }
  ],
  concessions: [
    { id: "c1", name: "Pacific Rim Bistro", section: "103", items: ["Sushi Rolls", "Teriyaki Bowls", "Vegan Gyoza"], tags: ["Vegan", "Gluten-Free"], waitTime: "8 mins" },
    { id: "c2", name: "Maple Leaf Grille", section: "115", items: ["Poutine", "Classic Burgers", "Hot Dogs"], tags: ["Halal Available"], waitTime: "15 mins" },
    { id: "c3", name: "Andes Tacos & Nachos", section: "124", items: ["Beef Tacos", "Veggie Nachos", "Churros"], tags: ["Vegetarian", "Gluten-Free"], waitTime: "10 mins" },
    { id: "c4", name: "Green Field Salads & Wraps", section: "109", items: ["Quinoa Power Bowl", "Falafel Wrap", "Fruit Cups"], tags: ["Vegan", "Vegetarian", "Healthy"], waitTime: "4 mins" },
    { id: "c5", name: "BC Brews & Beverages", section: "118", items: ["Local Craft Beer", "Soft Drinks", "Pretzels"], tags: ["Beverages"], waitTime: "5 mins" }
  ],
  amenities: [
    { type: "restroom", name: "Restrooms (M/F)", section: "104", accessible: true, babyChanging: true },
    { type: "restroom", name: "Gender Neutral Restroom", section: "112", accessible: true, babyChanging: true },
    { type: "restroom", name: "Restrooms (M/F)", section: "120", accessible: false, babyChanging: false },
    { type: "first_aid", name: "St. John Ambulance First Aid Station", section: "108", nurseOnDuty: true },
    { type: "first_aid", name: "Secondary First Aid Station", section: "122", nurseOnDuty: true },
    { type: "elevator", name: "Main Elevator Lift North", section: "106", weightCapacity: "1500kg" },
    { type: "elevator", name: "Elevator Lift South", section: "125", weightCapacity: "1500kg" },
    { type: "sensory", name: "Sensory Calm Room", section: "111", features: ["Sound dampening", "Weighted blankets", "Dim lights"], accessible: true }
  ],
  transitOptions: [
    { id: "skytrain", name: "SkyTrain (Expo Line)", station: "Stadium-Chinatown Station", waitTime: "15 mins", cost: "$3.50", co2Saved: "1.8 kg CO2", walkTime: "8 mins", capacity: "Very High", recommended: true },
    { id: "shuttle", name: "FIFA Express Shuttle Bus", station: "Gate B Shuttle Depot", waitTime: "10 mins", cost: "Free (with Match Ticket)", co2Saved: "1.2 kg CO2", walkTime: "3 mins", capacity: "High", recommended: true },
    { id: "cycling", name: "Active Cycling & Bike Valet", station: "Gate C Bike Lockup", waitTime: "0 mins", cost: "Free", co2Saved: "2.4 kg CO2", walkTime: "1 min", capacity: "Unlimited", recommended: true },
    { id: "rideshare", name: "Rideshare Pickup/Dropoff", station: "Pacific Boulevard Zone 4", waitTime: "25 mins", cost: "$25 - $40", co2Saved: "0.2 kg CO2", walkTime: "12 mins", capacity: "Low", recommended: false }
  ],
  sustainabilityScorecard: {
    targetCo2Reduction: 50000, // in kg CO2
    currentCo2Reduction: 38450,
    recycleRate: "78%",
    waterSavedLitres: 124000,
    ecoTips: [
      "Use the free Bike Valet at Gate C to save 2.4kg of CO2 and skip the transit queues!",
      "Bring a reusable water bottle (max 500ml, soft plastic) and fill it up at the water stations near Section 106 and 120.",
      "Dispose of your food waste in the green organics bins. FIFA World Cup 2026 aims for zero waste to landfill!",
      "Purchasing digital tournament programs instead of print saves roughly 150g of paper waste per fan."
    ]
  },
  volunteers: [
    { id: "v1", name: "Mateo Silva", languages: ["Spanish", "English", "Portuguese"], status: "Available", zone: "Zone A (Gates A & H)", avatar: "👨‍💼" },
    { id: "v2", name: "Yuki Tanaka", languages: ["Japanese", "English"], status: "Available", zone: "Zone B (Gate B)", avatar: "👩‍💼" },
    { id: "v3", name: "Sophie Dubois", languages: ["French", "English", "German"], status: "Busy", zone: "Zone C (Gate C & D)", avatar: "👩" },
    { id: "v4", name: "Amir Al-Farsi", languages: ["Arabic", "English"], status: "Available", zone: "Zone D (Gate E)", avatar: "👨" },
    { id: "v5", name: "Harpreet Singh", languages: ["Punjabi", "Hindi", "English"], status: "Dispatched", zone: "Zone A (Gates A & H)", avatar: "🧔" }
  ],
  knowledgeBase: {
    general: {
      "bag policy": "Clear bags only, maximum size 12\" x 6\" x 12\" (30.5 x 15.2 x 30.5 cm). Small clutches/purses are allowed up to 4.5\" x 6.5\". No backpacks.",
      "permitted items": "Soft-sided empty water bottles up to 500ml, small folding umbrellas, flags/banners without poles (max 2m x 1.5m), mobile phone chargers.",
      "prohibited items": "Professional cameras, weapons of any kind, alcohol, laser pointers, noise makers (vuvuzelas are not allowed inside the stadium), glass containers.",
      "smoking": "BC Place is a 100% smoke-free and vape-free venue. No designated smoking areas are available once inside.",
      "tickets": "All FIFA World Cup 2026 tickets are fully digital and must be accessed via the official FIFA Tickets App. Paper tickets or screenshots will not scan."
    },
    intents: [
      {
        keywords: ["gate", "entrance", "enter", "where do i go", "security check", "gates"],
        response: "BC Place has gates A through H. Your digital ticket specifies your designated entrance gate for optimal crowd management. Currently, Gate B and Gate C have the shortest lines, while Gate E is experiencing high volume. If you need step-by-step navigation, select your gate on the map!"
      },
      {
        keywords: ["wheelchair", "accessible", "disability", "elevator", "stroller", "ramp", "limited mobility", "handicap", "sensory", "blind", "deaf"],
        response: "BC Place offers complete accessibility support. Gate H (North-West) is our dedicated Priority Access Entrance. Elevators are located at Sections 106 and 125. All restrooms at Sections 104 and 112 are wheelchair accessible. For fans with sensory sensitivities, a Sensory Calm Room is available at Section 111 with sound dampening and dim lights."
      },
      {
        keywords: ["food", "eat", "drink", "concession", "beer", "vegan", "gluten", "vegetarian", "halal", "hungry", "thirsty", "restaurant"],
        response: "We have multiple concession options! For **Vegan & Gluten-Free** options, head to Pacific Rim Bistro (Sec 103) or Green Field Salads (Sec 109). Andean Tacos (Sec 124) offers **Vegetarian** choices. **Halal** items are served at Maple Leaf Grille (Sec 115). Local craft beers are available at BC Brews (Sec 118)."
      },
      {
        keywords: ["metro", "skytrain", "bus", "shuttle", "transport", "rideshare", "uber", "taxi", "bike", "cycle", "parking", "sustainable", "eco"],
        response: "FIFA 2026 strongly encourages sustainable transit! The Expo Line SkyTrain (Stadium-Chinatown Station) is an 8-minute walk and the greenest high-capacity option. A free Bike Valet is active at Gate C, saving 2.4kg of CO2. Avoid rideshares near Pacific Boulevard if possible, as wait times exceed 25 minutes due to road closures."
      },
      {
        keywords: ["emergency", "hurt", "injured", "medical", "police", "security", "lost", "stolen", "first aid", "nurse"],
        response: "🚨 **Immediate Assistance:** If you have an emergency, please notify the nearest stadium steward immediately or go to the First Aid Station at Section 108 or Section 122. You can also report an incident via this app under the Staff view or by telling a volunteer (look for the green FIFA vests)."
      }
    ]
  }
};

// Export to node or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = STADIUM_DATA;
}
