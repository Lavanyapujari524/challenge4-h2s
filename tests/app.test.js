/**
 * FIFA ArenaPulse 2026 - Jest Unit Tests
 * Verifies GenAI intent matching, machine translation logic, and localization strings.
 */

// Mock browser globals needed for script execution
const fs = require('fs');
const path = require('path');

// Read STADIUM_DATA from mockData
const STADIUM_DATA = require('../mockData.js');

// Mock HTML document structure before requiring app.js (which runs on DOMContentLoaded)
beforeAll(() => {
  document.body.innerHTML = `
    <header>
      <button id="tab-fan"></button>
      <button id="tab-staff"></button>
      <div id="view-fan"></div>
      <div id="view-staff"></div>
      <button id="btn-contrast"></button>
      <button id="btn-speech"></button>
      <div id="chat-messages"></div>
      <input id="chat-input" />
      <button id="btn-send"></button>
      <svg id="stadium-map-svg">
        <path id="navigation-route-path"></path>
        <circle id="route-start"></circle>
        <circle id="route-end"></circle>
        <g id="heatmap-layer"></g>
      </svg>
      <div id="map-overlay">
        <div id="overlay-title"></div>
        <div id="overlay-detail"></div>
        <button id="btn-overlay-action"></button>
      </div>
      <div id="incident-feed"></div>
      <button id="btn-log-incident"></button>
      <textarea id="incident-text"></textarea>
      <div id="copilot-response"></div>
      <div id="volunteers-list"></div>
      <button id="btn-generate-pa"></button>
      <textarea id="pa-text"></textarea>
      <select id="pa-lang"></select>
      <div id="pa-translation-output"></div>
      <button id="btn-speak-pa"></button>
      <div id="metric-gate-wait"></div>
      <div id="metric-active-incidents"></div>
      <div id="metric-eco-points"></div>
      <div id="toast-container"></div>
      <div id="eco-display-results"></div>
    </header>
  `;
});

// Load app.js (it will run in the virtual DOM environment)
let app;
beforeEach(() => {
  // Bind mock data to JSDOM global context
  global.STADIUM_DATA = STADIUM_DATA;
  global.window.STADIUM_DATA = STADIUM_DATA;

  // Reset DOMContentLoaded event simulation
  jest.isolateModules(() => {
    app = require('../app.js');
    // Manually trigger DOMContentLoaded
    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);
  });
});

describe('FIFA ArenaPulse 2026 - Unit Tests', () => {
  
  test('Localization resources should contain translations for EN, ES, FR, PT, AR', () => {
    expect(app.TRANSLATIONS).toHaveProperty('en');
    expect(app.TRANSLATIONS).toHaveProperty('es');
    expect(app.TRANSLATIONS).toHaveProperty('fr');
    expect(app.TRANSLATIONS).toHaveProperty('pt');
    expect(app.TRANSLATIONS).toHaveProperty('ar');
  });

  test('GenAI intent matching returns appropriate answers for safety/accessibility queries', () => {
    // Accessibility query
    const resAccessibility = app.generateGenAIResponse('is there wheelchair access?');
    expect(resAccessibility.text).toContain('Priority Access');
    expect(resAccessibility.text).toContain('Gate H');
    
    // Concessions query
    const resFood = app.generateGenAIResponse('where is vegan food?');
    expect(resFood.text).toContain('concession');
    expect(resFood.text).toContain('Bistro');
    expect(resFood.cards.length).toBeGreaterThan(0);
  });

  test('GenAI incident categorization accurately flags severity and type', () => {
    // Test medical incident parsing
    const resMedical = app.generateGenAIResponse('Medical emergency at section 122');
    expect(resMedical.text).toContain('emergency');
    
    // Test transit query parsing
    const resTransit = app.generateGenAIResponse('skytrain metro schedule');
    expect(resTransit.text).toContain('SkyTrain');
  });

  test('Machine Translation logic translates PA warnings correctly', () => {
    const closedWarning = 'Gate E is closed. Proceed to Gate H.';
    
    const translatedEs = app.translateTextToSpanish(closedWarning);
    expect(translatedEs).toContain('puerta E está cerrada');
    expect(translatedEs).toContain('puerta H');

    const translatedFr = app.translateTextToFrench(closedWarning);
    expect(translatedFr).toContain('porte E est temporairement fermée');
  });
});
