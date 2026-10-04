import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { LESSONS, SOURCES } from "../data/science";
import { SourceLink, lessonIcon } from "./Primitives";
export function FlightSchool({
  mastered,
  onMaster,
}: {
  mastered: Record<string, boolean>;
  onMaster: (id: string) => void;
}) {
  const [selected, setSelected] = useState(LESSONS[0].id);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [tab, setTab] = useState<"lessons" | "sources">("lessons");
  const lesson = LESSONS.find((l) => l.id === selected)!;
  const Icon = lessonIcon(lesson.icon);
  const answer = answers[lesson.id];
  return (
    <>
      <section className="page-intro">
        <div>
          <h1>Curiosity looks good on you.</h1>
          <p>
            Little lessons for big decisions. Discover the NASA science behind
            your outpost.
          </p>
        </div>
        <div className="learning-progress">
          <GraduationCap size={24} />
          <strong>{Object.keys(mastered).length} / 6</strong>
          <span>lessons mastered</span>
        </div>
      </section>
      <div className="page-tabs">
        <button
          className={tab === "lessons" ? "active" : ""}
          onClick={() => setTab("lessons")}
        >
          Flight school
        </button>
        <button
          className={tab === "sources" ? "active" : ""}
          onClick={() => setTab("sources")}
        >
          Source library · {SOURCES.length} references
        </button>
      </div>
      {tab === "lessons" ? (
        <div className="school-layout">
          <nav className="lesson-nav" aria-label="Science lessons">
            {LESSONS.map((l) => {
              const I = lessonIcon(l.icon);
              return (
                <button
                  key={l.id}
                  aria-current={selected === l.id ? "page" : undefined}
                  className={selected === l.id ? "selected" : ""}
                  onClick={() => setSelected(l.id)}
                >
                  <I size={22} />
                  <div>
                    <strong>{l.subtitle}</strong>
                    <span>{l.title}</span>
                  </div>
                  {mastered[l.id] ? (
                    <CheckCircle2 className="mastered" size={18} />
                  ) : (
                    <ArrowRight size={17} />
                  )}
                </button>
              );
            })}
            <div className="teacher-note">
              <BookOpen size={19} />
              <h3>Bring it to the classroom.</h3>
              <p>
                Predict a resource change, make one decision, then compare your
                forecast with the mission log. Try two different strategies.
              </p>
              <span>Suggested ages 10+ · 15–25 minutes</span>
            </div>
          </nav>
          <article className="lesson-content" key={lesson.id}>
            <div className="lesson-symbol">
              <Icon size={32} />
            </div>
            <p className="lesson-kicker">{lesson.subtitle}</p>
            <h2>{lesson.title}</h2>
            <p className="lesson-copy">{lesson.content}</p>
            <div className="connection">
              <strong>In your little outpost</strong>
              <p>{lesson.connection}</p>
            </div>
            <div className="lesson-sources">
              {lesson.sources.map((id) => (
                <SourceLink id={id} key={id} />
              ))}
            </div>
            <section className="knowledge-check">
              <span className="mini-label">CHECK YOUR UNDERSTANDING</span>
              <h3>{lesson.question}</h3>
              <div className="answer-list">
                {lesson.answers.map((a, i) => (
                  <button
                    key={a}
                    className={
                      answer === i
                        ? i === lesson.correct
                          ? "answer-correct"
                          : "answer-wrong"
                        : ""
                    }
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, [lesson.id]: i }));
                      if (i === lesson.correct) onMaster(lesson.id);
                    }}
                  >
                    <span className="answer-letter">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{a}</span>
                    {answer === i && i === lesson.correct && (
                      <Check size={18} />
                    )}
                  </button>
                ))}
              </div>
              {answer !== undefined && (
                <div
                  className={`answer-feedback ${answer === lesson.correct ? "correct" : ""}`}
                  role="status"
                >
                  <strong>
                    {answer === lesson.correct
                      ? "You’ve got it."
                      : "Let’s think that through."}
                  </strong>
                  <p>
                    {answer === lesson.correct
                      ? lesson.explanation
                      : "Follow the resources through the system, then try another answer. You can reread the explanation above."}
                  </p>
                </div>
              )}
            </section>
            <div className="discussion">
              <h3>A question to take with you.</h3>
              <p>{lesson.discussion}</p>
            </div>
            <button
              className="text-button"
              onClick={() =>
                setSelected(
                  LESSONS[
                    (LESSONS.findIndex((l) => l.id === selected) + 1) %
                      LESSONS.length
                  ].id,
                )
              }
            >
              Next little lesson <ArrowRight size={17} />
            </button>
          </article>
        </div>
      ) : (
        <section className="source-library">
          <div className="source-intro">
            <h2>Real science. Open sources.</h2>
            <p>
              Research checked on 4 October 2026. {SOURCES.length - 1} NASA and
              NASA JPL references plus the original challenge. Each link opens
              the primary source.
            </p>
          </div>
          {SOURCES.map((s, i) => (
            <a
              className="source-row"
              href={s.url}
              key={s.id}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="source-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <span className="mini-label">{s.publisher}</span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
              <ExternalLink size={19} />
            </a>
          ))}
          <div className="model-note">
            <h3>Science-informed. Simplified for learning.</h3>
            <p>
              Resource values are game units, not liters, kilograms, energy
              measurements, or radiation doses. Credits, hardware rates, crop
              time, and incident dates are original teaching settings. The art
              is an original AI-generated illustration. This independent project
              is not endorsed by NASA.
            </p>
            <a
              className="source-link"
              href="https://github.com/Yoriichi-0u0/little-orbit/blob/main/docs/research.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the complete research & model notes{" "}
              <ExternalLink size={14} />
            </a>
          </div>
        </section>
      )}
    </>
  );
}
