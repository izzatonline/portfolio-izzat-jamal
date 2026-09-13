const KNOB_RADIUS = 42;
const DEAD_ZONE = 7;

export function joystickInput(
  dx: number,
  dy: number,
  outerRadius: number,
  wasRunning: boolean,
) {
  const length = Math.hypot(dx, dy);
  const clamped = Math.min(length, KNOB_RADIUS);
  const strength = Math.max(
    0,
    (clamped - DEAD_ZONE) / (KNOB_RADIUS - DEAD_ZONE),
  );
  // A small gap between entry and exit avoids flickering at the rim.
  const running = length > (wasRunning ? outerRadius - 6 : outerRadius);
  return {
    x: length ? (dx / length) * strength : 0,
    y: length ? (dy / length) * strength : 0,
    offsetX: length ? (dx / length) * clamped : 0,
    offsetY: length ? (dy / length) * clamped : 0,
    running,
  };
}
