import { useEffect, useState } from "react";
import { CheckCircle2, CodeXml, ExternalLink, Plus, X } from "lucide-react";
import { MissionControl } from "./components/MissionControl";
import { FlightSchool } from "./components/FlightSchool";
import { MissionLog } from "./components/MissionLog";
import { Overlays, type Overlay } from "./components/Overlays";
import {
  advance,
  buildModule,
  incidentAt,
  newMission,
  resolveIncident,
  resupply,
  type Mission,
  type ModuleId,
} from "./game/model";
import {
  HISTORY_KEY,
  MISSION_KEY,
  QUIZ_KEY,
  parseMission,
  readHistory,
  readQuiz,
} from "./game/storage";
type Page = "control" | "school" | "log";
function initialMission() {
  try {
    return parseMission(localStorage.getItem(MISSION_KEY)) ?? newMission();
  } catch {
    return newMission();
  }
}

export default function App() {
  const [mission, setMission] = useState<Mission>(initialMission);
  const [history, setHistory] = useState(readHistory);
  const [mastered, setMastered] = useState(readQuiz);
  const [page, setPage] = useState<Page>("control");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(true);
  useEffect(() => {
    try {
      localStorage.setItem(MISSION_KEY, JSON.stringify(mission));
      setSaving(true);
    } catch {
      setSaving(false);
    }
    if (mission.status !== "active")
      setHistory((old) =>
        [mission, ...old.filter((m) => m.id !== mission.id)].slice(0, 10),
      );
  }, [mission]);
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      setSaving(false);
    }
  }, [history]);
  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_KEY, JSON.stringify(mastered));
    } catch {
      setSaving(false);
    }
  }, [mastered]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4300);
    return () => clearTimeout(t);
  }, [toast]);
  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const doBuild = (id: ModuleId) => {
    const next = buildModule(mission, id);
    if (next !== mission) {
      setMission(next);
      setOverlay(null);
      setToast("New module installed. Your forecast has been updated.");
    }
  };
  const doAdvance = () => {
    if (mission.status !== "active") {
      setOverlay("result");
      return;
    }
    if (incidentAt(mission)) {
      setOverlay("event");
      return;
    }
    const next = advance(mission);
    setMission(next);
    if (next.status !== "active") setOverlay("result");
    else
      setToast(
        `${mission.destination === "moon" ? "Day" : "Sol"} ${next.turn} complete. +${next.science - mission.science} science. +4 maintenance credits.`,
      );
  };
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to mission content
      </a>
      <header className="site-header">
        <a
          className="brand"
          href="#"
          aria-label="Little Orbit mission control"
          onClick={(e) => {
            e.preventDefault();
            navigate("control");
          }}
        >
          <img src="/favicon.svg" alt="" />
          <span>little orbit</span>
        </a>
        <span className="brand-subtitle">JUNIOR ASTRONAUT MISSION TRAINER</span>
        <nav className="main-nav" aria-label="Main navigation">
          {[
            { id: "control", name: "Mission control" },
            { id: "school", name: "Flight school" },
            { id: "log", name: "Mission log" },
          ].map((p) => (
            <button
              key={p.id}
              aria-current={page === p.id ? "page" : undefined}
              className={page === p.id ? "active" : ""}
              onClick={() => navigate(p.id as Page)}
            >
              {p.name}
            </button>
          ))}
        </nav>
        <button
          className="primary new-mission"
          onClick={() => setOverlay("new")}
        >
          <Plus size={18} />
          <span>New mission</span>
        </button>
      </header>
      <main id="main-content" className="main-content">
        {!saving && (
          <div className="storage-notice" role="status">
            Browser storage is unavailable. Your current session works, but
            won’t survive a reload. Export your debrief to keep a copy.
          </div>
        )}
        {page === "control" ? (
          <MissionControl
            mission={mission}
            onForecast={() => setOverlay("forecast")}
            onModule={setOverlay}
            onCatalog={() => setOverlay("catalog")}
            onAdvance={doAdvance}
            onPlan={(plan) => setMission((m) => ({ ...m, plan }))}
            onScience={() => navigate("school")}
            onHelp={() => setOverlay("help")}
            saving={saving}
          />
        ) : page === "school" ? (
          <FlightSchool
            mastered={mastered}
            onMaster={(id) => setMastered((old) => ({ ...old, [id]: true }))}
          />
        ) : (
          <MissionLog mission={mission} history={history} />
        )}
      </main>
      <footer className="site-footer">
        <div>
          <strong>Made for a little curiosity.</strong>
          <p>
            An independent NASA Space Apps 2026 project · Science-informed,
            simplified for learning.
          </p>
        </div>
        <div className="footer-links">
          <button
            onClick={() => {
              navigate("school");
            }}
          >
            Science & sources
          </button>
          <a
            href="https://github.com/Yoriichi-0u0/little-orbit"
            target="_blank"
            rel="noopener noreferrer"
          >
            <CodeXml size={16} />
            GitHub
          </a>
          <a
            href="https://vercel.com/chia-0u0-s-projects/little-orbit"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vercel
            <ExternalLink size={13} />
          </a>
        </div>
      </footer>
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} />
          <span>{toast}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
      <Overlays
        overlay={overlay}
        mission={mission}
        onClose={() => setOverlay(null)}
        onBuild={doBuild}
        onSetOverlay={setOverlay}
        onResupply={() => {
          const next = resupply(mission);
          if (next !== mission) {
            setMission(next);
            setOverlay(null);
            setToast("Supply pack opened. Your reserves are replenished.");
          }
        }}
        onNew={(destination, crew, name) => {
          setMission(newMission(destination, crew, name));
          setOverlay(null);
          navigate("control");
          setToast("A new little beginning. Your crew is ready.");
        }}
        onResolve={(id) => {
          const next = resolveIncident(mission, id);
          if (next !== mission) {
            setMission(next);
            setOverlay(null);
            setToast("Decision recorded. Check your updated forecast.");
          }
        }}
        onLog={() => {
          setOverlay(null);
          navigate("log");
        }}
      />
    </div>
  );
}
