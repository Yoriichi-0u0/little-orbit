export type Destination = "moon" | "mars";
export type Plan = "research" | "explore" | "rest" | "shelter";
export type Resource = "energy" | "oxygen" | "water" | "food" | "health";
export type ModuleId =
  | "solar"
  | "life"
  | "greenhouse"
  | "shelter"
  | "recycler"
  | "battery"
  | "reactor"
  | "moxie";
export type Stocks = Record<Resource, number>;
export type ModuleCounts = Record<ModuleId, number>;
export interface ModuleDef {
  id: ModuleId;
  name: string;
  cost: number;
  cargo: number;
  description: string;
  effect: string;
  tradeoff: string;
  source: string;
  atlas: number;
}

export const MODULES: ModuleDef[] = [
  {
    id: "solar",
    name: "Solar array",
    cost: 20,
    cargo: 2,
    description: "Turn a little sunshine into possibility.",
    effect: "+24 power / turn on the Moon; +16 on Mars, before shade.",
    tradeoff: "No fuel required. Shadows and dust reduce output.",
    source: "polar",
    atlas: 0,
  },
  {
    id: "life",
    name: "Life support",
    cost: 28,
    cargo: 3,
    description: "A breath of fresh air, far from home.",
    effect: "+12 oxygen; uses 6 power and 2 water / turn.",
    tradeoff: "Oxygen production stops when there is no water.",
    source: "eclss",
    atlas: 1,
  },
  {
    id: "greenhouse",
    name: "Greenhouse",
    cost: 24,
    cargo: 3,
    description: "Grow something good for your crew.",
    effect: "+7 food / turn after 2 growing turns; uses 5 power and 3 water.",
    tradeoff: "Plants compete with life support for water and power.",
    source: "plants",
    atlas: 2,
  },
  {
    id: "shelter",
    name: "Storm shelter",
    cost: 30,
    cargo: 4,
    description: "A safe little space when the Sun gets wild.",
    effect: "Reduces modeled solar-storm health impact by 50%.",
    tradeoff: "Costs cargo room; never eliminates all radiation.",
    source: "radiation",
    atlas: 3,
  },
  {
    id: "recycler",
    name: "Water recycler",
    cost: 24,
    cargo: 3,
    description: "Every drop deserves another adventure.",
    effect: "Returns up to 5 used crew-water units; uses 4 power / turn.",
    tradeoff: "Needs electricity and cannot create water from nothing.",
    source: "water",
    atlas: 4,
  },
  {
    id: "battery",
    name: "Battery bank",
    cost: 16,
    cargo: 2,
    description: "Save some sunshine for a rainy sol.",
    effect: "+40 energy storage capacity.",
    tradeoff: "Stores energy. Does not generate or arrive with a charge.",
    source: "dust",
    atlas: 5,
  },
  {
    id: "reactor",
    name: "Surface reactor",
    cost: 65,
    cargo: 6,
    description: "Steady power, even in the shadows.",
    effect: "+30 power / turn, independent of sunlight.",
    tradeoff: "The heaviest, most expensive power option.",
    source: "fission",
    atlas: 6,
  },
  {
    id: "moxie",
    name: "Mars oxygen lab",
    cost: 32,
    cargo: 3,
    description: "Make oxygen from the Martian air.",
    effect: "+10 oxygen / turn; uses 8 power, no water.",
    tradeoff: "Mars only. A fictional scale-up inspired by MOXIE.",
    source: "moxie",
    atlas: 7,
  },
];

export interface LogEntry {
  turn: number;
  type: "arrival" | "build" | "incident" | "day" | "supplies";
  title: string;
  detail: string;
  stocks?: Stocks;
}
export interface Mission {
  version: 1;
  id: string;
  name: string;
  destination: Destination;
  crew: 2 | 3;
  turn: number;
  status: "active" | "success" | "evacuated";
  resources: Stocks;
  modules: ModuleCounts;
  gardens: number[];
  budget: number;
  cargoUsed: number;
  plan: Plan;
  science: number;
  resolved: number[];
  log: LogEntry[];
}
export interface Incident {
  turn: number;
  title: string;
  description: string;
  source: string;
  options: { id: string; label: string; cost: string; explanation: string }[];
}
export const PLANS: { id: Plan; name: string; description: string }[] = [
  {
    id: "research",
    name: "Base research",
    description: "+8 science; balanced resource use",
  },
  {
    id: "explore",
    name: "Rover expedition",
    description: "+14 science; uses 6 more power, 2 oxygen & 2 water",
  },
  {
    id: "rest",
    name: "Crew recovery",
    description: "+7 health when supplied; no science",
  },
  {
    id: "shelter",
    name: "Shelter in place",
    description: "+2 science; reduces solar-storm impact",
  },
];
export const MAX_TURNS = 14;
export const CARGO_LIMIT = 20;
export const RESOURCE_KEYS: Resource[] = [
  "energy",
  "oxygen",
  "water",
  "food",
  "health",
];
export const clamp = (n: number, max = 100) => Math.max(0, Math.min(max, n));
const rounded = (n: number) => Math.round(n * 10) / 10;
export const dayLabel = (m: Mission) =>
  m.destination === "mars" ? "Sol" : "Day";
export const displayDay = (m: Mission) => Math.min(m.turn + 1, MAX_TURNS);
export const energyCapacity = (m: Mission) =>
  100 + (m.modules.battery - 1) * 40;

export function newMission(
  destination: Destination = "moon",
  crew: 2 | 3 = 2,
  name = destination === "moon" ? "Luna Base" : "Ares Base",
): Mission {
  const resources = {
    energy: 72,
    oxygen: 80,
    water: 75,
    food: 80,
    health: 100,
  };
  return {
    version: 1,
    id: crypto.randomUUID(),
    name:
      name.trim().slice(0, 32) ||
      (destination === "moon" ? "Luna Base" : "Ares Base"),
    destination,
    crew,
    turn: 0,
    status: "active",
    resources,
    modules: {
      solar: 1,
      life: 1,
      greenhouse: 1,
      shelter: 0,
      recycler: 1,
      battery: 1,
      reactor: 0,
      moxie: 0,
    },
    gardens: [-2],
    budget: 60,
    cargoUsed: 0,
    plan: "research",
    science: 0,
    resolved: [],
    log: [
      {
        turn: 0,
        type: "arrival",
        title: "A new little beginning.",
        detail: `Your ${crew}-person crew has landed. Starter systems are installed. Complete ${MAX_TURNS} ${destination === "mars" ? "sols" : "Earth days"} and keep your crew safe.`,
        stocks: { ...resources },
      },
    ],
  };
}

export function environment(m: Mission): {
  solar: number;
  label: string;
  warning?: string;
} {
  if (m.turn === 6 || m.turn === 7)
    return {
      solar: 0.2,
      label: m.destination === "moon" ? "Ridge shadow" : "Dust storm",
      warning: "Solar output is only 20%. Stored energy matters now.",
    };
  if (m.turn === 5)
    return {
      solar: 1,
      label: "Clear skies",
      warning:
        m.destination === "moon"
          ? "Ridge shadows arrive next turn. Charge your batteries."
          : "Dust is approaching. Prepare for lower solar output.",
    };
  return {
    solar: 1,
    label: m.destination === "moon" ? "Daylight" : "Clear skies",
  };
}

export function incidentAt(m: Mission): Incident | undefined {
  if (m.status !== "active" || m.resolved.includes(m.turn)) return;
  switch (m.turn) {
    case 2:
      return {
        turn: 2,
        title: "A drop in the wrong place.",
        description:
          "A small pipe leak is wasting precious water. Your crew can patch it, or use a temporary seal and accept some loss.",
        source: "water",
        options: [
          {
            id: "patch",
            label: "Repair the pipe",
            cost: "12 credits",
            explanation:
              "Spend on maintenance now to preserve your water reserve.",
          },
          {
            id: "seal",
            label: "Use a temporary seal",
            cost: "Up to −12 water",
            explanation:
              "The leak is stopped, but lost water cannot be recovered.",
          },
        ],
      };
    case 4:
      return {
        turn: 4,
        title: "The Sun has other plans.",
        description:
          "A solar particle event is on its way. Your storm shelter and daily crew plan will determine how much your crew is protected during the next turn.",
        source: "radiation",
        options: [
          {
            id: "shelter",
            label: "Keep the crew inside",
            cost: "Set plan: Shelter in place",
            explanation:
              "Indoor shelter reduces exposure and sacrifices exploration science. A built storm shelter adds more protection.",
          },
          {
            id: "continue",
            label: "Keep the current plan",
            cost: "Higher modeled health risk",
            explanation:
              "The storm will affect the next turn. Check the health forecast before advancing.",
          },
        ],
      };
    case 6:
      return {
        turn: 6,
        title:
          m.destination === "moon"
            ? "Into the long shadows."
            : "A very dusty forecast.",
        description:
          m.destination === "moon"
            ? "Low-angle sunlight and the ridge terrain put the base in shade for two turns. This is a fictional polar shadow scenario, not a daily lunar sunset."
            : "A dust storm is blocking sunlight for two sols. Solar power will fall, just as dust affected NASA’s Opportunity rover.",
        source: m.destination === "moon" ? "polar" : "dust",
        options: [
          {
            id: "conserve",
            label: "Give the crew a recovery day",
            cost: "Set plan: Crew recovery",
            explanation:
              "Pause science, reduce habitat demand, and let reserves support essential systems.",
          },
          {
            id: "continue",
            label: "Carry on with the plan",
            cost: "Solar output: 20% for 2 turns",
            explanation:
              "Stored power or a reactor can bridge the shortage. Check the forecast.",
          },
        ],
      };
    case 9:
      return {
        turn: 9,
        title: "Your garden needs a hand.",
        description:
          "A nutrient pump needs attention. Plants depend on water delivery and working hardware, even when the garden looks green.",
        source: "plants",
        options: [
          {
            id: "repair",
            label: "Repair the nutrient pump",
            cost: "12 credits",
            explanation: "Maintenance protects the next harvest.",
          },
          {
            id: "manual",
            label: "Water by hand",
            cost: "−10 water",
            explanation:
              "You keep the crop growing by using a little more stored water.",
          },
          {
            id: "skip",
            label: "Accept a lost crop",
            cost: "Up to −12 food",
            explanation:
              "You lose some reserves. Keep a close eye on food and the crew-health forecast.",
          },
        ],
      };
  }
}

export function buildReason(m: Mission, id: ModuleId): string | undefined {
  const def = MODULES.find((x) => x.id === id)!;
  if (m.status !== "active") return "Start a new mission to build.";
  if (id === "moxie" && m.destination !== "mars")
    return "Needs the Martian atmosphere.";
  if (m.modules[id] >= (id === "shelter" ? 2 : 4)) return "Maximum installed.";
  if (m.budget < def.cost) return `Need ${def.cost - m.budget} more credits.`;
  if (m.cargoUsed + def.cargo > CARGO_LIMIT) return "Not enough cargo room.";
}

export function buildModule(m: Mission, id: ModuleId): Mission {
  if (buildReason(m, id)) return m;
  const def = MODULES.find((x) => x.id === id)!;
  return {
    ...m,
    modules: { ...m.modules, [id]: m.modules[id] + 1 },
    gardens: id === "greenhouse" ? [...m.gardens, m.turn] : [...m.gardens],
    budget: m.budget - def.cost,
    cargoUsed: m.cargoUsed + def.cargo,
    log: [
      ...m.log,
      {
        turn: m.turn,
        type: "build",
        title: `${def.name} installed.`,
        detail: `${def.cost} credits and ${def.cargo} cargo points. ${def.effect} ${def.tradeoff}`,
      },
    ],
  };
}

export function resolveIncident(m: Mission, option: string): Mission {
  const event = incidentAt(m);
  if (!event || !event.options.some((o) => o.id === option)) return m;
  const choice = event.options.find((o) => o.id === option)!;
  const cost = ["patch", "repair"].includes(option) ? 12 : 0;
  if (m.budget < cost || (option === "manual" && m.resources.water < 10))
    return m;
  const resources = { ...m.resources };
  if (option === "seal") resources.water = clamp(resources.water - 12);
  if (option === "manual") resources.water -= 10;
  if (option === "skip") resources.food = clamp(resources.food - 12);
  return {
    ...m,
    resources,
    budget: m.budget - cost,
    plan:
      option === "shelter"
        ? "shelter"
        : option === "conserve"
          ? "rest"
          : m.plan,
    resolved: [...m.resolved, m.turn],
    log: [
      ...m.log,
      {
        turn: m.turn,
        type: "incident",
        title: `${event.title} ${choice.label}.`,
        detail: `${choice.cost}. ${choice.explanation}`,
        stocks: { ...resources },
      },
    ],
  };
}

export interface Forecast {
  next: Stocks;
  delta: Stocks;
  generation: number;
  demand: number;
  effectiveness: number;
  oxygenMade: number;
  waterReturned: number;
  foodGrown: number;
  science: number;
  stormLoss: number;
  warnings: string[];
}
export function forecast(m: Mission): Forecast {
  const s = m.resources,
    n = m.modules;
  const exploring = m.plan === "explore";
  const generation =
    n.solar * (m.destination === "moon" ? 24 : 16) * environment(m).solar +
    n.reactor * 30;
  const demand =
    (m.plan === "rest" ? 4 : 6) +
    n.life * 6 +
    n.recycler * 4 +
    n.greenhouse * 5 +
    n.moxie * 8 +
    (exploring ? 6 : 0);
  const effectiveness = Math.min(1, (s.energy + generation) / demand);
  const crewWater = m.crew * 3 + (exploring ? 2 : 0);
  const waterReturned = Math.min(crewWater, n.recycler * 5 * effectiveness);
  const availableWater = Math.max(0, s.water - crewWater + waterReturned);
  const waterDemand = (n.life * 2 + n.greenhouse * 3) * effectiveness;
  const waterFactor = waterDemand
    ? Math.min(1, availableWater / waterDemand)
    : 1;
  const oxygenMade = (n.life * 12 * waterFactor + n.moxie * 10) * effectiveness;
  const foodGrown =
    m.gardens.filter((t) => m.turn - t >= 2).length *
    7 *
    effectiveness *
    waterFactor;
  const next: Stocks = {
    energy: rounded(clamp(s.energy + generation - demand, energyCapacity(m))),
    oxygen: rounded(
      clamp(s.oxygen + oxygenMade - m.crew * 5 - (exploring ? 2 : 0)),
    ),
    water: rounded(
      clamp(s.water - crewWater + waterReturned - waterDemand * waterFactor),
    ),
    food: rounded(clamp(s.food + foodGrown - m.crew * 4)),
    health: s.health,
  };
  const shortages =
    (next.oxygen <= 0 ? 25 : next.oxygen < 15 ? 6 : 0) +
    (next.water <= 0 ? 18 : next.water < 15 ? 4 : 0) +
    (next.food <= 0 ? 15 : next.food < 15 ? 3 : 0) +
    (effectiveness < 0.6 ? 8 : 0);
  const protectedFraction = Math.min(
    0.85,
    n.shelter * 0.5 + (m.plan === "shelter" ? 0.35 : 0),
  );
  const stormLoss =
    m.turn === 4 ? 28 * (1 - protectedFraction) * (exploring ? 1.4 : 1) : 0;
  const restBonus = !shortages
    ? m.plan === "rest"
      ? 7
      : m.plan === "shelter"
        ? 2
        : 0
    : 0;
  next.health = rounded(
    clamp(s.health - shortages - stormLoss - (exploring ? 1 : 0) + restBonus),
  );
  const science = Math.round(
    { research: 8, explore: 14, rest: 0, shelter: 2 }[m.plan] *
      effectiveness *
      (shortages ? 0.5 : 1),
  );
  const warnings: string[] = [];
  if (effectiveness < 1)
    warnings.push(
      `Power shortage: systems work at ${Math.round(effectiveness * 100)}%.`,
    );
  if (waterFactor < 1)
    warnings.push(
      "Water shortage slows oxygen generation and your greenhouse.",
    );
  if (next.water < 20)
    warnings.push("Water reserve is low. A recycler or supply pack can help.");
  if (next.oxygen < 20)
    warnings.push("Oxygen reserve is low. Add powered life support.");
  if (next.food < 20)
    warnings.push(
      "Food reserve is low. A mature greenhouse needs water and power.",
    );
  if (stormLoss > 5)
    warnings.push(
      `Solar event: expected health loss ${rounded(stormLoss)}. Shelter reduces exposure.`,
    );
  const delta = Object.fromEntries(
    RESOURCE_KEYS.map((k) => [k, rounded(next[k] - s[k])]),
  ) as Stocks;
  return {
    next,
    delta,
    generation: rounded(generation),
    demand,
    effectiveness,
    oxygenMade: rounded(oxygenMade),
    waterReturned: rounded(waterReturned),
    foodGrown: rounded(foodGrown),
    science,
    stormLoss: rounded(stormLoss),
    warnings,
  };
}

export function advance(m: Mission): Mission {
  if (m.status !== "active" || incidentAt(m)) return m;
  const f = forecast(m);
  const turn = m.turn + 1;
  const status =
    f.next.health <= 0 ? "evacuated" : turn >= MAX_TURNS ? "success" : "active";
  return {
    ...m,
    turn,
    status,
    resources: f.next,
    budget: m.budget + 4,
    science: m.science + f.science,
    log: [
      ...m.log,
      {
        turn: m.turn,
        type: "day",
        title: `${dayLabel(m)} ${m.turn + 1} complete · ${PLANS.find((p) => p.id === m.plan)!.name}`,
        detail: `Power ${f.generation} generated / ${f.demand} used. Oxygen +${f.oxygenMade} made. Water +${f.waterReturned} recovered. Food +${f.foodGrown} grown. Science +${f.science}. +4 maintenance credits.${f.warnings.length ? " " + f.warnings.join(" ") : " All essential systems supplied."}`,
        stocks: { ...f.next },
      },
    ],
  };
}

export function resupply(m: Mission): Mission {
  if (m.status !== "active" || m.budget < 18) return m;
  const resources = {
    ...m.resources,
    oxygen: clamp(m.resources.oxygen + 15),
    water: clamp(m.resources.water + 25),
    food: clamp(m.resources.food + 15),
  };
  return {
    ...m,
    budget: m.budget - 18,
    resources,
    log: [
      ...m.log,
      {
        turn: m.turn,
        type: "supplies",
        title: "An emergency supply pack opened.",
        detail:
          "18 credits: up to +25 water, +15 oxygen, +15 food from pre-landed stores. This is a game simplification, not instant resupply from Earth.",
        stocks: { ...resources },
      },
    ],
  };
}

export function debrief(m: Mission): string {
  return `# Little Orbit — ${m.name}\n\nDestination: ${m.destination === "moon" ? "Moon polar ridge" : "Mars"}\nCrew: ${m.crew}\nCompleted turns: ${m.turn} / ${MAX_TURNS}\nOutcome: ${m.status}\nScience: ${m.science}\n\n## Remaining reserves (game units)\n\n${RESOURCE_KEYS.map((k) => `- ${k}: ${m.resources[k]}`).join("\n")}\n\n## Installed modules\n\n${MODULES.map((d) => `- ${d.name}: ${m.modules[d.id]}`).join("\n")}\n\n## Mission journal\n\n${m.log.map((l) => `### ${dayLabel(m)} ${l.turn + 1}: ${l.title}\n\n${l.detail}`).join("\n\n")}\n\n## Reflect\n\n1. Which system needed the most attention, and why?\n2. How did adding a greenhouse change the power and water forecast?\n3. What would you do differently before the solar event or low-light interval?\n4. Which NASA source explains your most important decision?\n\nResources, crop time, credits, hazards, and health are simplified game mechanics. They are not engineering or medical measurements. NASA-backed science explains dependencies, not the numeric balance.\n\nScience sources: https://github.com/Yoriichi-0u0/little-orbit/blob/main/docs/research.md\n`;
}
