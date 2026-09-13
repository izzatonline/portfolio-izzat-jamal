"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Compass,
  Footprints,
  Globe2,
  MapPin,
  RotateCcw,
  X,
} from "lucide-react";
import { emotes, type Emote } from "./emotes";
import Joystick from "./joystick";
import { destinations } from "./destinations";
import type { WorldControls } from "./world-scene";
import "./world.css";

const Scene = dynamic(() => import("./world-scene"), { ssr: false });
const directions = [
  { key: "w", label: "Walk forward", Icon: ArrowUp },
  { key: "a", label: "Walk left", Icon: ArrowLeft },
  { key: "s", label: "Walk backward", Icon: ArrowDown },
  { key: "d", label: "Walk right", Icon: ArrowRight },
];

export default function WorldExplorer() {
  const controls = useRef<WorldControls>({
    keys: new Set(),
    paused: false,
    target: null,
    reset: false,
    view: "walk",
    emote: null,
    running: false,
    jump: false,
    joystick: { x: 0, y: 0 },
  });
  const [jumping, setJumping] = useState(false);
  const onJump = useCallback((value: boolean) => setJumping(value), []);
  const [activeEmote, setActiveEmote] = useState<Emote | null>(null);
  const [emotesOpen, setEmotesOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const onEmote = useCallback(
    (emote: Emote | null) => setActiveEmote(emote),
    [],
  );
  const [view, setView] = useState<"walk" | "globe">("walk");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [near, setNear] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [visited, setVisited] = useState<number[]>([]);
  const [travel, setTravel] = useState<number | null>(null);
  const performEmote = useCallback((emote: Emote) => {
    controls.current.keys.clear();
    controls.current.target = null;
    controls.current.emote = emote;
    setEmotesOpen(false);
    setTravel(null);
  }, []);
  const onJoystickInput = useCallback((x: number, y: number) => {
    controls.current.joystick = { x, y };
  }, []);
  const onJoystickMove = useCallback(() => setTravel(null), []);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setFailed(true), []);
  const onNear = useCallback((index: number | null) => {
    setNear(index);
    if (index !== null) setTravel(null);
  }, []);
  const open = useCallback((index: number) => {
    lastFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    controls.current.paused = true;
    controls.current.keys.clear();
    controls.current.target = null;
    setSelected(index);
    setTravel(null);
    setVisited((v) => (v.includes(index) ? v : [...v, index]));
  }, []);
  const close = useCallback(() => {
    dialog.current?.close();
    setSelected(null);
    controls.current.paused = false;
    lastFocus.current?.focus();
  }, []);
  useEffect(() => {
    if (selected !== null) dialog.current?.showModal();
  }, [selected]);
  useEffect(() => {
    const clear = () => {
      controls.current.keys.clear();
    };
    const down = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "escape") setEmotesOpen(false);
      if (
        e.target instanceof HTMLElement &&
        e.target.closest("input,textarea,select,dialog,[contenteditable=true]")
      )
        return;
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
          "shift",
        ].includes(key) &&
        !controls.current.paused
      ) {
        e.preventDefault();
        controls.current.keys.add(key);
        setTravel(null);
      }
      if (
        key === " " &&
        ready &&
        !failed &&
        selected === null &&
        !(e.target instanceof HTMLElement && e.target.closest("button,a"))
      ) {
        e.preventDefault();
        if (!e.repeat) controls.current.jump = true;
      }
      const emote = emotes.find((emote) => emote.key === key);
      if (
        emote &&
        ready &&
        !failed &&
        !jumping &&
        selected === null &&
        !e.repeat
      )
        performEmote(emote.id);
      if (key === "e" && near !== null && selected === null && !e.repeat)
        open(near);
    };
    const up = (e: KeyboardEvent) =>
      controls.current.keys.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
    };
  }, [near, selected, open, ready, failed, performEmote, jumping]);
  const go = (index: number) => {
    if (failed) {
      open(index);
      return;
    }
    controls.current.target = index;
    setTravel(index);
    // Leave navigation buttons so WASD works immediately after choosing a destination.
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
  };
  const destination = selected === null ? null : destinations[selected];
  return (
    <main className={`world-page world-view-${view}`}>
      <header className="world-header">
        <Link href="/" className="world-brand">
          <span>
            IJ<span className="world-brand-dot">.</span>
          </span>
          <span>
            Izzat Jamal<small>A SMALL WORLD, A FEW GOOD STORIES</small>
          </span>
        </Link>
        <Link href="/" className="world-back">
          <ArrowLeft size={15} />
          <span>Classic portfolio</span>
        </Link>
      </header>
      <div className="world-view-switch" role="group" aria-label="Camera view">
        {(["walk", "globe"] as const).map((mode) => (
          <button
            key={mode}
            aria-pressed={view === mode}
            onClick={() => {
              controls.current.view = mode;
              setView(mode);
            }}
          >
            {mode === "walk" ? <Footprints size={15} /> : <Globe2 size={15} />}
            {mode === "walk" ? "Walking view" : "Globe overview"}
          </button>
        ))}
      </div>
      <section className="world-intro" aria-labelledby="world-title">
        <p className="world-eyebrow">
          <span /> MADE IN KUALA LUMPUR, MALAYSIA
        </p>
        <h1 id="world-title">
          A little world.
          <br />
          <em>A bit of me.</em>
        </h1>
        <p>
          Take the scenic route through my work,
          <br className="world-desktop-break" /> ideas, and the things that make
          me, me.
        </p>
        <span className="world-edition">INTERACTIVE PORTFOLIO · VOL. 01</span>
      </section>
      {!failed && (
        <Scene
          controls={controls}
          onNear={onNear}
          onReady={onReady}
          onError={onError}
          onEmote={onEmote}
          onJump={onJump}
        />
      )}
      {(!ready || failed) && (
        <div className="world-loading" role="status">
          <Globe2 size={32} />
          <strong>
            {failed ? "Let’s explore another way." : "Growing a little world…"}
          </strong>
          <span>
            {failed
              ? "3D isn’t available in this browser. Choose any destination below to read its story."
              : "Planting trees. Putting the kopi on."}
          </span>
        </div>
      )}
      <div className="world-location">
        <MapPin size={13} /> 3.1390° N, 101.6869° E{" "}
        <span>HOME, MORE OR LESS.</span>
      </div>
      <aside className="world-guide" aria-label="World controls">
        <div className="world-guide-heading">
          <Compass size={18} />
          <span>A SMALL FIELD GUIDE</span>
          <button
            aria-label="Reset to the arrival clearing"
            title="Reset world"
            onClick={() => {
              controls.current.reset = true;
              setTravel(null);
            }}
          >
            <RotateCcw size={15} />
          </button>
        </div>
        <p>Five places. One curious wanderer.</p>
        <p className="world-guide-hint">
          Walk with <kbd>W A S D</kbd> or arrow keys.
          <br />
          Hold <kbd>Shift</kbd> to run. <kbd>Space</kbd> to jump.
          <br />
          Near a spot, press <kbd>E</kbd> to explore.
        </p>
        <div className="world-progress">
          <span>{visited.length} / 5 stories discovered</span>
          <div>
            {destinations.map((d, i) => (
              <i
                key={d.id}
                className={visited.includes(i) ? "is-visited" : ""}
              />
            ))}
          </div>
        </div>
      </aside>
      <div className="world-prompt" aria-live="polite">
        {near !== null && !failed ? (
          <button onClick={() => open(near)}>
            <span className="world-prompt-icon">
              <MapPin size={19} />
            </span>
            <span>
              <small>YOU’VE FOUND</small>
              <strong>{destinations[near].name}</strong>
            </span>
            <span className="world-prompt-action">
              Explore <kbd>E</kbd>
              <ArrowRight size={15} />
            </span>
          </button>
        ) : travel !== null ? (
          <p>
            <Footprints size={16} /> Walking to{" "}
            {destinations[travel].name.toLowerCase()}…
          </p>
        ) : ready && !failed ? (
          <p>
            <Footprints size={16} /> Follow a path, or choose a destination
            below.
          </p>
        ) : null}
      </div>
      <div className="world-emote-controls">
        <div className="world-emote-status" role="status">
          {activeEmote
            ? `${emotes.find((e) => e.id === activeEmote)?.label} · move to stop`
            : ""}
        </div>
        <div className="world-action-buttons">
          <button
            disabled={!ready || failed || jumping}
            onClick={() => {
              controls.current.jump = true;
            }}
            aria-label="Jump (Space)"
          >
            {jumping ? "Jumping…" : "↑ Jump"}
          </button>
          <button
            aria-pressed={running}
            disabled={!ready || failed}
            onClick={() => {
              controls.current.running = !running;
              setRunning(!running);
            }}
          >
            {running ? "Running" : "Walk / Run"}
          </button>
          <button
            aria-expanded={emotesOpen}
            aria-controls="world-emote-menu"
            disabled={!ready || failed}
            onClick={() => setEmotesOpen(!emotesOpen)}
          >
            ☺ Emotes
          </button>
        </div>
        {emotesOpen && (
          <div
            id="world-emote-menu"
            className="world-emote-menu"
            role="group"
            aria-label="Character emotes"
          >
            {emotes.map((emote) => (
              <button
                key={emote.id}
                aria-pressed={activeEmote === emote.id}
                disabled={jumping}
                onClick={() => performEmote(emote.id)}
              >
                <span aria-hidden="true">{emote.icon}</span>
                {emote.label}
                <kbd>{emote.key}</kbd>
              </button>
            ))}
          </div>
        )}
      </div>
      <Joystick
        onInput={onJoystickInput}
        disabled={!ready || failed || selected !== null}
        onMove={onJoystickMove}
      />
      <div className="world-dpad" aria-label="Touch movement controls">
        {directions.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`world-direction-${key}`}
            aria-label={label}
            disabled={!ready || failed}
            onPointerDown={(e) => {
              e.preventDefault();
              e.currentTarget.setPointerCapture(e.pointerId);
              controls.current.keys.add(key);
              setTravel(null);
            }}
            onPointerUp={() => controls.current.keys.delete(key)}
            onPointerCancel={() => controls.current.keys.delete(key)}
            onLostPointerCapture={() => controls.current.keys.delete(key)}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                controls.current.keys.add(key);
              }
            }}
            onKeyUp={() => controls.current.keys.delete(key)}
            onBlur={() => controls.current.keys.delete(key)}
          >
            <Icon size={19} />
          </button>
        ))}
      </div>
      <nav className="world-destinations" aria-label="Portfolio destinations">
        <div className="world-destinations-label">
          <Compass size={14} />
          <span>WHERE TO?</span>
          <small>Choose a stop to walk there</small>
        </div>
        <div className="world-stops">
          {destinations.map((d, i) => (
            <div
              className={`world-stop ${near === i ? "is-near" : ""}`}
              key={d.id}
            >
              <button
                className="world-go"
                onClick={() => go(i)}
                disabled={!ready && !failed}
                aria-label={`Walk to ${d.name}`}
              >
                <span style={{ background: d.color }}>
                  {visited.includes(i) ? (
                    <Check size={15} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <strong>{d.name}</strong>
                <ArrowRight size={14} />
              </button>
              <button
                className="world-read"
                onClick={() => open(i)}
                aria-label={`Read ${d.name} story without walking`}
              >
                Read story
              </button>
            </div>
          ))}
        </div>
      </nav>
      <footer className="world-footer">
        <span>BUILT WITH CURIOSITY & A LITTLE CODE.</span>
        <span>TAKE YOUR TIME. THERE’S NO WRONG TURN.</span>
      </footer>
      <dialog
        ref={dialog}
        className="world-dialog"
        aria-labelledby="world-story-title"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {destination && (
          <article>
            <button
              className="world-close"
              onClick={close}
              aria-label="Close story"
            >
              <X size={20} />
            </button>
            <p className="world-eyebrow">{destination.category}</p>
            <span
              className="world-story-orb"
              style={{ background: destination.color }}
            >
              <Globe2 size={42} />
            </span>
            <h2 id="world-story-title">{destination.title}</h2>
            <h3>{destination.subtitle}</h3>
            <p className="world-story-text">{destination.text}</p>
            <ul>
              {destination.facts.map((f) => (
                <li key={f}>
                  <span style={{ background: destination.color }} />
                  {f}
                </li>
              ))}
            </ul>
            <Link className="world-story-link" href={destination.href}>
              {destination.link}
              <ArrowRight size={17} />
            </Link>
            <button className="world-continue" onClick={close}>
              Keep wandering
            </button>
          </article>
        )}
      </dialog>
    </main>
  );
}
