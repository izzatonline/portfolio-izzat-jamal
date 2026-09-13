"use client";

import { useCallback, useEffect, useRef } from "react";

const RADIUS = 42;
const DEAD_ZONE = 7;

export default function Joystick({
  onInput,
  disabled,
  onMove,
}: {
  onInput: (x: number, y: number) => void;
  disabled: boolean;
  onMove: () => void;
}) {
  const knob = useRef<HTMLSpanElement>(null);
  const pointer = useRef<number | null>(null);
  const center = useRef({ x: 0, y: 0 });
  const reset = useCallback(() => {
    pointer.current = null;
    onInput(0, 0);
    if (knob.current) knob.current.style.transform = "translate(0px, 0px)";
  }, [onInput]);
  useEffect(() => {
    if (disabled) reset();
    const hidden = () => {
      if (document.hidden) reset();
    };
    const media = window.matchMedia("(max-width: 760px), (pointer: coarse)");
    const layoutChanged = () => reset();
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", hidden);
    media.addEventListener("change", layoutChanged);
    window.addEventListener("resize", layoutChanged);
    return () => {
      reset();
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", hidden);
      media.removeEventListener("change", layoutChanged);
      window.removeEventListener("resize", layoutChanged);
    };
  }, [disabled, reset]);
  const move = (x: number, y: number) => {
    const dx = x - center.current.x,
      dy = y - center.current.y;
    const length = Math.hypot(dx, dy);
    const clamped = Math.min(length, RADIUS);
    const strength = Math.max(0, (clamped - DEAD_ZONE) / (RADIUS - DEAD_ZONE));
    onInput(
      length ? (dx / length) * strength : 0,
      length ? (dy / length) * strength : 0,
    );
    if (knob.current)
      knob.current.style.transform = `translate(${length ? (dx / length) * clamped : 0}px, ${length ? (dy / length) * clamped : 0}px)`;
    if (strength > 0) onMove();
  };
  return (
    <div className="world-joystick">
      <button
        className="world-joystick-base"
        disabled={disabled}
        aria-label="Movement joystick"
        aria-describedby="joystick-help"
        onPointerDown={(event) => {
          if (pointer.current !== null || disabled) return;
          event.preventDefault();
          const bounds = event.currentTarget.getBoundingClientRect();
          center.current = {
            x: bounds.left + bounds.width / 2,
            y: bounds.top + bounds.height / 2,
          };
          pointer.current = event.pointerId;
          event.currentTarget.setPointerCapture(event.pointerId);
          move(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => {
          if (!disabled && pointer.current === event.pointerId)
            move(event.clientX, event.clientY);
        }}
        onPointerUp={(event) => {
          if (pointer.current === event.pointerId) reset();
        }}
        onPointerCancel={(event) => {
          if (pointer.current === event.pointerId) reset();
        }}
        onLostPointerCapture={(event) => {
          if (pointer.current === event.pointerId) reset();
        }}
        onBlur={reset}
      >
        <span className="world-joystick-cross" aria-hidden="true" />
        <span className="world-joystick-knob" ref={knob} aria-hidden="true">
          <span />
        </span>
      </button>
      <span aria-hidden="true" className="world-joystick-label">
        DRAG TO MOVE
      </span>
      <span className="sr-only" id="joystick-help">
        Drag in any direction to walk. Drag farther to move faster. Release to
        stop. Keyboard arrow keys also work.
      </span>
    </div>
  );
}
