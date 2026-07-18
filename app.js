/**
 * FIFA ArenaPulse 2026 - Main Application Controller
 * Handles Portal views, Map pathfinding, GenAI simulated NLP Engine,
 * Accessibility tools, Incident dispatching, and PA translations.
 */

// State Management
const STATE = {
  currentTab: 'fan',
  selectedLanguage: 'en',
  highContrastMode: false,
  textToSpeechEnabled: false,
  chatHistory: [],
  incidents: [
    { id: "inc-1", title: "Minor water spill near Concession c1", section: "103", category: "Cleaning", severity: "Low", status: "Active", assignedTo: "Mateo Silva", time: "10 mins ago" },
    { id: "inc-2", title: "Crowd bottleneck at Gate E ticket scanners", section: "Gate E", category: "Crowd Control", severity: "High", status: "Active", assignedTo: "Harpreet Singh", time: "5 mins ago" }
  ],
  volunteers: [],
  selectedMapFeature: null,
  activeNavigationPath: null
};

// UI Elements Cache
const DOM = {
  // Navigation Tabs
  tabFan: null,
  tabStaff: null,
  viewFan: null,
  viewStaff: null,
  
  // Accessibility Elements
  btnContrast: null,
  btnSpeech: null,
  
  // Chat Elements
  chatMessages: null,
  chatInput: null,
  btnSend: null,
  langButtons: null,
  
  // Map Elements
  mapSvg: null,
  mapOverlay: null,
  overlayTitle: null,
  overlayDetail: null,
  btnOverlayAction: null,
  mapLegend: null,
  
  // Operations Panel
  incidentFeed: null,
  btnLogIncident: null,
  inputIncidentText: null,
  copilotResponse: null,
  volunteersList: null,
  
  // PA Generator Elements
  btnGeneratePa: null,
  inputPaText: null,
  selectPaLang: null,
  paTranslationOutput: null,
  btnSpeakPa: null,
  
  // Metrics Numbers
  metricGateWait: null,
  metricActiveIncidents: null,
  metricEcoPoints: null
};

// Language translations library for UI and bot localization simulation
const TRANSLATIONS = {
  en: {
    welcome: "Welcome to BC Place! I am your GenAI Tournament Assistant. How can I help you today? Ask me about gates, accessibility, concessions, transport, or stadium guidelines.",
    typing: "AI is thinking...",
    dispatchSuccess: "Volunteer successfully dispatched!",
    actionDrawRoute: "Show route on map",
    incidentLogged: "New incident logged and routed to GenAI Copilot.",
    speechOff: "Voice guidance disabled",
    speechOn: "Voice guidance enabled. I will read responses aloud."
  },
  es: {
    welcome: "¡Bienvenido a BC Place! Soy su Asistente de Torneos GenAI. ¿Cómo puedo ayudarle hoy? Pregúnteme sobre puertas, accesibilidad, concesiones, transporte o pautas del estadio.",
    typing: "La IA está pensando...",
    dispatchSuccess: "¡Voluntario enviado con éxito!",
    actionDrawRoute: "Ver ruta en mapa",
    incidentLogged: "Nuevo incidente registrado y enviado al Copiloto GenAI.",
    speechOff: "Guía de voz desactivada",
    speechOn: "Guía de voz activada. Leeré las respuestas en voz alta."
  },
  fr: {
    welcome: "Bienvenue à BC Place ! Je suis votre assistant de tournoi GenAI. Comment puis-je vous aider aujourd'hui ? Posez-moi des questions sur les portes, l'accessibilité, les concessions, les transports ou les directives du stade.",
    typing: "L'IA réfléchit...",
    dispatchSuccess: "Bénévole déployé avec succès !",
    actionDrawRoute: "Afficher l'itinéraire",
    incidentLogged: "Nouvel incident enregistré et acheminé au Copilote GenAI.",
    speechOff: "Guidage vocal désactivé",
    speechOn: "Guidage vocal activé. Je vais lire les réponses à haute voix."
  },
  pt: {
    welcome: "Bem-vindo ao BC Place! Eu sou o seu Assistente de Torneio GenAI. Como posso ajudar hoje? Pergunte-me sobre portões, acessibilidade, concessões, transporte ou regras do estádio.",
    typing: "A IA está pensando...",
    dispatchSuccess: "Voluntário enviado com sucesso!",
    actionDrawRoute: "Mostrar rota no mapa",
    incidentLogged: "Novo incidente registrado e encaminhado ao Copiloto GenAI.",
    speechOff: "Orientação de voz desativada",
    speechOn: "Orientação de voz ativada. Lerei as respostas em voz alta."
  },
  ar: {
    welcome: "مرحباً بكم في بي سي بليس! أنا مساعد البطولة الذكي (GenAI). كيف يمكنني مساعدتك اليوم؟ اسألني عن البوابات، أو إمكانية الوصول، أو المطاعم، أو النقل، أو إرشادات الاستاد.",
    typing: "الذكاء الاصطناعي يفكر...",
    dispatchSuccess: "تم إرسال المتطوع بنجاح!",
    actionDrawRoute: "عرض المسار على الخريطة",
    incidentLogged: "تم تسجيل الحادث الجديد وتوجيهه إلى مساعد العمليات الذكي.",
    speechOff: "تم إيقاف التوجيه الصوتي",
    speechOn: "تم تفعيل التوجيه الصوتي. سأقرأ الإجابات بصوت عالٍ."
  }
};

// Map Coordinates for path rendering (Schematic mapping)
const MAP_COORDINATES = {
  // Gates
  "Gate A": { x: 500, y: 120 },
  "Gate B": { x: 620, y: 220 },
  "Gate C": { x: 570, y: 350 },
  "Gate D": { x: 400, y: 390 },
  "Gate E": { x: 230, y: 290 },
  "Gate H": { x: 280, y: 140 },
  // Sections
  "Section 103": { x: 470, y: 170 },
  "Section 104": { x: 510, y: 190 },
  "Section 106": { x: 540, y: 220 },
  "Section 108": { x: 530, y: 260 },
  "Section 109": { x: 500, y: 300 },
  "Section 111": { x: 440, y: 330 },
  "Section 112": { x: 400, y: 320 },
  "Section 115": { x: 340, y: 300 },
  "Section 118": { x: 310, y: 230 },
  "Section 120": { x: 320, y: 190 },
  "Section 122": { x: 370, y: 170 },
  "Section 124": { x: 410, y: 160 },
  "Section 125": { x: 430, y: 150 }
};

// Initializer
document.addEventListener("DOMContentLoaded", () => {
  initDOMElements();
  initEventListeners();
  initApplicationState();
  
  // Render Map Overlay initial view
  renderLiveHeatmap();
  
  // Setup Welcome Bot Message
  simulateBotResponse(TRANSLATIONS[STATE.selectedLanguage].welcome);
});

// Setup DOM elements reference
function initDOMElements() {
  DOM.tabFan = document.getElementById("tab-fan");
  DOM.tabStaff = document.getElementById("tab-staff");
  DOM.viewFan = document.getElementById("view-fan");
  DOM.viewStaff = document.getElementById("view-staff");
  
  DOM.btnContrast = document.getElementById("btn-contrast");
  DOM.btnSpeech = document.getElementById("btn-speech");
  
  DOM.chatMessages = document.getElementById("chat-messages");
  DOM.chatInput = document.getElementById("chat-input");
  DOM.btnSend = document.getElementById("btn-send");
  DOM.langButtons = document.querySelectorAll(".lang-btn");
  
  DOM.mapSvg = document.getElementById("stadium-map-svg");
  DOM.mapOverlay = document.getElementById("map-overlay");
  DOM.overlayTitle = document.getElementById("overlay-title");
  DOM.overlayDetail = document.getElementById("overlay-detail");
  DOM.btnOverlayAction = document.getElementById("btn-overlay-action");
  
  DOM.incidentFeed = document.getElementById("incident-feed");
  DOM.btnLogIncident = document.getElementById("btn-log-incident");
  DOM.inputIncidentText = document.getElementById("incident-text");
  DOM.copilotResponse = document.getElementById("copilot-response");
  DOM.volunteersList = document.getElementById("volunteers-list");
  
  DOM.btnGeneratePa = document.getElementById("btn-generate-pa");
  DOM.inputPaText = document.getElementById("pa-text");
  DOM.selectPaLang = document.getElementById("pa-lang");
  DOM.paTranslationOutput = document.getElementById("pa-translation-output");
  DOM.btnSpeakPa = document.getElementById("btn-speak-pa");
  
  DOM.metricGateWait = document.getElementById("metric-gate-wait");
  DOM.metricActiveIncidents = document.getElementById("metric-active-incidents");
  DOM.metricEcoPoints = document.getElementById("metric-eco-points");
}

// Setup Event Listeners
function initEventListeners() {
  // Tab Switching
  DOM.tabFan.addEventListener("click", () => switchTab('fan'));
  DOM.tabStaff.addEventListener("click", () => switchTab('staff'));
  
  // Accessibility switches
  DOM.btnContrast.addEventListener("click", toggleHighContrast);
  DOM.btnSpeech.addEventListener("click", toggleScreenReader);
  
  // Chat input
  DOM.btnSend.addEventListener("click", handleUserMessageSubmit);
  DOM.chatInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') handleUserMessageSubmit();
  });
  
  // Language selectors
  DOM.langButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      DOM.langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      changeLanguage(btn.dataset.lang);
    });
  });
  
  // Staff Incident reporting
  DOM.btnLogIncident.addEventListener("click", handleStaffIncidentSubmit);
  DOM.inputIncidentText.addEventListener("input", analyzeIncidentRealtime);
  
  // PA Translation
  DOM.btnGeneratePa.addEventListener("click", generatePaTranslation);
  DOM.btnSpeakPa.addEventListener("click", playPaAudio);
  
  // Map interactions (delegation)
  DOM.mapSvg.addEventListener("click", handleMapClick);

  // Transit select
  document.querySelectorAll(".transit-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".transit-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      calculateEcoImpact(card.dataset.transit);
    });
  });
}

// Initialize state-related items
function initApplicationState() {
  STATE.volunteers = JSON.parse(JSON.stringify(STADIUM_DATA.volunteers));
  updateStaffDashboard();
}

// Switching between Fan and Staff view tabs
function switchTab(tabName) {
  STATE.currentTab = tabName;
  if (tabName === 'fan') {
    DOM.tabFan.classList.add('active');
    DOM.tabStaff.classList.remove('active');
    DOM.viewFan.classList.add('active');
    DOM.viewStaff.classList.remove('active');
  } else {
    DOM.tabFan.classList.remove('active');
    DOM.tabStaff.classList.add('active');
    DOM.viewFan.classList.remove('active');
    DOM.viewStaff.classList.add('active');
    updateStaffDashboard(); // Refresh metrics and lists
  }
  showToast(`Switched to ${tabName === 'fan' ? 'Fan Experience Portal' : 'Operations Command Center'}`);
}

// Toast Notifications Helper
function showToast(message, type = 'success') {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✔' : type === 'warning' ? '⚠' : 'ℹ'} ${message}</span>
  `;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = "slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) reverse forwards";
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

// Accessibility: Contrast Settings
function toggleHighContrast() {
  STATE.highContrastMode = !STATE.highContrastMode;
  if (STATE.highContrastMode) {
    document.body.classList.add('high-contrast');
    DOM.btnContrast.style.borderColor = "var(--color-primary)";
    showToast("High contrast mode active", "warning");
  } else {
    document.body.classList.remove('high-contrast');
    DOM.btnContrast.style.borderColor = "var(--border-color)";
    showToast("Standard colors restored");
  }
}

// Accessibility: Screen Reader TTS Simulation
function toggleScreenReader() {
  STATE.textToSpeechEnabled = !STATE.textToSpeechEnabled;
  if (STATE.textToSpeechEnabled) {
    DOM.btnSpeech.style.borderColor = "var(--color-primary)";
    DOM.btnSpeech.innerHTML = "🔊";
    showToast(TRANSLATIONS[STATE.selectedLanguage].speechOn);
    speakUtterance(TRANSLATIONS[STATE.selectedLanguage].speechOn, STATE.selectedLanguage);
  } else {
    DOM.btnSpeech.style.borderColor = "var(--border-color)";
    DOM.btnSpeech.innerHTML = "🔇";
    showToast(TRANSLATIONS[STATE.selectedLanguage].speechOff, "warning");
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

// Speak text utility using web speech API
function speakUtterance(text, langCode) {
  if (!STATE.textToSpeechEnabled || !window.speechSynthesis) return;
  
  // Cancel active reading
  window.speechSynthesis.cancel();
  
  const cleanText = text.replace(/🚨|✔|⚠|ℹ/g, ''); // strip emojis for smoother speech
  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  // Select appropriate speech synthesis language code
  if (langCode === 'es') utterance.lang = 'es-ES';
  else if (langCode === 'fr') utterance.lang = 'fr-FR';
  else if (langCode === 'pt') utterance.lang = 'pt-PT';
  else if (langCode === 'ar') utterance.lang = 'ar-AE';
  else utterance.lang = 'en-US';
  
  window.speechSynthesis.speak(utterance);
}

// Switch UI language
function changeLanguage(langCode) {
  STATE.selectedLanguage = langCode;
  showToast(`Language set to ${langCode.toUpperCase()}`);
  
  // Update UI headings & labels based on selected language
  // Add quick notification and reload bot message
  simulateBotResponse(TRANSLATIONS[langCode].welcome);
}

/* ==========================================================================
   GENAI ASSISTANT CHATBOT LOGIC
   ========================================================================== */

function handleUserMessageSubmit() {
  const query = DOM.chatInput.value.trim();
  if (!query) return;
  
  // Add to Chat view
  appendChatMessage(query, 'user');
  DOM.chatInput.value = '';
  
  // Trigger AI typing
  const typingId = appendChatTypingIndicator();
  
  setTimeout(() => {
    // Remove typing indicator and yield answer
    removeChatTypingIndicator(typingId);
    
    // GenAI response logic
    const answer = generateGenAIResponse(query);
    appendChatMessage(answer.text, 'bot', answer.cards);
    
    // Speak response if accessibility speaker active
    speakUtterance(answer.text, STATE.selectedLanguage);
  }, 900);
}

function appendChatMessage(text, sender, cards = []) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  
  // Safe HTML render (convert markdown-like lists & bold statements)
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
  
  msgDiv.innerHTML = html;
  
  // Render cards/actions
  if (cards.length > 0) {
    cards.forEach(card => {
      const cardDiv = document.createElement("div");
      cardDiv.className = "chat-card";
      
      const titleDiv = document.createElement("div");
      titleDiv.className = "chat-card-title";
      titleDiv.innerHTML = `⭐ ${card.title}`;
      cardDiv.appendChild(titleDiv);
      
      if (card.content) {
        const contentDiv = document.createElement("div");
        contentDiv.className = "chat-card-content";
        contentDiv.innerText = card.content;
        cardDiv.appendChild(contentDiv);
      }
      
      if (card.actions) {
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "chat-actions";
        
        card.actions.forEach(action => {
          const actBtn = document.createElement("button");
          actBtn.className = "btn-chat-action";
          actBtn.innerText = action.label;
          actBtn.onclick = () => handleChatActionClick(action);
          actionsDiv.appendChild(actBtn);
        });
        cardDiv.appendChild(actionsDiv);
      }
      
      msgDiv.appendChild(cardDiv);
    });
  }
  
  DOM.chatMessages.appendChild(msgDiv);
  DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
}

function appendChatTypingIndicator() {
  const indicator = document.createElement("div");
  indicator.className = "message bot typing-indicator-wrapper";
  indicator.id = "typing-" + Date.now();
  indicator.innerHTML = `
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  DOM.chatMessages.appendChild(indicator);
  DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
  return indicator.id;
}

function removeChatTypingIndicator(id) {
  const indicator = document.getElementById(id);
  if (indicator) indicator.remove();
}

function simulateBotResponse(text) {
  const typingId = appendChatTypingIndicator();
  setTimeout(() => {
    removeChatTypingIndicator(typingId);
    appendChatMessage(text, 'bot');
    speakUtterance(text, STATE.selectedLanguage);
  }, 400);
}

// Generate contextual AI response based on queries
function generateGenAIResponse(query) {
  const normalized = query.toLowerCase();
  let text = "";
  let cards = [];
  
  // 1. Accessibility & Safety Match
  let match = STADIUM_DATA.knowledgeBase.intents.find(intent => 
    intent.keywords.some(kw => normalized.includes(kw))
  );
  
  if (match) {
    text = match.response;
  } else {
    // Generative fallback simulation
    text = `I've analyzed your query regarding *"${query}"*. According to the FIFA World Cup 2026 stadium guidelines, you can obtain details about transport alternatives, ticket requirements, concession stands, or first aid. Could you specify which area you need assistance with?`;
  }
  
  // Translate text if language is non-English
  if (STATE.selectedLanguage !== 'en') {
    text = simulateMachineTranslation(text, STATE.selectedLanguage);
  }
  
  // 2. Location Context extraction for interactive map integrations
  // Scan for sections
  const secRegex = /section\s*(\d+)/i;
  const secMatch = normalized.match(secRegex);
  if (secMatch) {
    const secNum = secMatch[1];
    const secKey = `Section ${secNum}`;
    if (MAP_COORDINATES[secKey]) {
      cards.push({
        title: `Map Navigation: ${secKey}`,
        content: `Would you like me to draw the direct route to Section ${secNum} from the closest gate?`,
        actions: [
          { type: 'navigate', destination: secKey, label: TRANSLATIONS[STATE.selectedLanguage].actionDrawRoute }
        ]
      });
    }
  }
  
  // Scan for gates
  const gateRegex = /gate\s*([a-h])/i;
  const gateMatch = normalized.match(gateRegex);
  if (gateMatch) {
    const gateLetter = gateMatch[1].toUpperCase();
    const gateKey = `Gate ${gateLetter}`;
    if (MAP_COORDINATES[gateKey]) {
      cards.push({
        title: `Gate Details: ${gateKey}`,
        content: `Wait times for Gate ${gateLetter} are currently updated. Check map routing.`,
        actions: [
          { type: 'focus_gate', destination: gateKey, label: `Locate Gate ${gateLetter}` }
        ]
      });
    }
  }

  // Scan for concession food terms (e.g. vegan, burger, taco)
  if (normalized.includes('vegan') || normalized.includes('gluten') || normalized.includes('vegetarian')) {
    cards.push({
      title: "Healthy & Dietary Concessions",
      content: "Here are the top GenAI matching concessions nearby with short lines:",
      actions: [
        { type: 'concession', item: 'c1', label: "Pacific Rim Bistro (Sec 103)" },
        { type: 'concession', item: 'c4', label: "Green Field Salads (Sec 109)" }
      ]
    });
  }
  
  return { text, cards };
}

// Mini simulated translator utility for language settings
function simulateMachineTranslation(text, targetLang) {
  // Simple map mapping standard queries to translated snippets for premium feel
  if (targetLang === 'es') {
    if (text.includes("Gate H")) {
      return "BC Place ofrece soporte de accesibilidad. La Puerta H (Noroeste) es nuestra Entrada de Acceso Prioritario dedicada. Los ascensores están en las Secciones 106 y 125. Todas las comodidades son accesibles.";
    }
    if (text.includes("concession")) {
      return "¡Tenemos múltiples opciones de comida! Para opciones veganas y sin gluten, visite Pacific Rim Bistro (Sec 103) o Green Field Salads (Sec 109). Disfrute del partido.";
    }
    if (text.includes("Expo Line")) {
      return "¡FIFA 2026 recomienda el transporte público! El SkyTrain Expo Line es la opción de mayor capacidad y la más ecológica. Contamos con un Valet de Bicicletas en la Puerta C.";
    }
    return `[Traducido] Entendido. Con respecto a su consulta sobre "${text.substring(0, 30)}...", le informamos que puede consultar rutas, puestos de comida y políticas del estadio aquí.`;
  }
  
  if (targetLang === 'fr') {
    if (text.includes("Gate H")) {
      return "BC Place propose une assistance complète. La porte H (Nord-Ouest) est notre entrée d'accès prioritaire dédiée. Les ascenseurs sont situés aux sections 106 et 125.";
    }
    if (text.includes("concession")) {
      return "Plusieurs concessions sont disponibles ! Pour le végétalien ou sans gluten, visitez le Pacific Rim Bistro (Sec 103) ou Green Field Salads (Sec 109).";
    }
    return `[Traduit] Je comprends. Concernant "${text.substring(0, 30)}...", vous pouvez vérifier l'itinéraire de navigation, les options de restauration et les politiques de sécurité.`;
  }

  if (targetLang === 'ar') {
    return "🚨 [مترجم] أهلاً بك. استفسارك يقع ضمن إرشادات الاستاد. يمكنك الاستعلام عن البوابات وإمكانية الوصول والمطاعم والنقل لبطولة كأس العالم 2026.";
  }
  
  return text; // fallback
}

// Action click handler inside chatbot responses
function handleChatActionClick(action) {
  if (action.type === 'navigate') {
    drawNavigationPath("Gate A", action.destination);
    showToast(`Path drawn to ${action.destination}`);
  } else if (action.type === 'focus_gate') {
    focusMapFeature(action.destination);
    showToast(`Focused on ${action.destination}`);
  } else if (action.type === 'concession') {
    focusMapFeature(`Section 103`); // focus concession section
    showToast(`Showing Concession Info at Section 103`);
  }
}

/* ==========================================================================
   INTERACTIVE MAP RENDERING & CONTROLS
   ========================================================================== */

// Draw heatmap indicators overlay
function renderLiveHeatmap() {
  // Let's programmatically add/update colored density dots
  const heatmapLayer = document.getElementById("heatmap-layer");
  heatmapLayer.innerHTML = '';
  
  STADIUM_DATA.gates.forEach(gate => {
    const coords = MAP_COORDINATES[`Gate ${gate.id}`];
    if (!coords) return;
    
    // Choose color based on crowdedness
    let color = 'var(--color-success)';
    if (gate.crowdedness === 'High') color = 'var(--color-danger)';
    else if (gate.crowdedness === 'Medium') color = 'var(--color-warning)';
    
    heatmapLayer.appendChild(createHeatmapPin(coords.x, coords.y, color, `Gate ${gate.id}`));
  });
  
  // Add some section crowd densities
  const hotSections = [
    { name: "Section 104", level: "High" },
    { name: "Section 112", level: "Medium" },
    { name: "Section 124", level: "Low" }
  ];
  
  hotSections.forEach(sec => {
    const coords = MAP_COORDINATES[sec.name];
    if (!coords) return;
    
    let color = 'var(--color-success)';
    if (sec.level === 'High') color = 'var(--color-danger)';
    else if (sec.level === 'Medium') color = 'var(--color-warning)';
    
    heatmapLayer.appendChild(createHeatmapPin(coords.x, coords.y, color, sec.name));
  });
}

function createHeatmapPin(x, y, color, label) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("class", "map-node");
  group.setAttribute("transform", `translate(${x}, ${y})`);
  group.setAttribute("data-label", label);
  
  // Pulsing circle background
  const pulse = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  pulse.setAttribute("r", "14");
  pulse.setAttribute("fill", color);
  pulse.setAttribute("opacity", "0.3");
  pulse.setAttribute("class", "pulse-ring");
  group.appendChild(pulse);
  
  // Solid center pin
  const pin = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  pin.setAttribute("r", "6");
  pin.setAttribute("fill", color);
  pin.setAttribute("stroke", "#ffffff");
  pin.setAttribute("stroke-width", "1.5");
  group.appendChild(pin);
  
  return group;
}

// Map Click Routing
function handleMapClick(e) {
  // Find clicked node or seating section path
  const target = e.target;
  let label = null;
  
  // Check if click was on a dynamic node
  const node = target.closest(".map-node");
  if (node) {
    label = node.getAttribute("data-label");
  } else if (target.classList.contains("seating-section")) {
    label = target.getAttribute("id");
  }
  
  if (label) {
    focusMapFeature(label);
  }
}

// Focusing a particular gate, section or amenity
function focusMapFeature(label) {
  STATE.selectedMapFeature = label;
  
  // Style highlight selected node/section in Map UI
  // Locate properties
  let title = label;
  let description = "";
  
  if (label.startsWith("Gate")) {
    const id = label.split(" ")[1];
    const gateInfo = STADIUM_DATA.gates.find(g => g.id === id);
    if (gateInfo) {
      description = `Location: ${gateInfo.location} side | Current Line Wait: **${gateInfo.waitTime}** (${gateInfo.crowdedness} Density) | Accessible Gate: ${gateInfo.accessible ? 'Yes' : 'No'}`;
    }
  } else if (label.startsWith("Section")) {
    const secNum = label.split(" ")[1];
    const concession = STADIUM_DATA.concessions.find(c => c.section === secNum);
    const restroom = STADIUM_DATA.amenities.find(a => a.type === 'restroom' && a.section === secNum);
    const aid = STADIUM_DATA.amenities.find(a => a.type === 'first_aid' && a.section === secNum);
    const elevator = STADIUM_DATA.amenities.find(a => a.type === 'elevator' && a.section === secNum);
    
    description = `Capacity: 450 seats | Crowd Status: Normal. `;
    if (concession) description += `<br>🍔 Food nearby: **${concession.name}** (Wait time: ${concession.waitTime})`;
    if (restroom) description += `<br>🚻 Amenity: Wheelchair accessible restroom available here.`;
    if (aid) description += `<br>🚨 Emergency: nurse-on-duty First Aid Station.`;
    if (elevator) description += `<br>♿ Lift access point.`;
  }
  
  // Show in bottom slider panel
  DOM.overlayTitle.innerText = title;
  DOM.overlayDetail.innerHTML = description;
  DOM.mapOverlay.classList.add("visible");
  
  // Configure action route button
  DOM.btnOverlayAction.onclick = () => {
    // If it's a section, navigate from Gate A
    if (label.startsWith("Section")) {
      drawNavigationPath("Gate A", label);
    } else {
      // If it's a gate, draw path from Gate to central zone
      drawNavigationPath(label, "Section 112");
    }
    showToast(`Routing activated to ${label}`);
  };
}

// Rendering navigation path onto SVG map
function drawNavigationPath(startLabel, endLabel) {
  const start = MAP_COORDINATES[startLabel];
  const end = MAP_COORDINATES[endLabel];
  
  if (!start || !end) return;
  
  const path = document.getElementById("navigation-route-path");
  
  // Generate curve data (curved path looks more premium than simple straight lines)
  const mx = (start.x + end.x) / 2;
  const my = (start.y + end.y) / 2 - 40; // curve upwards
  const dAttr = `M ${start.x} ${start.y} Q ${mx} ${my} ${end.x} ${end.y}`;
  
  path.setAttribute("d", dAttr);
  path.style.display = "block";
  
  // Add start and end points highlight
  let startMarker = document.getElementById("route-start");
  let endMarker = document.getElementById("route-end");
  
  startMarker.setAttribute("cx", start.x);
  startMarker.setAttribute("cy", start.y);
  startMarker.style.display = "block";
  
  endMarker.setAttribute("cx", end.x);
  endMarker.setAttribute("cy", end.y);
  endMarker.style.display = "block";
  
  STATE.activeNavigationPath = { start: startLabel, end: endLabel };
}

/* ==========================================================================
   TRANSIT & SUSTAINABILITY (ECO-PLANNER)
   ========================================================================== */

function calculateEcoImpact(transitId) {
  const opt = STADIUM_DATA.transitOptions.find(o => o.id === transitId);
  if (!opt) return;
  
  const co2Number = parseFloat(opt.co2Saved);
  
  // Update state eco scorecard
  DOM.metricEcoPoints.innerText = `+${Math.round(co2Number * 10)} Eco`;
  
  // Generate random eco recommendation from AI
  const randomTip = STADIUM_DATA.sustainabilityScorecard.ecoTips[
    Math.floor(Math.random() * STADIUM_DATA.sustainabilityScorecard.ecoTips.length)
  ];
  
  const co2SavedTotal = (STADIUM_DATA.sustainabilityScorecard.currentCo2Reduction + co2Number).toLocaleString();
  
  // Update Display
  const ecoDisplay = document.getElementById("eco-display-results");
  ecoDisplay.innerHTML = `
    <div class="eco-impact-display">
      <div class="eco-icon-container">🌱</div>
      <div class="eco-stats-text">
        <h4>${opt.name} selected!</h4>
        <p>You saved **${opt.co2Saved}** of carbon compared to driving. Total stadium reduction: **${co2SavedTotal} kg CO2**.</p>
        <p style="margin-top: 6px; color: var(--color-accent); font-size: 0.78rem;">💡 GenAI Green Tip: ${randomTip}</p>
      </div>
    </div>
  `;
  
  showToast(`Transport planned via ${opt.name}! Carbon saved: ${opt.co2Saved}.`);
}

/* ==========================================================================
   OPERATIONS COMMAND CENTER (STAFF PORTAL) LOGIC
   ========================================================================== */

// Simulated AI Real-time Incident Parser
function analyzeIncidentRealtime() {
  const text = DOM.inputIncidentText.value.trim();
  if (text.length < 5) {
    DOM.copilotResponse.innerHTML = `<div class="copilot-body">Awaiting staff report input... GenAI Copilot will automatically analyze severity, type, and assign resources.</div>`;
    return;
  }
  
  // Simple AI Parsing logic
  let category = "General Maintenance";
  let severity = "Low";
  let color = "var(--color-primary)";
  let assignedVol = "None";
  
  const textLower = text.toLowerCase();
  
  if (textLower.includes("spill") || textLower.includes("water") || textLower.includes("cleaning") || textLower.includes("leak")) {
    category = "Cleaning/Sanitation";
    severity = "Low";
    if (textLower.includes("large") || textLower.includes("flooding")) {
      severity = "Medium";
    }
  } else if (textLower.includes("hurt") || textLower.includes("medical") || textLower.includes("heart") || textLower.includes("fainted") || textLower.includes("injury")) {
    category = "Medical Emergency";
    severity = "High";
    color = "var(--color-danger)";
  } else if (textLower.includes("fight") || textLower.includes("security") || textLower.includes("stole") || textLower.includes("suspect") || textLower.includes("rowdy")) {
    category = "Security Issue";
    severity = "High";
    color = "var(--color-danger)";
  } else if (textLower.includes("bottleneck") || textLower.includes("crowd") || textLower.includes("jam") || textLower.includes("crush")) {
    category = "Crowd Management";
    severity = "Medium";
    color = "var(--color-warning)";
    if (textLower.includes("stamped") || textLower.includes("gate blocked")) {
      severity = "High";
    }
  }

  // Find nearest available volunteer
  // Choose volunteer with best fit zone
  let volFit = STATE.volunteers.find(v => v.status === "Available") || STATE.volunteers[0];
  
  DOM.copilotResponse.innerHTML = `
    <div class="copilot-header">🤖 GenAI Command Copilot Analysis</div>
    <div class="copilot-body">
      <p>💡 **Incident Categorization:** <span style="color:${color}">${category}</span></p>
      <p>⚠️ **Severity Level:** **${severity}**</p>
      <p>👤 **AI Recommended Resource:** **${volFit.name}** (${volFit.zone}, speaks ${volFit.languages.join(', ')})</p>
      <p style="margin-top: 6px; font-style: italic; color: var(--text-main);">Copilot Action: Dispatching ${volFit.name} immediately will resolve the response within 4 minutes.</p>
    </div>
  `;
}

function handleStaffIncidentSubmit() {
  const text = DOM.inputIncidentText.value.trim();
  if (!text) return;
  
  // Calculate classification
  const textLower = text.toLowerCase();
  let category = "Maintenance";
  let severity = "Low";
  
  if (textLower.includes("spill") || textLower.includes("water") || textLower.includes("cleaning")) {
    category = "Cleaning";
  } else if (textLower.includes("hurt") || textLower.includes("medical") || textLower.includes("injury")) {
    category = "Medical";
    severity = "High";
  } else if (textLower.includes("security") || textLower.includes("fight")) {
    category = "Security";
    severity = "High";
  } else if (textLower.includes("crowd") || textLower.includes("jam")) {
    category = "Crowd Control";
    severity = "Medium";
  }
  
  // Find volunteer to dispatch
  let volToDispatch = STATE.volunteers.find(v => v.status === "Available");
  let volName = "None";
  if (volToDispatch) {
    volToDispatch.status = "Dispatched";
    volName = volToDispatch.name;
  }
  
  // Create incident object
  const newInc = {
    id: "inc-" + Date.now(),
    title: text,
    section: textLower.includes("gate") ? "Gate E" : "104", // default layout zones
    category: category,
    severity: severity,
    status: "Active",
    assignedTo: volName,
    time: "Just now"
  };
  
  STATE.incidents.unshift(newInc);
  DOM.inputIncidentText.value = '';
  DOM.copilotResponse.innerHTML = `<div class="copilot-body">Awaiting staff report input... GenAI Copilot will automatically analyze severity, type, and assign resources.</div>`;
  
  // Refresh view
  updateStaffDashboard();
  showToast(TRANSLATIONS[STATE.selectedLanguage].incidentLogged);
  
  // Draw marker on map for staff awareness
  addStaffMapIncidentMarker(newInc.section, severity);
}

function addStaffMapIncidentMarker(section, severity) {
  const coords = MAP_COORDINATES[section] || MAP_COORDINATES["Section 104"];
  const heatmapLayer = document.getElementById("heatmap-layer");
  
  // Draw pulsing red alarm triangle / circle
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("transform", `translate(${coords.x}, ${coords.y})`);
  group.setAttribute("class", "map-node");
  group.setAttribute("id", "incident-marker-" + Date.now());
  
  const pulse = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  pulse.setAttribute("r", "20");
  pulse.setAttribute("fill", "var(--color-danger)");
  pulse.setAttribute("opacity", "0.4");
  pulse.setAttribute("class", "pulse-ring");
  group.appendChild(pulse);
  
  const center = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  center.setAttribute("points", "0,-8 -7,6 7,6");
  center.setAttribute("fill", "var(--color-danger)");
  center.setAttribute("stroke", "#ffffff");
  center.setAttribute("stroke-width", "1");
  group.appendChild(center);
  
  heatmapLayer.appendChild(group);
}

function resolveIncident(incId) {
  const inc = STATE.incidents.find(i => i.id === incId);
  if (!inc) return;
  
  inc.status = "Resolved";
  
  // Free volunteer if assigned
  if (inc.assignedTo !== "None") {
    const vol = STATE.volunteers.find(v => v.name === inc.assignedTo);
    if (vol) vol.status = "Available";
  }
  
  updateStaffDashboard();
  showToast(`Incident "${inc.title.substring(0, 20)}..." marked as resolved!`);
}

function updateStaffDashboard() {
  // Update numbers
  const activeCount = STATE.incidents.filter(i => i.status === "Active").length;
  DOM.metricActiveIncidents.innerText = activeCount;
  DOM.metricGateWait.innerText = "12 mins"; // average gate lines
  
  // Render active incidents list
  DOM.incidentFeed.innerHTML = '';
  if (STATE.incidents.length === 0) {
    DOM.incidentFeed.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted);">No active incidents. Good job!</div>`;
  } else {
    STATE.incidents.forEach(inc => {
      const item = document.createElement("div");
      item.className = "incident-item";
      
      const badgeClass = inc.severity === 'High' ? 'badge-high' : inc.severity === 'Medium' ? 'badge-medium' : 'badge-low';
      const resolvedBtnHtml = inc.status === 'Active' 
        ? `<button class="btn-action-sm" onclick="resolveIncident('${inc.id}')">Resolve</button>`
        : `<span style="color:var(--color-success); font-weight:bold;">Resolved ✓</span>`;
      
      item.innerHTML = `
        <div class="incident-info">
          <div style="display:flex; gap:8px; align-items:center;">
            <span class="incident-badge ${badgeClass}">${inc.category}</span>
            <span style="color:var(--text-muted); font-size:0.75rem;">${inc.time}</span>
          </div>
          <div style="font-weight:600; margin-top:4px;">${inc.title}</div>
          <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;">Location: Section ${inc.section} | Assigned to: ${inc.assignedTo}</div>
        </div>
        <div>
          ${resolvedBtnHtml}
        </div>
      `;
      DOM.incidentFeed.appendChild(item);
    });
  }
  
  // Render volunteer columns
  DOM.volunteersList.innerHTML = '';
  STATE.volunteers.forEach(vol => {
    const row = document.createElement("div");
    row.className = "volunteer-row";
    
    let statusClass = 'available';
    if (vol.status === 'Busy') statusClass = 'busy';
    else if (vol.status === 'Dispatched') statusClass = 'dispatched';
    
    row.innerHTML = `
      <div class="vol-profile">
        <span class="vol-avatar">${vol.avatar}</span>
        <div class="vol-details">
          <h5>${vol.name}</h5>
          <div class="vol-languages">🗣️ ${vol.languages.join(', ')}</div>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:0.72rem; color:var(--text-muted);">${vol.zone}</span>
        <span class="vol-status-badge ${statusClass}">${vol.status}</span>
      </div>
    `;
    DOM.volunteersList.appendChild(row);
  });
}

/* ==========================================================================
   PA ANNOUNCEMENT MULTILINGUAL TRANSLATOR
   ========================================================================== */

function generatePaTranslation() {
  const text = DOM.inputPaText.value.trim();
  const lang = DOM.selectPaLang.value;
  
  if (!text) {
    DOM.paTranslationOutput.innerText = "Please write a PA announcement in English first.";
    return;
  }
  
  // AI translation mock definitions based on stadium warning patterns
  let translation = "";
  if (lang === 'es') {
    translation = `[PA ANNOUNCEMENT ESPAÑOL]\nAtención todos los espectadores. ${translateTextToSpanish(text)}`;
  } else if (lang === 'fr') {
    translation = `[PA ANNOUNCEMENT FRANÇAIS]\nAttention à tous les spectateurs. ${translateTextToFrench(text)}`;
  } else if (lang === 'pt') {
    translation = `[PA ANNOUNCEMENT PORTUGUÊS]\nAtenção todos os espectadores. ${translateTextToPortuguese(text)}`;
  } else if (lang === 'ar') {
    translation = `[PA ANNOUNCEMENT ARABIC]\nانتباه لجميع المشجعين. ${translateTextToArabic(text)}`;
  }
  
  DOM.paTranslationOutput.innerHTML = `<strong>Translated Announcement:</strong><br>${translation.replace(/\n/g, '<br>')}`;
  DOM.btnSpeakPa.style.display = "block";
  showToast(`PA Translated to ${lang.toUpperCase()} by GenAI.`);
}

function playPaAudio() {
  const outputText = DOM.paTranslationOutput.innerText;
  const lang = DOM.selectPaLang.value;
  
  if (!outputText || outputText.includes("Please write")) return;
  
  // Extract text body without title
  const cleanBody = outputText.replace(/Translated Announcement:|\[PA ANNOUNCEMENT.*?\]/g, '').trim();
  
  // Run TTS simulation using accessibility speech engine
  // Temporarily force speech to hear it
  const origSpeechState = STATE.textToSpeechEnabled;
  STATE.textToSpeechEnabled = true;
  
  speakUtterance(cleanBody, lang);
  
  STATE.textToSpeechEnabled = origSpeechState;
  showToast("Playing translated audio broadcast over stadium speakers.");
}

// Sub-translators helper functions for operations warnings
function translateTextToSpanish(text) {
  let low = text.toLowerCase();
  if (low.includes("gate e") && low.includes("close")) {
    return "La puerta E está cerrada temporalmente debido a la congestión. Por favor, diríjase a la puerta H para el acceso prioritario.";
  }
  if (low.includes("spill") || low.includes("slip")) {
    return "Se ha reportado una zona resbaladiza. Por favor, camine con cuidado en el área del corredor principal.";
  }
  return "Esta es una transmisión oficial de la Copa Mundial de la FIFA 2026 para la seguridad de todos.";
}

function translateTextToFrench(text) {
  let low = text.toLowerCase();
  if (low.includes("gate e") && low.includes("close")) {
    return "La porte E est temporairement fermée en raison de l'affluence. Veuillez vous rendre à la porte H pour un accès prioritaire.";
  }
  return "Il s'agit d'une diffusion officielle de la Coupe du Monde de la FIFA 2026.";
}

function translateTextToPortuguese(text) {
  let low = text.toLowerCase();
  if (low.includes("gate e") && low.includes("close")) {
    return "O portão E está temporariamente fechado devido ao congestionamento. Por favor, dirija-se ao portão H para entrada prioritária.";
  }
  return "Esta é uma transmissão oficial da Copa do Mundo da FIFA 2026 para sua segurança.";
}

function translateTextToArabic(text) {
  return "يرجى العلم أن البوابة (E) مغلقة مؤقتاً بسبب الازدحام. يرجى التوجه إلى البوابة (H) للدخول السريع.";
}
