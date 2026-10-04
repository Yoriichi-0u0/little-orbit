import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Coins,
  Flag,
  Layers3,
  Package,
  Plus,
  ShieldCheck,
  Sun,
  Wind,
  Zap,
} from "lucide-react";
import {
  CARGO_LIMIT,
  MODULES,
  PLANS,
  buildReason,
  dayLabel,
  displayDay,
  environment,
  forecast,
  incidentAt,
  type Mission,
  type ModuleId,
  type Plan,
} from "../game/model";
import { ModuleArt, ResourceGauges } from "./Primitives";
interface Props {
  mission: Mission;
  onForecast: () => void;
  onModule: (id: ModuleId) => void;
  onCatalog: () => void;
  onAdvance: () => void;
  onPlan: (plan: Plan) => void;
  onScience: () => void;
  onHelp: () => void;
  saving: boolean;
}

export function MissionControl({
  mission: m,
  onForecast,
  onModule,
  onCatalog,
  onAdvance,
  onPlan,
  onScience,
  onHelp,
  saving,
}: Props) {
  const [view, setView] = useState("overview");
  const e = environment(m),
    f = forecast(m),
    event = incidentAt(m);
  const completed = m.status !== "active";
  const extras = Object.values(m.modules).reduce((a, b) => a + b, 0) - 5;
  return (
    <>
      <section className="intro">
        <div>
          <h1>A small step. A big responsibility.</h1>
          <p>
            Build your outpost. Keep your crew safe. Make every resource count.
          </p>
        </div>
        <div className="mission-identity">
          <span className={`planet-disc ${m.destination}`} aria-hidden="true" />
          <div>
            <h2>{m.name}</h2>
            <p>
              {m.destination === "moon" ? "Moon" : "Mars"} · {m.crew} crew ·{" "}
              {dayLabel(m)} {displayDay(m)} of 14
            </p>
          </div>
        </div>
      </section>
      <ResourceGauges mission={m} onForecast={onForecast} />
      <div className="mission-layout">
        <div className="outpost-column">
          <section
            className={`outpost-scene ${m.destination}`}
            aria-label={`${m.destination === "moon" ? "Lunar" : "Martian"} outpost illustration and installed systems`}
          >
            <img
              src={`/images/${m.destination}-outpost.webp`}
              alt={`An illustrated ${m.destination === "moon" ? "lunar" : "Martian"} outpost with habitats, solar panels, greenhouse, utility tanks, rover, and astronaut.`}
              fetchPriority="high"
            />
            <div className="scene-heading">
              <span>
                <Package size={17} /> YOUR OUTPOST
              </span>
              <span>
                <Sun size={18} />
                {e.label} · {Math.round(e.solar * 100)}% solar output
              </span>
            </div>
            {view === "overview" ? (
              <>
                <button
                  className="scene-point point-solar"
                  onClick={() => onModule("solar")}
                  aria-label={`Inspect solar arrays, ${m.modules.solar} installed`}
                >
                  <Zap size={17} />
                  <span>Solar array · {m.modules.solar}</span>
                </button>
                <button
                  className="scene-point point-life"
                  onClick={() => onModule("life")}
                  aria-label={`Inspect life support, ${m.modules.life} installed`}
                >
                  <Wind size={17} />
                  <span>Life support · {m.modules.life}</span>
                </button>
                <button
                  className="scene-point point-garden"
                  onClick={() => onModule("greenhouse")}
                  aria-label={`Inspect greenhouse, ${m.modules.greenhouse} installed`}
                >
                  <Plus size={19} />
                  <span>Greenhouse · {m.modules.greenhouse}</span>
                </button>
                <button
                  className="scene-point point-build"
                  onClick={onCatalog}
                  aria-label="Open construction catalog"
                >
                  <Plus size={22} />
                </button>
                {extras > 0 && (
                  <button className="installation-tag" onClick={onCatalog}>
                    <Check size={14} />
                    {extras} new {extras === 1 ? "module" : "modules"} installed
                  </button>
                )}
              </>
            ) : (
              <div className="system-overlay">
                <h3>
                  {view === "power"
                    ? "Follow the power."
                    : "A loop that keeps you alive."}
                </h3>
                {view === "power" ? (
                  <>
                    <div className="flow-numbers">
                      <span>
                        <b>{f.generation}</b> generated
                      </span>
                      <ArrowRight />
                      <span>
                        <b>{f.demand}</b> needed
                      </span>
                    </div>
                    <p>
                      {m.modules.solar} solar{" "}
                      {m.modules.solar === 1 ? "array" : "arrays"} ·{" "}
                      {m.modules.reactor} reactors · {m.modules.battery} battery{" "}
                      {m.modules.battery === 1 ? "bank" : "banks"}
                    </p>
                    <p>
                      Systems operate at {Math.round(f.effectiveness * 100)}%.
                      More storage helps only when you have energy to store.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flow-numbers">
                      <span>
                        <b>+{f.waterReturned}</b> recycled water
                      </span>
                      <ArrowRight />
                      <span>
                        <b>+{f.oxygenMade}</b> oxygen
                      </span>
                    </div>
                    <p>Water → powered life support → oxygen for your crew.</p>
                    <p>
                      Your garden also needs that water and power. Forecast: +
                      {f.foodGrown} food this turn.
                    </p>
                  </>
                )}
                <button className="text-button" onClick={onForecast}>
                  See the complete forecast <ArrowRight size={16} />
                </button>
              </div>
            )}
            <div className="scene-tabs" aria-label="Outpost views">
              {[
                { id: "overview", text: "Overview", Icon: Layers3 },
                { id: "power", text: "Power grid", Icon: Zap },
                { id: "life", text: "Life support", Icon: Wind },
              ].map(({ id, text, Icon }) => (
                <button
                  key={id}
                  aria-pressed={view === id}
                  className={view === id ? "selected" : ""}
                  onClick={() => setView(id)}
                >
                  <Icon size={15} />
                  {text}
                </button>
              ))}
            </div>
          </section>
          <section className="module-catalog" id="module-catalog">
            <div className="section-row">
              <h2>Make room for the next discovery.</h2>
              <button className="text-button" onClick={onCatalog}>
                All hardware <ArrowRight size={15} />
              </button>
            </div>
            <div className="primary-modules">
              {MODULES.slice(0, 4).map((d) => {
                const reason = buildReason(m, d.id);
                return (
                  <article className="module-card" key={d.id}>
                    <button
                      className="module-details"
                      onClick={() => onModule(d.id)}
                    >
                      <ModuleArt id={d.id} atlas={d.atlas} />
                      <div>
                        <h3>{d.name}</h3>
                        <p>{d.description}</p>
                      </div>
                    </button>
                    <div className="module-bottom">
                      <span>
                        <Coins size={16} />
                        <strong>{d.cost}</strong> credits
                      </span>
                      <button
                        className="build-button"
                        disabled={completed}
                        onClick={() => onModule(d.id)}
                        aria-label={`Build or inspect ${d.name}`}
                      >
                        {reason ? "Inspect" : "Build"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
        <aside className="flight-column">
          <section className="flight-plan">
            <div className="section-row">
              <h2>Today’s flight plan</h2>
              <span className="day-counter">
                {dayLabel(m).toUpperCase()}{" "}
                {String(displayDay(m)).padStart(2, "0")} / 14
              </span>
            </div>
            <p className="flight-greeting">
              {completed
                ? m.status === "success"
                  ? "You made it. Your little outpost did something big."
                  : "Your crew is safe after evacuation. Every mission teaches us something."
                : m.turn === 0
                  ? "Your crew has landed. Let’s make this place a home."
                  : event
                    ? "A new decision is waiting. Take a look before the next turn."
                    : "A little planning now. A big difference tomorrow."}
            </p>
            <div className="checklist">
              <button onClick={onForecast}>
                <span className="check-circle" />
                <BarChart3 size={19} />
                <span>Check your resource forecast</span>
                <ChevronRight size={16} />
              </button>
              <button onClick={onCatalog}>
                <span className={`check-circle ${extras > 0 ? "checked" : ""}`}>
                  {extras > 0 && <Check size={13} />}
                </span>
                <Package size={19} />
                <span>Choose your next module</span>
                <ChevronRight size={16} />
              </button>
              <button onClick={onAdvance}>
                <span className={`check-circle ${m.turn > 0 ? "checked" : ""}`}>
                  {m.turn > 0 && <Check size={13} />}
                </span>
                <Flag size={19} />
                <span>
                  {completed
                    ? "Read your mission debrief"
                    : event
                      ? "Resolve the latest incident"
                      : "Advance the mission"}
                </span>
                <ChevronRight size={16} />
              </button>
            </div>
            <div
              className={`science-tip ${e.warning || f.warnings.length ? "tip-warning" : ""}`}
            >
              <span className="tip-icon">
                {e.warning ? (
                  <Sun size={22} />
                ) : f.warnings.length ? (
                  <ShieldCheck size={22} />
                ) : (
                  <Zap size={22} />
                )}
              </span>
              <div>
                <strong>
                  {e.warning
                    ? "WATCH THE LIGHT"
                    : f.warnings.length
                      ? "CHECK YOUR RESERVES"
                      : "POWER EVERYTHING"}
                </strong>
                <p>
                  {e.warning ||
                    f.warnings[0] ||
                    "Your greenhouse and life support share the same power supply."}
                </p>
              </div>
            </div>
            <label className="plan-label" htmlFor="crew-plan">
              Crew assignment <CircleHelp size={13} />
            </label>
            <select
              id="crew-plan"
              value={m.plan}
              disabled={completed}
              onChange={(e) => onPlan(e.target.value as Plan)}
            >
              {PLANS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <p className="plan-description">
              {PLANS.find((p) => p.id === m.plan)!.description}
            </p>
            <div className="budget-row">
              <span>
                <Coins size={21} />
                Build budget
              </span>
              <strong>{m.budget} credits</strong>
            </div>
            <div className="cargo-row">
              <span>Cargo room</span>
              <span>
                {m.cargoUsed} / {CARGO_LIMIT} points used
              </span>
            </div>
            <button className="primary advance-button" onClick={onAdvance}>
              {completed
                ? "Open mission debrief"
                : event
                  ? "Review mission incident"
                  : `Advance one ${m.destination === "moon" ? "day" : "sol"}`}
              <ArrowRight size={20} />
            </button>
            <p className="autosave">
              {saving
                ? "Your progress saves automatically."
                : "Saving unavailable. This session still works."}
            </p>
          </section>
          <button className="science-band" onClick={onScience}>
            <span className="book-mark">
              <BookOpen size={26} />
            </span>
            <div>
              <strong>
                A little science.
                <br />A lot of possibility.
              </strong>
              <p>Explore the NASA science</p>
            </div>
            <ArrowRight size={18} />
          </button>
          <button className="help-link" onClick={onHelp}>
            <CircleHelp size={15} />
            First mission? Start with a little guidance.
          </button>
        </aside>
      </div>
    </>
  );
}
