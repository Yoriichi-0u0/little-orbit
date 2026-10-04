import { describe, expect, it } from "vitest";
import {
  advance,
  buildModule,
  buildReason,
  energyCapacity,
  environment,
  forecast,
  incidentAt,
  newMission,
  resolveIncident,
  resupply,
  RESOURCE_KEYS,
  type Mission,
} from "./model";
import { isMission, parseMission } from "./storage";

function play(m: Mission, care = true) {
  while (m.status === "active") {
    if (care && m.resources.water < 25 && m.budget >= 18) m = resupply(m);
    const incident = incidentAt(m);
    if (incident)
      m = resolveIncident(
        m,
        incident.turn === 4
          ? "shelter"
          : incident.turn === 6
            ? "conserve"
            : m.budget >= 12
              ? incident.turn === 2
                ? "patch"
                : "repair"
              : incident.turn === 2
                ? "seal"
                : "skip",
      );
    m = advance(m);
  }
  return m;
}
describe("connected mission systems", () => {
  it("has distinct lunar and Martian generation", () => {
    expect(forecast(newMission("moon")).generation).toBe(24);
    expect(forecast(newMission("mars")).generation).toBe(16);
  });
  it("does not give a battery free energy", () => {
    const m = newMission();
    const upgraded = buildModule(m, "battery");
    expect(energyCapacity(upgraded)).toBe(140);
    expect(upgraded.resources.energy).toBe(m.resources.energy);
    expect(forecast(upgraded).generation).toBe(forecast(m).generation);
  });
  it("couples oxygen production to water and power", () => {
    const m = newMission();
    m.resources.water = 0;
    expect(forecast(m).oxygenMade).toBe(0);
    m.modules.solar = 0;
    m.resources.energy = 0;
    expect(forecast(m).effectiveness).toBe(0);
    expect(forecast(m).waterReturned).toBe(0);
    expect(forecast(m).foodGrown).toBe(0);
  });
  it("new crops consume resources but need two turns before producing", () => {
    const m = newMission();
    const garden = buildModule(m, "greenhouse");
    expect(forecast(garden).foodGrown).toBe(forecast(m).foodGrown);
    expect(forecast(garden).demand).toBe(forecast(m).demand + 5);
    expect(forecast({ ...garden, turn: 2 }).foodGrown).toBe(14);
  });
  it("recycling cannot return more than crew water use", () => {
    const m = newMission();
    m.modules.recycler = 4;
    expect(forecast(m).waterReturned).toBe(6);
  });
  it("MOXIE-inspired hardware needs Mars, then makes oxygen without water", () => {
    expect(buildReason(newMission(), "moxie")).toContain("Martian");
    const m = buildModule(newMission("mars"), "moxie");
    m.resources.water = 0;
    expect(forecast(m).oxygenMade).toBe(10);
  });
  it("construction respects credits, cargo, and hardware limits", () => {
    const m = newMission();
    m.budget = 0;
    expect(buildModule(m, "solar")).toBe(m);
    m.budget = 100;
    m.cargoUsed = 20;
    expect(buildReason(m, "solar")).toContain("cargo");
    m.cargoUsed = 0;
    m.modules.solar = 4;
    expect(buildReason(m, "solar")).toContain("Maximum");
  });
  it("incident decisions block time until resolved and cannot be charged twice", () => {
    const m = { ...newMission(), turn: 2 };
    expect(advance(m)).toBe(m);
    const repaired = resolveIncident(m, "patch");
    expect(repaired.budget).toBe(48);
    expect(resolveIncident(repaired, "patch")).toBe(repaired);
    expect(advance(repaired).turn).toBe(3);
  });
  it("rejects unaffordable event choices without resolving the incident", () => {
    const m = { ...newMission(), turn: 2, budget: 0 };
    expect(resolveIncident(m, "patch")).toBe(m);
    expect(incidentAt(resolveIncident(m, "seal"))).toBeUndefined();
  });
  it("incidents always have a free fallback even with empty reserves", () => {
    for (const turn of [2, 9]) {
      const m = { ...newMission(), turn, budget: 0 };
      m.resources.water = 0;
      m.resources.food = 0;
      const next = resolveIncident(m, turn === 2 ? "seal" : "skip");
      expect(incidentAt(next)).toBeUndefined();
      expect(next.resources.water).toBe(0);
      expect(next.resources.food).toBe(0);
      expect(advance(next).turn).toBe(turn + 1);
    }
  });
  it("shielding and staying inside reduce the solar-event penalty", () => {
    const m = { ...newMission(), turn: 4 };
    const sheltered = buildModule(m, "shelter");
    sheltered.plan = "shelter";
    expect(forecast(sheltered).stormLoss).toBeLessThan(forecast(m).stormLoss);
    expect(forecast(sheltered).stormLoss).toBeGreaterThan(0);
  });
  it("predicts the two low-light turns without a fictional daily lunar sunset", () => {
    const m = newMission();
    expect(environment({ ...m, turn: 6 }).solar).toBe(0.2);
    expect(environment({ ...m, turn: 7 }).solar).toBe(0.2);
    expect(environment({ ...m, turn: 8 }).solar).toBe(1);
  });
  it("forecast exactly predicts the next resource state", () => {
    const m = newMission();
    const before = JSON.stringify(m);
    const f = forecast(m);
    expect(advance(m).resources).toEqual(f.next);
    expect(JSON.stringify(m)).toBe(before);
  });
  it("a carefully managed mission can finish on both worlds", () => {
    for (const destination of ["moon", "mars"] as const) {
      let m = buildModule(newMission(destination), "solar");
      m = buildModule(m, "recycler");
      m = play(m);
      expect(m.status).toBe("success");
      expect(m.turn).toBe(14);
      expect(isMission(m)).toBe(true);
    }
  });
  it("neglect can cause evacuation and completed missions cannot advance", () => {
    const m = newMission("mars", 3);
    m.resources = { energy: 0, oxygen: 0, water: 0, food: 0, health: 2 };
    const ended = advance(m);
    expect(ended.status).toBe("evacuated");
    expect(advance(ended)).toBe(ended);
  });
  it("all forecast stocks stay bounded over complete runs", () => {
    for (const destination of ["moon", "mars"] as const)
      for (const crew of [2, 3] as const) {
        const m = play(newMission(destination, crew));
        for (const key of RESOURCE_KEYS)
          expect(m.resources[key]).toBeGreaterThanOrEqual(0);
        expect(m.resources.health).toBeLessThanOrEqual(100);
      }
  });
});
describe("persisted mission validation", () => {
  it("round-trips a legitimate mission", () =>
    expect(parseMission(JSON.stringify(newMission()))).toBeDefined());
  it("rejects corrupt, old, and unbounded saves", () => {
    expect(parseMission("{broken")).toBeUndefined();
    expect(parseMission("null")).toBeUndefined();
    expect(isMission({ ...newMission(), version: 2 })).toBe(false);
    const m = newMission();
    m.resources.energy = Infinity;
    expect(isMission(m)).toBe(false);
    expect(isMission({ ...newMission(), turn: -1 })).toBe(false);
    expect(isMission({ ...newMission(), status: "success" })).toBe(false);
  });
});
