import * as T from "three";

const R = 12;
const UP = new T.Vector3(0, 1, 0);
const PLAYER_RADIUS = 0.2;

type Footprint = {
  center: T.Vector3;
  rotation: T.Quaternion;
  inverse: T.Quaternion;
  x: number;
  z: number;
};

/** Ground footprints include the explorer's radius and remain solid during jumps. */
export function createWorldCollision(
  stories: T.Vector3[],
  pond: T.Vector3,
  dock: T.Vector3,
  pondSize: { x: number; z: number },
) {
  const footprint = (center: T.Vector3, x: number, z = x): Footprint => {
    const rotation = new T.Quaternion().setFromUnitVectors(UP, center);
    return {
      center,
      rotation,
      inverse: rotation.clone().invert(),
      x: x + PLAYER_RADIUS,
      z: z + PLAYER_RADIUS,
    };
  };
  const obstacles = stories.map((center, i) =>
    footprint(center, i === 2 ? 0.47 : i === 1 ? 0.7 : 0.64),
  );
  obstacles.push(footprint(pond, pondSize.x, pondSize.z));
  // The cafe table extends beyond its building's footprint.
  const table = new T.Vector3(0.55, R, 0.55)
    .applyQuaternion(obstacles[4].rotation)
    .normalize();
  obstacles.push(footprint(table, 0.25));
  const local = new T.Vector3();
  const blockedBy = (point: T.Vector3, margin = 0) =>
    obstacles.find((o) => {
      if (point.dot(o.center) < 0.98) return false;
      local.copy(point).multiplyScalar(R).applyQuaternion(o.inverse);
      return (
        (local.x / (o.x + margin)) ** 2 + (local.z / (o.z + margin)) ** 2 < 1
      );
    });
  const clear = (a: T.Vector3, b: T.Vector3, margin = 0) => {
    const count = Math.max(1, Math.ceil((a.angleTo(b) * R) / 0.035));
    const sample = new T.Vector3();
    const arc = new T.Quaternion().setFromUnitVectors(a, b);
    const rotation = new T.Quaternion();
    for (let i = 0; i <= count; i++) {
      sample.copy(a).applyQuaternion(rotation.identity().slerp(arc, i / count));
      if (blockedBy(sample, margin)) return false;
    }
    return true;
  };
  const move = (start: T.Vector3, desired: T.Vector3) => {
    let point = start.clone();
    const count = Math.max(1, Math.ceil((start.angleTo(desired) * R) / 0.025));
    const delta = desired.clone().sub(start).divideScalar(count);
    for (let i = 0; i < count; i++) {
      const next = point.clone().add(delta).normalize();
      const obstacle = blockedBy(next);
      if (!obstacle) {
        point = next;
        continue;
      }
      // Remove the inward component so diagonal input slides along a wall.
      local.copy(point).multiplyScalar(R).applyQuaternion(obstacle.inverse);
      const outward = new T.Vector3(
        local.x / obstacle.x ** 2,
        0,
        local.z / obstacle.z ** 2,
      ).applyQuaternion(obstacle.rotation);
      outward.addScaledVector(point, -outward.dot(point)).normalize();
      const slide = delta
        .clone()
        .addScaledVector(outward, -Math.min(0, delta.dot(outward)));
      const candidate = point.clone().add(slide).normalize();
      if (clear(point, candidate)) point = candidate;
    }
    return point;
  };
  const rings = obstacles.map((o) =>
    Array.from({ length: 20 }, (_, i) => {
      const angle = (i * Math.PI * 2) / 20;
      return new T.Vector3(
        Math.sin(angle) * (o.x + 0.09),
        R,
        Math.cos(angle) * (o.z + 0.09),
      )
        .applyQuaternion(o.rotation)
        .normalize();
    }),
  );
  const goals = stories.map(
    (_, i) =>
      rings[i]
        .filter((p) => !blockedBy(p, 0.015))
        .sort((a, b) => a.angleTo(UP) - b.angleTo(UP))[0],
  );
  goals.push(dock);
  const nodes = rings.flat().filter((p) => !blockedBy(p, 0.015));
  let edges: { index: number; cost: number }[][] | undefined;
  const route = (start: T.Vector3, index: number, goal = goals[index]) => {
    if (clear(start, goal)) return [goal.clone()];
    // Cache scenery visibility edges. Only the start and goal change between trips.
    if (!edges) {
      edges = nodes.map(() => []);
      for (let a = 0; a < nodes.length; a++)
        for (let b = a + 1; b < nodes.length; b++) {
          if (!clear(nodes[a], nodes[b], 0.01)) continue;
          const cost = nodes[a].angleTo(nodes[b]);
          edges[a].push({ index: b, cost });
          edges[b].push({ index: a, cost });
        }
    }
    const points = [...nodes, start, goal];
    const startIndex = nodes.length,
      endIndex = startIndex + 1;
    const graph = edges.map((e) => [...e]);
    graph.push([], []);
    for (const special of [startIndex, endIndex])
      for (let i = 0; i < nodes.length; i++) {
        if (!clear(points[special], points[i])) continue;
        const cost = points[special].angleTo(points[i]);
        graph[special].push({ index: i, cost });
        graph[i].push({ index: special, cost });
      }
    const distance = points.map(() => Infinity),
      previous = points.map(() => -1),
      visited = new Set<number>();
    distance[startIndex] = 0;
    while (visited.size < points.length) {
      let current = -1;
      for (let i = 0; i < points.length; i++)
        if (!visited.has(i) && (current < 0 || distance[i] < distance[current]))
          current = i;
      if (current < 0 || !Number.isFinite(distance[current])) return [];
      if (current === endIndex) break;
      visited.add(current);
      for (const edge of graph[current])
        if (distance[current] + edge.cost < distance[edge.index]) {
          distance[edge.index] = distance[current] + edge.cost;
          previous[edge.index] = current;
        }
    }
    const path: T.Vector3[] = [];
    for (let at = endIndex; at !== startIndex; at = previous[at]) {
      if (at < 0) return [];
      path.unshift(points[at].clone());
    }
    return path;
  };
  return {
    move,
    route,
    isBlocked: (point: T.Vector3) => !!blockedBy(point),
    goals,
  };
}
