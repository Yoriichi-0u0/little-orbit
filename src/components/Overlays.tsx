import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  BatteryCharging,
  Check,
  Coins,
  Moon,
  Package,
  Rocket,
  ShieldCheck,
  Sparkles,
  Sun,
  Telescope,
} from "lucide-react";
import { Modal } from "./Modal";
import {
  ModuleArt,
  RESOURCE_META,
  SourceLink,
  downloadText,
} from "./Primitives";
import {
  CARGO_LIMIT,
  MODULES,
  PLANS,
  RESOURCE_KEYS,
  buildReason,
  dayLabel,
  debrief,
  forecast,
  incidentAt,
  type Destination,
  type Mission,
  type ModuleId,
} from "../game/model";
export type Overlay =
  | "forecast"
  | "catalog"
  | "new"
  | "help"
  | "event"
  | "result"
  | ModuleId
  | null;
interface Props {
  overlay: Overlay;
  mission: Mission;
  onClose: () => void;
  onBuild: (id: ModuleId) => void;
  onResupply: () => void;
  onNew: (destination: Destination, crew: 2 | 3, name: string) => void;
  onResolve: (id: string) => void;
  onSetOverlay: (overlay: Overlay) => void;
  onLog: () => void;
}

function NewMissionForm({ onNew }: Pick<Props, "onNew">) {
  const [destination, setDestination] = useState<Destination>("moon");
  const [crew, setCrew] = useState<2 | 3>(2);
  const [name, setName] = useState("Luna Base");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNew(destination, crew, name);
      }}
    >
      <p className="modal-lead">
        Pick a world. Bring your curiosity. Your little adventure starts here.
      </p>
      <span className="form-label">Choose your destination</span>
      <div className="destination-options">
        {(["moon", "mars"] as const).map((d) => (
          <button
            key={d}
            type="button"
            className={destination === d ? "selected" : ""}
            aria-pressed={destination === d}
            onClick={() => {
              setDestination(d);
              if (name === "Luna Base" || name === "Ares Base")
                setName(d === "moon" ? "Luna Base" : "Ares Base");
            }}
          >
            <span className={`planet-disc ${d}`} />
            <strong>{d === "moon" ? "The Moon" : "Mars"}</strong>
            <p>
              {d === "moon"
                ? "A polar ridge. Long shadows. Your first giant leap."
                : "A dusty horizon. Less sunlight. A new kind of challenge."}
            </p>
            <span>
              {d === "moon" ? "14 Earth days" : "14 sols · each ≈24.6 hours"}
            </span>
            {destination === d && (
              <Check className="destination-check" size={18} />
            )}
          </button>
        ))}
      </div>
      <label className="form-label" htmlFor="outpost-name">
        Name your outpost
      </label>
      <input
        id="outpost-name"
        value={name}
        maxLength={32}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your little base"
        autoComplete="off"
      />
      <span className="form-label">Crew size</span>
      <div className="crew-options">
        {([2, 3] as const).map((c) => (
          <button
            type="button"
            key={c}
            aria-pressed={crew === c}
            className={crew === c ? "selected" : ""}
            onClick={() => setCrew(c)}
          >
            <strong>{c} astronauts</strong>
            <span>
              {c === 2 ? "A little room to learn" : "A little more challenging"}
            </span>
          </button>
        ))}
      </div>
      <p className="muted setup-note">
        Launch replaces the current mission. Completed runs stay in this
        browser. No accounts or personal details needed.
      </p>
      <button className="primary full-width" type="submit">
        Let’s build something extraordinary <Rocket size={18} />
      </button>
    </form>
  );
}

export function Overlays({
  overlay,
  mission: m,
  onClose,
  onBuild,
  onResupply,
  onNew,
  onResolve,
  onSetOverlay,
  onLog,
}: Props) {
  if (!overlay) return null;
  if (overlay === "new")
    return (
      <Modal title="A new world is waiting." onClose={onClose}>
        <NewMissionForm onNew={onNew} />
      </Modal>
    );
  if (overlay === "help")
    return (
      <Modal title="Welcome, little explorer." onClose={onClose}>
        <p className="modal-lead">
          You’re in charge of a space outpost. Keep your crew healthy for 14
          turns, and see how much science you can discover.
        </p>
        <div className="guide-steps">
          {[
            {
              Icon: Telescope,
              title: "Look a little ahead.",
              body: "Open the resource forecast. It predicts the exact next-turn stocks with your current modules and crew assignment.",
            },
            {
              Icon: Package,
              title: "Build with a purpose.",
              body: "Add a module when it solves a real problem. Each one costs credits and cargo space; some also draw water and power.",
            },
            {
              Icon: ShieldCheck,
              title: "Take care of your people.",
              body: "Switch between research, exploration, rest, and shelter. Read incidents before advancing. Recovery and supply packs can help.",
            },
            {
              Icon: Sparkles,
              title: "Learn, then try again.",
              body: "Read the NASA science in Flight school. Compare the journal, export your debrief, and replay with a different strategy.",
            },
          ].map(({ Icon, title, body }, i) => (
            <div key={title}>
              <span className="guide-number">{i + 1}</span>
              <Icon size={22} />
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="model-note-small">
          Stocks and health use simplified game units. A Moon turn is an Earth
          day; a Mars turn is a sol. The science explains the relationships,
          while the numbers are tuned for learning.
        </p>
        <button className="primary full-width" onClick={onClose}>
          Ready for a little adventure <ArrowRight size={18} />
        </button>
      </Modal>
    );
  if (overlay === "forecast") {
    const f = forecast(m);
    return (
      <Modal title="A little foresight goes a long way." onClose={onClose} wide>
        <p className="modal-lead">
          Your next {m.destination === "moon" ? "day" : "sol"}, with{" "}
          <strong>
            {PLANS.find((p) => p.id === m.plan)!.name.toLowerCase()}
          </strong>
          . Predictions use your current stocks, installed hardware, and
          scheduled conditions.
        </p>
        <div className="forecast-energy">
          <BatteryCharging size={24} />
          <div>
            <span>Power generated</span>
            <strong>{f.generation}</strong>
          </div>
          <ArrowRight size={20} />
          <div>
            <span>Power needed</span>
            <strong>{f.demand}</strong>
          </div>
          <div>
            <span>Systems working at</span>
            <strong>{Math.round(f.effectiveness * 100)}%</strong>
          </div>
        </div>
        <div className="table-scroll">
          <table className="forecast-table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Now</th>
                <th>Change</th>
                <th>Next turn</th>
              </tr>
            </thead>
            <tbody>
              {RESOURCE_KEYS.map((k) => {
                const Icon = RESOURCE_META[k].icon;
                return (
                  <tr key={k}>
                    <th>
                      <Icon size={18} />
                      {RESOURCE_META[k].name}
                    </th>
                    <td>{m.resources[k]}</td>
                    <td className={f.delta[k] < 0 ? "negative" : "positive"}>
                      {f.delta[k] > 0 ? "+" : ""}
                      {f.delta[k]}
                    </td>
                    <td>
                      <strong>{f.next[k]}</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="forecast-production">
          <span>
            Oxygen made <b>+{f.oxygenMade}</b>
          </span>
          <span>
            Water recovered <b>+{f.waterReturned}</b>
          </span>
          <span>
            Food grown <b>+{f.foodGrown}</b>
          </span>
          <span>
            Science earned <b>+{f.science}</b>
          </span>
        </div>
        {f.warnings.length > 0 && (
          <div className="forecast-warnings">
            <strong>Something to plan for</strong>
            {f.warnings.map((w) => (
              <p key={w}>{w}</p>
            ))}
          </div>
        )}
        {incidentAt(m) && (
          <p className="model-note-small">
            An incident needs a decision before you advance. Its immediate
            resource costs will update this forecast.
          </p>
        )}
        <p className="model-note-small">
          Normalized game units. Not real engineering measurements. A new crop
          needs two growing turns before producing food.
        </p>
        <button className="primary full-width" onClick={onClose}>
          Back to mission control <ArrowRight size={18} />
        </button>
      </Modal>
    );
  }
  if (overlay === "catalog")
    return (
      <Modal title="Good things come in modules." onClose={onClose} wide>
        <div className="catalog-summary">
          <span>
            <Coins size={17} />
            {m.budget} credits
          </span>
          <span>
            <Package size={17} />
            {CARGO_LIMIT - m.cargoUsed} cargo points free
          </span>
        </div>
        <div className="hardware-list">
          {MODULES.map((d) => (
            <article key={d.id}>
              <ModuleArt id={d.id} atlas={d.atlas} />
              <div>
                <h3>
                  {d.name} <span>{m.modules[d.id]} installed</span>
                </h3>
                <p>{d.effect}</p>
                <span className="muted">
                  {d.cost} credits · {d.cargo} cargo points
                </span>
              </div>
              <button className="secondary" onClick={() => onSetOverlay(d.id)}>
                Inspect
                <ArrowRight size={14} />
              </button>
            </article>
          ))}
        </div>
        <div className="supply-pack">
          <div>
            <h3>A little backup never hurts.</h3>
            <p>
              Open pre-landed supplies: up to +25 water, +15 oxygen, +15 food.
            </p>
          </div>
          <button
            className="primary"
            disabled={m.budget < 18 || m.status !== "active"}
            onClick={onResupply}
          >
            Supply pack · 18 credits
          </button>
        </div>
      </Modal>
    );
  if (overlay === "event") {
    const event = incidentAt(m);
    if (!event) return null;
    return (
      <Modal title={event.title} onClose={onClose}>
        <div className="event-symbol">
          {event.turn === 4 ? (
            <Sun size={31} />
          ) : event.turn === 6 ? (
            <Moon size={31} />
          ) : (
            <Package size={31} />
          )}
        </div>
        <p className="modal-lead">{event.description}</p>
        <div className="incident-options">
          {event.options.map((o) => {
            const unavailable =
              ((o.id === "patch" || o.id === "repair") && m.budget < 12) ||
              (o.id === "manual" && m.resources.water < 10);
            return (
              <button
                key={o.id}
                onClick={() => onResolve(o.id)}
                disabled={unavailable}
              >
                <div>
                  <strong>{o.label}</strong>
                  <span>
                    {o.cost}
                    {unavailable ? " · Not enough reserves" : ""}
                  </span>
                  <p>{o.explanation}</p>
                </div>
                <ArrowRight size={18} />
              </button>
            );
          })}
        </div>
        <SourceLink id={event.source} />
        <p className="model-note-small">
          This is a scripted learning scenario. Resolve it, then check the
          updated forecast before advancing.
        </p>
      </Modal>
    );
  }
  if (overlay === "result")
    return (
      <Modal
        title={
          m.status === "success"
            ? "You did a little extraordinary."
            : "Every mission has a lesson."
        }
        onClose={onClose}
      >
        <div className="result-symbol">
          {m.status === "success" ? (
            <Rocket size={38} />
          ) : (
            <ShieldCheck size={38} />
          )}
        </div>
        <p className="modal-lead">
          {m.status === "success"
            ? `${m.name} completed all 14 ${m.destination === "moon" ? "days" : "sols"}. Your crew made it, and your decisions made the difference.`
            : `Your crew returned safely after ${m.turn} ${dayLabel(m).toLowerCase()}${m.turn === 1 ? "" : "s"}. Look for the earliest warning in your journal, then try a new plan.`}
        </p>
        <div className="result-stats">
          <div>
            <strong>{m.science}</strong>
            <span>science points</span>
          </div>
          <div>
            <strong>{m.resources.health}</strong>
            <span>crew health / 100</span>
          </div>
          <div>
            <strong>{m.turn} / 14</strong>
            <span>turns completed</span>
          </div>
        </div>
        <div className="discussion">
          <h3>A question for your next adventure.</h3>
          <p>
            Which single decision would you change? Compare its power, water,
            and health forecast before you commit.
          </p>
        </div>
        <button className="primary full-width" onClick={onLog}>
          Explore your mission journal <ArrowRight size={18} />
        </button>
        <button
          className="secondary full-width result-export"
          onClick={() =>
            downloadText(debrief(m), `little-orbit-${m.destination}-debrief.md`)
          }
        >
          <ArrowDownToLine size={17} />
          Download classroom debrief
        </button>
      </Modal>
    );
  const d = MODULES.find((x) => x.id === overlay)!;
  const reason = buildReason(m, d.id);
  return (
    <Modal title={d.name} onClose={onClose}>
      <div className="hardware-detail-art">
        <ModuleArt id={d.id} atlas={d.atlas} />
      </div>
      <p className="modal-lead">{d.description}</p>
      <div className="module-facts">
        <span>
          <Coins size={18} />
          <strong>{d.cost}</strong> credits
        </span>
        <span>
          <Package size={18} />
          <strong>{d.cargo}</strong> cargo points
        </span>
        <span>
          <Check size={18} />
          <strong>{m.modules[d.id]}</strong> installed
        </span>
      </div>
      <div className="connection">
        <strong>What it does</strong>
        <p>{d.effect}</p>
      </div>
      <div className="module-tradeoff">
        <strong>The trade-off</strong>
        <p>{d.tradeoff}</p>
      </div>
      <SourceLink id={d.source} />
      {d.id === "greenhouse" && (
        <p className="model-note-small">
          Real plants need more than two days to mature. Growing time is
          compressed in this game.
        </p>
      )}
      <button
        className="primary full-width module-install"
        disabled={Boolean(reason)}
        onClick={() => onBuild(d.id)}
      >
        {reason || `Install ${d.name.toLowerCase()}`}
        <PlusIcon />
      </button>
      <button
        className="text-button centered"
        onClick={() => onSetOverlay("catalog")}
      >
        Explore all hardware <ArrowRight size={16} />
      </button>
    </Modal>
  );
}
function PlusIcon() {
  return (
    <span aria-hidden="true" className="plus-icon">
      <Package size={18} />
    </span>
  );
}
