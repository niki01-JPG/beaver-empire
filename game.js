const SAVE_KEY = "beaver-empire-save-v1";

const RESOURCE_META = {
  food: { name: "Nahrung", color: "#f5c76b" },
  wood: { name: "Holz", color: "#d6a96a" },
  stone: { name: "Stein", color: "#b0bec7" },
  water: { name: "Wasser", color: "#7ec8ff" },
  knowledge: { name: "Wissen", color: "#8fa8ff" },
  renown: { name: "Ruhm", color: "#ffb36b" }
};

const BUILDINGS = {
  lodge: {
    name: "Biberhütte",
    description: "Mehr Schlafplätze und mehr Biber in der Kolonie.",
    cost: { wood: 15 },
    unlock: () => true,
    effect: (count) => ({ housing: count * 2 })
  },
  dam: {
    name: "Damm",
    description: "Staut Wasser und verbessert die Nahrungs- und Wasserproduktion.",
    cost: { wood: 22, stone: 8 },
    unlock: () => true,
    effect: (count) => ({ water: count * 0.7, food: count * 0.15 })
  },
  sawmill: {
    name: "Sägewerk",
    description: "Schnelleres Holzfällen und bessere Holzverarbeitung.",
    cost: { wood: 32, stone: 12 },
    unlock: () => true,
    effect: (count) => ({ wood: count * 1.5 })
  },
  quarry: {
    name: "Steinbruch",
    description: "Zugang zu hochwertigen Steinvorkommen für Infrastruktur.",
    cost: { wood: 28, stone: 6 },
    unlock: () => true,
    effect: (count) => ({ stone: count * 1.25 })
  },
  nursery: {
    name: "Kinderhort",
    description: "Kinder werden besser versorgt und die Kolonie wächst schneller.",
    cost: { wood: 22, food: 18 },
    unlock: () => true,
    effect: (count) => ({ babies: count * 3 })
  },
  workshop: {
    name: "Werkstatt",
    description: "Technische Geräte und Werkzeuge verbessern die Gesamtleistung.",
    cost: { wood: 42, stone: 20 },
    unlock: () => true,
    effect: (count) => ({ knowledge: count * 0.7, wood: count * 0.4 })
  },
  observatory: {
    name: "Beobachtungsplattform",
    description: "Forschungsbeobachtung bringt neue Einblicke in die Umwelt.",
    cost: { wood: 55, stone: 28, knowledge: 10 },
    unlock: () => true,
    effect: (count) => ({ knowledge: count * 1.4 })
  }
};

const JOBS = {
  forager: {
    name: "Sammler",
    description: "Sammelt Nahrung und Wasser in der Umgebung.",
    baseCost: { food: 0 }
  },
  lumberjack: {
    name: "Holzfäller",
    description: "Fällt Bäume und sammelt das wertvollste Baumaterial.",
    baseCost: { food: 0 }
  },
  builder: {
    name: "Bauleiter",
    description: "Errichtet Dämme, Hütten und Infrastruktur.",
    baseCost: { food: 0 }
  },
  researcher: {
    name: "Forscher",
    description: "Entwickelt neue Methoden und Erkenntnisse.",
    baseCost: { food: 0 }
  }
};

const TECHS = {
  gathering: {
    name: "Verbessertes Sammeln",
    cost: { wood: 18, food: 12 },
    description: "+50% Nahrung aus Sammelgängen.",
    effect: { foodMult: 1.5 }
  },
  carpentry: {
    name: "Zimmerkunst",
    cost: { wood: 35, knowledge: 8 },
    description: "+60% Holzproduktion und bessere Bauqualität.",
    effect: { woodMult: 1.6 }
  },
  masonry: {
    name: "Mauerwerk",
    cost: { wood: 40, stone: 18, knowledge: 12 },
    description: "+80% Steinproduktion.",
    effect: { stoneMult: 1.8 }
  },
  rivercontrol: {
    name: "Flusskontrolle",
    cost: { wood: 50, stone: 22, knowledge: 16 },
    description: "+100% Wasserproduktion und bessere Dämme.",
    effect: { waterMult: 2.0 }
  },
  ecology: {
    name: "Ökologische Balance",
    cost: { wood: 80, knowledge: 25 },
    description: "+50% Nahrung und weniger Zwänge bei Hochwasser.",
    effect: { foodMult: 1.5 }
  },
  industry: {
    name: "Industrieentwicklung",
    cost: { wood: 100, stone: 40, knowledge: 30 },
    description: "+70% Holz- und Steinproduktion.",
    effect: { woodMult: 1.7, stoneMult: 1.7 }
  }
};

const WEATHER = [
  { name: "Sonnenwetter", food: 1.1, water: 1.0 },
  { name: "Regen", food: 1.2, water: 1.4 },
  { name: "Niedriges Hochwasser", food: 1.0, water: 1.15 },
  { name: "Starker Sturm", food: 0.8, water: 1.25 },
  { name: "Frühlingsfluss", food: 1.25, water: 1.8 }
];

const defaultState = () => ({
  version: 1,
  lastTick: Date.now(),
  weatherIndex: 0,
  weatherTimer: 0,
  resources: {
    food: 30,
    wood: 18,
    stone: 4,
    water: 8,
    knowledge: 0,
    renown: 0
  },
  buildings: {
    lodge: 1,
    dam: 0,
    sawmill: 0,
    quarry: 0,
    nursery: 0,
    workshop: 0,
    observatory: 0
  },
  jobs: {
    forager: 0,
    lumberjack: 0,
    builder: 0,
    researcher: 0
  },
  population: {
    total: 1,
    free: 1,
    housing: 6
  },
  tech: {},
  log: [
    "Die erste Biberkolonie steht am Fluss. Die Zukunft wartet auf dich.",
    "Deine Biber träumen von einem großen Damm und einer grünen, sicheren Siedlung."
  ],
  prestige: {
    total: 0,
    best: 0
  }
});

const state = loadGame();

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const fresh = defaultState();
    return { ...fresh, ...parsed, resources: { ...fresh.resources, ...parsed.resources }, buildings: { ...fresh.buildings, ...parsed.buildings }, jobs: { ...fresh.jobs, ...parsed.jobs }, population: { ...fresh.population, ...parsed.population }, tech: parsed.tech || {}, log: parsed.log || fresh.log, prestige: { ...fresh.prestige, ...parsed.prestige } };
  } catch (error) {
    console.warn("Save konnte nicht geladen werden:", error);
    return defaultState();
  }
}

function saveGame() {
  try {
    state.lastTick = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Save konnte nicht gespeichert werden:", error);
  }
}

function addLog(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 8);
}

function getPopulationTotal() {
  const base = 1 + state.buildings.lodge * 2 + state.buildings.nursery * 3 + state.buildings.observatory * 1;
  return Math.max(1, base + state.prestige.total * 0.5);
}

function syncPopulation() {
  const total = getPopulationTotal();
  state.population.total = total;
  const assigned = Object.values(state.jobs).reduce((acc, value) => acc + value, 0);
  state.population.free = Math.max(0, total - assigned);
  const housing = 5 + state.buildings.lodge * 2 + state.buildings.nursery * 2 + state.buildings.dam * 2;
  state.population.housing = housing;
}

function getTechMultiplier(type) {
  let mult = 1;
  for (const techKey of Object.keys(state.tech)) {
    const tech = TECHS[techKey];
    if (!tech) continue;
    if (tech.effect[type]) {
      mult *= tech.effect[type];
    }
  }
  return mult;
}

function getProduction() {
  const production = {
    food: 0,
    wood: 0,
    stone: 0,
    water: 0,
    knowledge: 0,
    renown: 0
  };

  const weather = WEATHER[state.weatherIndex] || WEATHER[0];
  const jobForce = {
    forager: state.jobs.forager,
    lumberjack: state.jobs.lumberjack,
    builder: state.jobs.builder,
    researcher: state.jobs.researcher
  };

  production.food += jobForce.forager * 1.1 + state.buildings.dam * 0.35;
  production.wood += jobForce.lumberjack * 1.6 + state.buildings.sawmill * 1.2;
  production.stone += state.buildings.quarry * 1.3 + jobForce.builder * 0.5;
  production.water += state.buildings.dam * 1.0 + jobForce.builder * 0.25;
  production.knowledge += jobForce.researcher * 0.8 + state.buildings.workshop * 0.7 + state.buildings.observatory * 1.2;

  production.food *= weather.food * getTechMultiplier("foodMult");
  production.wood *= getTechMultiplier("woodMult");
  production.stone *= getTechMultiplier("stoneMult");
  production.water *= weather.water * getTechMultiplier("waterMult");
  production.knowledge *= 1 + state.buildings.observatory * 0.15;
  production.renown += state.buildings.observatory * 0.02;

  return production;
}

function canAfford(cost) {
  return Object.entries(cost).every(([resource, amount]) => (state.resources[resource] || 0) >= amount);
}

function spend(cost) {
  Object.entries(cost).forEach(([resource, amount]) => {
    state.resources[resource] = (state.resources[resource] || 0) - amount;
  });
}

function buyBuilding(type) {
  const building = BUILDINGS[type];
  if (!building || !canAfford(building.cost)) return;

  spend(building.cost);
  state.buildings[type] += 1;
  addLog(`${building.name} errichtet. Die Siedlung wächst weiter.`);
  syncPopulation();
  render();
}

function buyTech(type) {
  const tech = TECHS[type];
  if (!tech || state.tech[type]) return;
  if (!canAfford(tech.cost)) return;

  spend(tech.cost);
  state.tech[type] = true;
  addLog(`${tech.name} erforscht. Die Methoden der Biber werden schlauer.`);
  render();
}

function adjustJob(jobKey, delta) {
  const nextValue = Math.max(0, (state.jobs[jobKey] || 0) + delta);
  const totalAssigned = Object.values(state.jobs).reduce((sum, value) => sum + value, 0) - (state.jobs[jobKey] || 0) + nextValue;

  if (totalAssigned > state.population.total) {
    return;
  }

  state.jobs[jobKey] = nextValue;
  syncPopulation();
  render();
}

function prestige() {
  const renownGain = Math.max(1, Math.floor(state.resources.renown + state.population.total * 0.5));
  state.prestige.total += renownGain;
  state.prestige.best = Math.max(state.prestige.best, renownGain);

  const fresh = defaultState();
  state.resources = fresh.resources;
  state.buildings = fresh.buildings;
  state.jobs = fresh.jobs;
  state.population = fresh.population;
  state.tech = {};
  state.log = [
    "Ein neuer Zyklus beginnt. Die Flusskolonie wird von ganz vorne aufgebaut.",
    `Du hast ${renownGain} Ruhm gesammelt und den Prestige-Run gestartet.`
  ];
  state.resources.renown = renownGain;
  state.lastTick = Date.now();
  saveGame();
  render();
}

function updateWeather(deltaSeconds) {
  state.weatherTimer += deltaSeconds;
  if (state.weatherTimer >= 24) {
    state.weatherTimer = 0;
    state.weatherIndex = (state.weatherIndex + 1) % WEATHER.length;
    addLog(`Wetterwechsel: ${WEATHER[state.weatherIndex].name}.`);
  }
}

function renderResources() {
  const bar = document.getElementById("resourcesBar");
  const entries = [
    ["food", state.resources.food],
    ["wood", state.resources.wood],
    ["stone", state.resources.stone],
    ["water", state.resources.water],
    ["knowledge", state.resources.knowledge],
    ["renown", state.resources.renown]
  ];

  bar.innerHTML = entries.map(([key, value]) => {
    const meta = RESOURCE_META[key];
    const displayValue = value >= 1000 ? value.toFixed(0) : value.toFixed(1);
    return `
      <div class="resource-card">
        <div class="label">
          <span class="dot" style="width:10px;height:10px;border-radius:50%;display:inline-block;background:${meta.color};box-shadow:0 0 8px ${meta.color};"></span>
          ${meta.name}
        </div>
        <div class="value">${displayValue}</div>
      </div>
    `;
  }).join("");
}

function renderPopulation() {
  const panel = document.getElementById("populationPanel");
  const total = state.population.total;
  const free = state.population.free;

  panel.innerHTML = `
    <div class="stat-box">
      <div>
        <div class="meta">Kolonie</div>
        <div class="value">${total} Biber</div>
      </div>
      <div class="status-pill">${free} frei</div>
    </div>
    <div class="stat-box">
      <div>
        <div class="meta">Unterkunft</div>
        <div class="value">${state.population.housing}</div>
      </div>
      <div class="status-pill">Kapazität</div>
    </div>
  `;

  const jobsPanel = document.getElementById("jobPanel");
  jobsPanel.innerHTML = Object.entries(JOBS).map(([key, job]) => {
    const current = state.jobs[key] || 0;
    return `
      <div class="job-row">
        <div class="job-left">
          <div class="job-name">${job.name}</div>
          <div class="status-line">
            <span class="status-pill">${current} zugeteilt</span>
          </div>
        </div>
        <div class="job-actions">
          <button class="action-btn" data-action="job" data-key="${key}" data-dir="-1">-</button>
          <button class="action-btn" data-action="job" data-key="${key}" data-dir="1">+</button>
        </div>
      </div>
    `;
  }).join("");
}

function renderBuildings() {
  const panel = document.getElementById("buildingPanel");

  panel.innerHTML = Object.entries(BUILDINGS).map(([key, building]) => {
    const count = state.buildings[key] || 0;
    const cost = Object.entries(building.cost).map(([resource, amount]) => `
      <span class="cost-pill">${RESOURCE_META[resource]?.name || resource}: ${amount}</span>
    `).join("");
    const disabled = !canAfford(building.cost) ? "disabled" : "";
    return `
      <div class="building-item">
        <div class="building-info">
          <h4>${building.name} (${count})</h4>
          <p>${building.description}</p>
          <div class="cost-line">${cost}</div>
        </div>
        <button class="buy-btn" data-action="building" data-key="${key}" ${disabled}>Bauen</button>
      </div>
    `;
  }).join("");
}

function renderTechs() {
  const panel = document.getElementById("techPanel");
  const techEntries = Object.entries(TECHS);

  panel.innerHTML = techEntries.map(([key, tech]) => {
    const owned = !!state.tech[key];
    const cost = Object.entries(tech.cost).map(([resource, amount]) => `
      <span class="cost-pill">${RESOURCE_META[resource]?.name || resource}: ${amount}</span>
    `).join("");
    const disabled = owned || !canAfford(tech.cost) ? "disabled" : "";
    return `
      <div class="tech-item">
        <div class="tech-summary">
          <div>
            <h4>${tech.name}</h4>
            <p>${tech.description}</p>
          </div>
          <button class="tech-btn" data-action="tech" data-key="${key}" ${disabled}>${owned ? "Erforscht" : "Forschung"}</button>
        </div>
        <div class="cost-line">${cost}</div>
      </div>
    `;
  }).join("");
}

function renderEvents() {
  const weather = WEATHER[state.weatherIndex] || WEATHER[0];
  const production = getProduction();
  const eventPanel = document.getElementById("eventPanel");

  eventPanel.innerHTML = `
    <div class="event-box">
      <h3>${weather.name}</h3>
      <p>Aktuelle Umweltbedingungen bestimmen die Produktion von Nahrung und Wasser.</p>
      <div class="status-line">
        <span class="status-pill">Nahrung: +${production.food.toFixed(2)}/s</span>
        <span class="status-pill">Holz: +${production.wood.toFixed(2)}/s</span>
        <span class="status-pill">Stein: +${production.stone.toFixed(2)}/s</span>
      </div>
    </div>
  `;
}

function renderLog() {
  const panel = document.getElementById("logPanel");
  panel.innerHTML = `
    <div class="log-list">
      ${state.log.map((entry) => `<div class="log-item">${entry}</div>`).join("")}
    </div>
  `;
}

function render() {
  syncPopulation();
  renderResources();
  renderPopulation();
  renderBuildings();
  renderTechs();
  renderEvents();
  renderLog();
}

function tick() {
  const now = Date.now();
  const deltaSeconds = (now - state.lastTick) / 1000;
  state.lastTick = now;

  if (deltaSeconds > 0.2 && deltaSeconds < 10) {
    const production = getProduction();
    Object.keys(production).forEach((resourceKey) => {
      state.resources[resourceKey] = (state.resources[resourceKey] || 0) + production[resourceKey] * deltaSeconds;
    });

    if (state.resources.food <= 0) {
      state.resources.food = 0;
      state.population.total = Math.max(1, state.population.total - 0.5 * deltaSeconds);
      state.jobs.forager = Math.max(0, state.jobs.forager - 0.2 * deltaSeconds);
      addLog("Die Nahrungsknappheit greift an. Einige Biber müssen sich neu organisieren.");
    }

    updateWeather(deltaSeconds);
    syncPopulation();
    saveGame();
  }

  render();
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const action = button.dataset.action;

    if (action === "building") {
      buyBuilding(button.dataset.key);
    }

    if (action === "tech") {
      buyTech(button.dataset.key);
    }

    if (action === "job") {
      const jobKey = button.dataset.key;
      const direction = Number(button.dataset.dir);
      adjustJob(jobKey, direction);
    }

    if (button.id === "saveBtn") {
      saveGame();
      addLog("Sicherung gespeichert.");
      render();
    }

    if (button.id === "resetBtn") {
      prestige();
    }
  });
}

function init() {
  bindEvents();
  state.lastTick = Date.now();
  render();
  setInterval(tick, 250);
  setInterval(saveGame, 5000);
}

init();
