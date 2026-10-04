import {
  BatteryCharging,
  Droplets,
  Heart,
  Leaf,
  ShieldCheck,
  Wind,
  Zap,
  Orbit,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { sourceFor } from "../data/science";
import {
  energyCapacity,
  RESOURCE_KEYS,
  type Mission,
  type Resource,
  type ModuleId,
} from "../game/model";

export const RESOURCE_META: Record<
  Resource,
  { name: string; icon: LucideIcon; color: string }
> = {
  energy: { name: "Power", icon: Zap, color: "#16868a" },
  oxygen: { name: "Oxygen", icon: Wind, color: "#16868a" },
  water: { name: "Water", icon: Droplets, color: "#16868a" },
  food: { name: "Food", icon: Leaf, color: "#4d9375" },
  health: { name: "Crew health", icon: Heart, color: "#16868a" },
};
export const lessonIcon = (name: string): LucideIcon =>
  ({
    power: Zap,
    oxygen: Wind,
    water: Droplets,
    food: Leaf,
    shield: ShieldCheck,
    planet: Orbit,
  })[name] ?? BatteryCharging;
export function SourceLink({
  id,
  compact = false,
}: {
  id: string;
  compact?: boolean;
}) {
  const s = sourceFor(id);
  return (
    <a
      className="source-link"
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {compact ? `Read the ${s.publisher} science` : s.title}
      <ExternalLink size={13} />
    </a>
  );
}
export function ModuleArt({ id, atlas }: { id: ModuleId; atlas: number }) {
  return (
    <span
      className={`module-art art-${id}`}
      role="img"
      aria-label={`${id === "life" ? "Life support" : id} equipment illustration`}
      style={{
        backgroundPosition: `${((atlas % 4) * 100) / 3}% ${Math.floor(atlas / 4) * 100}%`,
      }}
    />
  );
}
export function ResourceGauges({
  mission,
  onForecast,
}: {
  mission: Mission;
  onForecast: () => void;
}) {
  return (
    <div
      className="resource-rail"
      aria-label="Current resources in normalized game units"
    >
      {RESOURCE_KEYS.map((key) => {
        const { name, icon: Icon, color } = RESOURCE_META[key];
        const value = mission.resources[key],
          max = key === "energy" ? energyCapacity(mission) : 100;
        const low = value / max < 0.2;
        return (
          <button
            key={key}
            className={`resource-card ${low ? "resource-low" : ""}`}
            onClick={onForecast}
            aria-label={`${name}: ${value} of ${max} game units. Open forecast.`}
          >
            <Icon
              className="resource-icon"
              size={26}
              style={{ color: low ? "#bc6144" : color }}
            />
            <div>
              <div className="resource-title">
                <strong>{name}</strong>
                <span>
                  <b>{value}</b> / {max}
                </span>
              </div>
              <div className="meter" aria-hidden="true">
                <span
                  style={{
                    width: `${(value / max) * 100}%`,
                    background: low ? "#bc6144" : color,
                  }}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
export function downloadText(text: string, fileName: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/markdown;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
