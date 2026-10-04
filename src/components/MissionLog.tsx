import { useState } from "react";
import {
  ArrowDownToLine,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  Printer,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { RESOURCE_META, downloadText } from "./Primitives";
import {
  RESOURCE_KEYS,
  dayLabel,
  debrief,
  type Mission,
  type Resource,
} from "../game/model";
export function MissionLog({
  mission: m,
  history,
}: {
  mission: Mission;
  history: Mission[];
}) {
  const [resource, setResource] = useState<Resource>("water");
  const [expanded, setExpanded] = useState(true);
  const samples = m.log.filter(
    (l) => l.stocks && (l.type === "arrival" || l.type === "day"),
  );
  const max =
    Math.ceil(Math.max(100, ...samples.map((l) => l.stocks![resource])) / 20) *
    20;
  const points = samples
    .map(
      (l, i) =>
        `${42 + (i / 14) * 560},${170 - (l.stocks![resource] / max) * 140}`,
    )
    .join(" ");
  return (
    <>
      <section className="page-intro">
        <div>
          <h1>Every choice tells a story.</h1>
          <p>
            Your mission, one little decision at a time. Notice what changed,
            then try something new.
          </p>
        </div>
        <div className="report-actions">
          <button
            className="secondary"
            onClick={() =>
              downloadText(
                debrief(m),
                `little-orbit-${m.destination}-debrief.md`,
              )
            }
          >
            <ArrowDownToLine size={16} />
            Export debrief
          </button>
          <button
            className="icon-button"
            onClick={() => window.print()}
            aria-label="Print classroom report"
          >
            <Printer size={20} />
          </button>
        </div>
      </section>
      <section className="mission-summary">
        <div>
          <span className="mini-label">{m.name}</span>
          <h2>
            {m.status === "success"
              ? "Mission accomplished."
              : m.status === "evacuated"
                ? "A safe return. A new lesson."
                : "Your story is still unfolding."}
          </h2>
          <p>
            {m.status === "active"
              ? "Keep predicting, building, and learning. Your next decision matters."
              : m.status === "success"
                ? "You completed the mission. Compare your resource reserves and science with another strategy."
                : "Evacuation brought your crew home. Use the journal to find the first warning you would act on next time."}
          </p>
        </div>
        <div className="summary-stat">
          <Rocket size={20} />
          <strong>{m.turn} / 14</strong>
          <span>{m.destination === "moon" ? "days" : "sols"} completed</span>
        </div>
        <div className="summary-stat">
          <FlaskConical size={20} />
          <strong>{m.science}</strong>
          <span>science points</span>
        </div>
        <div className="summary-stat">
          <ShieldCheck size={20} />
          <strong>{m.resources.health}</strong>
          <span>crew health / 100</span>
        </div>
      </section>
      <section className="history-chart">
        <div className="section-row">
          <h2>A forecast becomes a story.</h2>
          <span className="muted">Normalized game units</span>
        </div>
        <div className="chart-tabs" aria-label="Chart resource">
          {RESOURCE_KEYS.map((k) => (
            <button
              key={k}
              aria-pressed={resource === k}
              className={resource === k ? "active" : ""}
              onClick={() => setResource(k)}
            >
              {RESOURCE_META[k].name}
            </button>
          ))}
        </div>
        <svg
          className="resource-chart"
          viewBox="0 0 640 205"
          role="img"
          aria-label={`${RESOURCE_META[resource].name} stock history, ${samples.length} recorded samples. Current stock ${m.resources[resource]} game units.`}
        >
          {[0, 0.5, 1].map((v) => (
            <g key={v}>
              <line
                x1="42"
                x2="605"
                y1={170 - v * 140}
                y2={170 - v * 140}
                stroke="#dce5e7"
                strokeDasharray="3 5"
              />
              <text
                x="30"
                y={175 - v * 140}
                textAnchor="end"
                fill="#62727d"
                fontSize="11"
              >
                {max * v}
              </text>
            </g>
          ))}
          <polyline
            points={points}
            fill="none"
            stroke={RESOURCE_META[resource].color}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {samples.map((l, i) => (
            <circle
              key={i}
              cx={42 + (i / 14) * 560}
              cy={170 - (l.stocks![resource] / max) * 140}
              r="4"
              fill={RESOURCE_META[resource].color}
            >
              <title>
                {i === 0 ? "Arrival" : `${dayLabel(m)} ${l.turn + 1}`}:{" "}
                {l.stocks![resource]} units
              </title>
            </circle>
          ))}
          <text x="42" y="197" fill="#62727d" fontSize="11">
            Arrival
          </text>
          <text x="602" y="197" textAnchor="end" fill="#62727d" fontSize="11">
            {dayLabel(m)} 14
          </text>
        </svg>
        <details className="chart-data">
          <summary>Read the recorded values</summary>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Recorded point</th>
                  {RESOURCE_KEYS.map((k) => (
                    <th key={k}>{RESOURCE_META[k].name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {samples.map((s, i) => (
                  <tr key={i}>
                    <td>
                      {i === 0 ? "Arrival" : `${dayLabel(m)} ${s.turn + 1}`}
                    </td>
                    {RESOURCE_KEYS.map((k) => (
                      <td key={k}>{s.stocks![k]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>
      <section className="journal">
        <div className="section-row">
          <h2>
            <ClipboardList size={22} />
            The mission journal
          </h2>
          <button
            className="text-button"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Compact view" : "Show explanations"}
          </button>
        </div>
        {[...m.log].reverse().map((l, i) => (
          <article key={`${l.turn}-${i}`} className="journal-row">
            <span className={`journal-marker marker-${l.type}`}>
              {l.type === "day" ? <CheckCircle2 size={17} /> : <span />}
            </span>
            <div>
              <span className="mini-label">
                {dayLabel(m)} {l.turn + 1} ·{" "}
                {l.type === "day" ? "MISSION UPDATE" : l.type.toUpperCase()}
              </span>
              <h3>{l.title}</h3>
              {expanded && <p>{l.detail}</p>}
            </div>
          </article>
        ))}
      </section>
      <section className="saved-missions">
        <h2>Your little mission collection.</h2>
        <p>
          Completed runs saved on this browser. Compare strategies, science, and
          crew outcomes.
        </p>
        {history.length === 0 ? (
          <div className="empty-history">
            <Rocket size={25} />
            <p>
              Your first completed mission belongs here. Keep going, commander.
            </p>
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Outpost</th>
                  <th>World</th>
                  <th>Outcome</th>
                  <th>Science</th>
                  <th>Health</th>
                  <th>Report</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id}>
                    <td>
                      <strong>{h.name}</strong>
                    </td>
                    <td>
                      {h.destination === "moon" ? "Moon" : "Mars"} · {h.crew}{" "}
                      crew
                    </td>
                    <td>
                      {h.status === "success" ? "Completed" : "Evacuated"}
                    </td>
                    <td>{h.science}</td>
                    <td>{h.resources.health}</td>
                    <td>
                      <button
                        className="text-button"
                        onClick={() =>
                          downloadText(
                            debrief(h),
                            `little-orbit-${h.destination}-${h.turn}-debrief.md`,
                          )
                        }
                        aria-label={`Export debrief for ${h.name}`}
                      >
                        <ArrowDownToLine size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <div className="discussion report-reflection">
        <h3>Take a little time to reflect.</h3>
        <ol>
          <li>
            Which resource needed the most attention? Trace its dependencies.
          </li>
          <li>
            What happened when you added a greenhouse or changed the crew
            assignment?
          </li>
          <li>
            How would you prepare differently for the solar event and low-light
            interval?
          </li>
          <li>Which NASA source explains your most important decision?</li>
        </ol>
      </div>
    </>
  );
}
