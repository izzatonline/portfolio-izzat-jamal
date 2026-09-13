import * as T from "three";

// A quiet clearing beyond the five story buildings.
export const POND_NORMAL = new T.Vector3(-0.32, 0.67, -0.67).normalize();
export const POND_RADII = { x: 2.05, z: 1.55 };
const POND_ROTATION = new T.Quaternion().setFromUnitVectors(
  new T.Vector3(0, 1, 0),
  POND_NORMAL,
);
const POND_INVERSE = POND_ROTATION.clone().invert();
const pondPoint = (z: number) =>
  new T.Vector3(0, 12, z).applyQuaternion(POND_ROTATION).normalize();
export const POND_APPROACH = pondPoint(2.0);
// The far bank places the water in front of the explorer, toward the viewer.
export const POND_DOCK = pondPoint(-1.94);
export function pondDeckHeight(normal: T.Vector3) {
  if (normal.dot(POND_NORMAL) < 0.96) return 0;
  const local = normal.clone().multiplyScalar(12).applyQuaternion(POND_INVERSE);
  return (
    0.18 *
    (1 - T.MathUtils.smootherstep(Math.abs(local.x), 0.3, 0.5)) *
    T.MathUtils.smootherstep(-local.z, 1.05, 1.3) *
    (1 - T.MathUtils.smootherstep(-local.z, 2.25, 2.6))
  );
}
export type FishingStatus =
  "idle" | "walking" | "casting" | "bite" | "missed" | "caught";
export const FISHING_DURATION = 4.8;

export function createFishingPond(world: T.Group) {
  const pond = new T.Group();
  pond.position.copy(POND_NORMAL).multiplyScalar(12);
  pond.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), POND_NORMAL);
  world.add(pond);
  const materials = new Map<string, T.MeshStandardMaterial>();
  const add = (
    geometry: T.BufferGeometry,
    color: string,
    x = 0,
    y = 0,
    z = 0,
    parent: T.Object3D = pond,
  ) => {
    if (!materials.has(color))
      materials.set(
        color,
        new T.MeshStandardMaterial({ color, roughness: 0.65 }),
      );
    const m = new T.Mesh(geometry, materials.get(color));
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };
  const bank = add(new T.SphereGeometry(1, 32, 12), "#c6bb94", 0, -0.03);
  bank.scale.set(2.2, 0.16, 1.7);
  const water = add(new T.SphereGeometry(1, 32, 12), "#5caeb3", 0, 0.018);
  water.scale.set(POND_RADII.x, 0.115, POND_RADII.z);
  water.castShadow = false;
  for (let i = 0; i < 12; i++) {
    const z = -1.16 - i * 0.125;
    const point = pondPoint(z);
    const ground = Math.sqrt(144 - z * z) - 12;
    add(
      new T.BoxGeometry(0.82, 0.065, 0.12),
      i % 2 ? "#a47b51" : "#bb9567",
      0,
      ground + pondDeckHeight(point) - 0.0325,
      z,
    );
  }
  for (const x of [-0.35, 0.35])
    for (const z of [-1.28, -2.12])
      add(new T.CylinderGeometry(0.04, 0.045, 0.4, 8), "#815c40", x, -0.14, z);
  for (let i = 0; i < 22; i++) {
    const a = (i * Math.PI * 2) / 22;
    if (Math.cos(a) < -0.88) continue;
    const x = Math.sin(a) * 2.08,
      z = Math.cos(a) * 1.57;
    const rock = add(
      new T.IcosahedronGeometry(0.11 + (i % 3) * 0.025, 0),
      "#b2b69b",
      x,
      0.08,
      z,
    );
    rock.scale.y = 0.7;
    if (i % 2 === 0)
      for (let j = 0; j < 3; j++) {
        add(
          new T.CylinderGeometry(0.012, 0.018, 0.32 + j * 0.07, 5),
          "#64864d",
          x + j * 0.04,
          0.17,
          z,
        );
        add(
          new T.CylinderGeometry(0.026, 0.026, 0.11, 6),
          "#785338",
          x + j * 0.04,
          0.32 + j * 0.035,
          z,
        );
      }
  }
  for (const [x, z] of [
    [-0.55, -0.25],
    [0.6, 0.15],
    [0.45, -0.4],
  ]) {
    const pad = add(
      new T.CylinderGeometry(
        0.15,
        0.15,
        0.012,
        16,
        1,
        false,
        0.25,
        Math.PI * 1.8,
      ),
      "#729b60",
      x * 1.7,
      0.135,
      z * 1.7,
    );
    pad.rotation.y = x * 4;
  }
  const bobber = new T.Group();
  pond.add(bobber);
  bobber.visible = false;
  add(new T.SphereGeometry(0.045, 12, 8), "#e77f62", 0, 0, 0, bobber);
  add(
    new T.CylinderGeometry(0.011, 0.011, 0.11, 6),
    "#fff3cf",
    0,
    0.035,
    0,
    bobber,
  );
  const rippleMaterial = new T.MeshBasicMaterial({
    color: 0xd1eee2,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  const ripple = new T.Mesh(
    new T.RingGeometry(0.09, 0.105, 32),
    rippleMaterial,
  );
  ripple.rotation.x = -Math.PI / 2;
  ripple.position.set(0.05, 0.145, -0.7);
  pond.add(ripple);
  const fish = new T.Group();
  pond.add(fish);
  fish.visible = false;
  const fishBody = add(
    new T.SphereGeometry(0.13, 12, 8),
    "#f3be68",
    0,
    0,
    0,
    fish,
  );
  fishBody.scale.set(0.62, 0.82, 1.7);
  const tail = add(
    new T.ConeGeometry(0.12, 0.15, 3),
    "#df8850",
    0,
    0,
    -0.25,
    fish,
  );
  tail.rotation.x = -Math.PI / 2;
  for (const x of [-0.07, 0.07])
    add(new T.SphereGeometry(0.018, 8, 6), "#344b47", x, 0.035, 0.13, fish);
  const lineGeometry = new T.BufferGeometry();
  const linePositions = new Float32Array(17 * 3);
  lineGeometry.setAttribute(
    "position",
    new T.BufferAttribute(linePositions, 3),
  );
  const line = new T.Line(
    lineGeometry,
    new T.LineBasicMaterial({
      color: 0xfff1d0,
      transparent: true,
      opacity: 0.8,
    }),
  );
  line.frustumCulled = false;
  line.visible = false;
  pond.add(line);
  const tip = new T.Vector3();
  return {
    pond,
    update(
      ambient: number,
      castTime: number | null,
      catching: boolean,
      rodTip?: T.Object3D,
    ) {
      const active = castTime !== null;
      bobber.visible = active;
      line.visible = active && !!rodTip;
      fish.visible = active && catching && castTime > 3.35;
      const t = castTime ?? 0;
      const bite = t > 2.3 && t < 3.35;
      bobber.position.set(
        0.05,
        0.17 +
          (bite ? Math.sin(t * 23) * 0.045 : Math.sin(ambient * 2) * 0.012),
        -0.7,
      );
      const ripplePhase = (ambient * 0.65) % 1;
      ripple.scale.setScalar(0.8 + ripplePhase * (bite ? 4 : 2));
      rippleMaterial.opacity = (1 - ripplePhase) * 0.45;
      if (active && rodTip) {
        pond.updateWorldMatrix(true, false);
        tip.copy(rodTip.getWorldPosition(tip));
        pond.worldToLocal(tip);
        const cast = T.MathUtils.smootherstep(t, 0, 0.9);
        const end = bobber.position.clone().lerp(tip, 1 - cast);
        end.y += Math.sin(cast * Math.PI) * 0.5;
        bobber.position.copy(end);
        for (let i = 0; i <= 16; i++) {
          const f = i / 16;
          linePositions[i * 3] = T.MathUtils.lerp(tip.x, end.x, f);
          linePositions[i * 3 + 1] =
            T.MathUtils.lerp(tip.y, end.y, f) - Math.sin(f * Math.PI) * 0.12;
          linePositions[i * 3 + 2] = T.MathUtils.lerp(tip.z, end.z, f);
        }
        lineGeometry.attributes.position.needsUpdate = true;
      }
      if (fish.visible) {
        const leap = T.MathUtils.clamp((t - 3.35) / 1.45, 0, 1);
        fish.position.set(
          0.05,
          0.16 + Math.sin(leap * Math.PI) * 0.8,
          -0.7 - leap * 0.65,
        );
        fish.rotation.set(
          leap * 2,
          Math.sin(leap * 9) * 0.3,
          Math.sin(leap * 12) * 0.2,
        );
      }
    },
  };
}
