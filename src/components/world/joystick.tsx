"use client";

import { useCallback, useEffect, useRef } from "react";

import { joystickInput } from "./joystick-input";

export default function Joystick({
  onInput,
  disabled,
  onMove,
}: {
  onInput: (x: number, y: number, running: boolean) => void;
  disabled: boolean;
  onMove: () => void;
}) {
  const base = useRef<HTMLButtonElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const running = useRef(false);
  const outerRadius = useRef(62);
  const knob = useRef<HTMLSpanElement>(null);
  const pointer = useRef<number | null>(null);
  const center = useRef({ x: 0, y: 0 });
  const reset = useCallback(() => {
    pointer.current = null;
    running.current = false;
    onInput(0, 0, false);
    if (base.current) base.current.dataset.running = "false";
    if (label.current) label.current.textContent = "OUTSIDE RING TO RUN";
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
    const input = joystickInput(dx, dy, outerRadius.current, running.current);
    running.current = input.running;
    onInput(input.x, input.y, input.running);
    if (base.current) base.current.dataset.running = String(input.running);
    if (label.current)
      label.current.textContent = input.running
        ? "RUNNING"
        : "OUTSIDE RING TO RUN";
    if (knob.current)
      knob.current.style.transform = `translate(${input.offsetX}px, ${input.offsetY}px)`;
    if (input.x || input.y) onMove();
  };
  return (
    <div className="world-joystick">
      <button
        className="world-joystick-base"
        ref={base}
        disabled={disabled}
        aria-label="Movement joystick"
        aria-describedby="joystick-help"
        onPointerDown={(event) => {
          if (pointer.current !== null || disabled) return;
          event.preventDefault();
          const bounds = event.currentTarget.getBoundingClientRect();
          outerRadius.current = bounds.width / 2;
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
      <span aria-hidden="true" className="world-joystick-label" ref={label}>
        OUTSIDE RING TO RUN
      </span>
      <span className="sr-only" id="joystick-help">
        Drag in any direction to walk. Push outside the outer circle to run, and
        move back inside to walk. Release to stop. Keyboard arrow keys also
        work.
      </span>
    </div>
  );
}
