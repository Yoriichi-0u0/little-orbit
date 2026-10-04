import {
  CARGO_LIMIT,
  MODULES,
  PLANS,
  RESOURCE_KEYS,
  energyCapacity,
  type Mission,
} from "./model";
export const MISSION_KEY = "little-orbit.mission.v1";
export const HISTORY_KEY = "little-orbit.history.v1";
export const QUIZ_KEY = "little-orbit.quiz.v1";

export function isMission(value: unknown): value is Mission {
  if (!value || typeof value !== "object") return false;
  const m = value as Mission;
  if (
    m.version !== 1 ||
    typeof m.id !== "string" ||
    m.id.length > 64 ||
    typeof m.name !== "string" ||
    m.name.length > 32 ||
    !["moon", "mars"].includes(m.destination) ||
    ![2, 3].includes(m.crew)
  )
    return false;
  if (
    !Number.isInteger(m.turn) ||
    m.turn < 0 ||
    m.turn > 14 ||
    !["active", "success", "evacuated"].includes(m.status) ||
    !PLANS.some((p) => p.id === m.plan)
  )
    return false;
  if (
    !Number.isInteger(m.budget) ||
    m.budget < 0 ||
    m.budget > 2000 ||
    !Number.isInteger(m.cargoUsed) ||
    m.cargoUsed < 0 ||
    m.cargoUsed > CARGO_LIMIT ||
    !Number.isInteger(m.science) ||
    m.science < 0 ||
    m.science > 10000
  )
    return false;
  if (
    !m.modules ||
    !MODULES.every(
      (d) =>
        Number.isInteger(m.modules[d.id]) &&
        m.modules[d.id] >=
          (["shelter", "reactor", "moxie"].includes(d.id) ? 0 : 1) &&
        m.modules[d.id] <= (d.id === "shelter" ? 2 : 4),
    )
  )
    return false;
  if (
    !m.resources ||
    !RESOURCE_KEYS.every(
      (k) =>
        Number.isFinite(m.resources[k]) &&
        m.resources[k] >= 0 &&
        m.resources[k] <= (k === "energy" ? energyCapacity(m) : 100),
    )
  )
    return false;
  if (
    !Array.isArray(m.gardens) ||
    m.gardens.length !== m.modules.greenhouse ||
    !m.gardens.every((t) => Number.isInteger(t) && t >= -2 && t <= m.turn)
  )
    return false;
  if (
    !Array.isArray(m.resolved) ||
    m.resolved.length > 4 ||
    !m.resolved.every((t) => [2, 4, 6, 9].includes(t) && t <= m.turn)
  )
    return false;
  if (m.destination === "moon" && m.modules.moxie > 0) return false;
  if (m.status === "active" && (m.turn >= 14 || m.resources.health <= 0))
    return false;
  if (m.status === "success" && (m.turn !== 14 || m.resources.health <= 0))
    return false;
  if (m.status === "evacuated" && m.resources.health > 0) return false;
  if (
    !Array.isArray(m.log) ||
    m.log.length > 250 ||
    !m.log.every(
      (l) =>
        l &&
        Number.isInteger(l.turn) &&
        l.turn >= 0 &&
        l.turn <= 14 &&
        ["arrival", "build", "incident", "day", "supplies"].includes(l.type) &&
        typeof l.title === "string" &&
        l.title.length < 300 &&
        typeof l.detail === "string" &&
        l.detail.length < 3000 &&
        (!l.stocks ||
          RESOURCE_KEYS.every(
            (k) =>
              Number.isFinite(l.stocks![k]) &&
              l.stocks![k] >= 0 &&
              l.stocks![k] <= 300,
          )),
    )
  )
    return false;
  return true;
}

export function parseMission(raw: string | null): Mission | undefined {
  if (!raw) return;
  try {
    const m: unknown = JSON.parse(raw);
    return isMission(m) ? m : undefined;
  } catch {
    return;
  }
}
export function readHistory(): Mission[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
    return Array.isArray(data)
      ? data
          .filter(isMission)
          .filter((m) => m.status !== "active")
          .slice(0, 10)
      : [];
  } catch {
    return [];
  }
}
export function readQuiz(): Record<string, boolean> {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(QUIZ_KEY) ?? "{}");
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    return Object.fromEntries(
      Object.entries(data).filter(
        ([key, v]) =>
          ["power", "oxygen", "water", "food", "shield", "planet"].includes(
            key,
          ) && v === true,
      ),
    );
  } catch {
    return {};
  }
}
