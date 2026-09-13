const KEY = "portfolio-world-position-v1";
export type WorldSession = {
  rotation: [number, number, number, number];
  heading: number;
  view: "walk" | "globe";
};

export function readWorldSession(): WorldSession | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
    if (
      !value ||
      !Array.isArray(value.rotation) ||
      value.rotation.length !== 4 ||
      !value.rotation.every((n: unknown) => typeof n === "number" && Number.isFinite(n)) ||
      Math.abs(Math.hypot(...value.rotation) - 1) > 0.01 ||
      typeof value.heading !== "number" ||
      !Number.isFinite(value.heading) ||
      (value.view !== "walk" && value.view !== "globe")
    ) return null;
    return value;
  } catch {
    return null;
  }
}

export function saveWorldSession(value: WorldSession) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // Browsing still works when session storage is unavailable or full.
  }
}
