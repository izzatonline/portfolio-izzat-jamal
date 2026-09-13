import * as T from "three";

export const POND_NORMAL = new T.Vector3(-0.22, 0.96, -0.12).normalize();
// A separate approach point keeps the explorer on the near bank, facing the water.
export const POND_APPROACH = new T.Vector3(0, 12.08, 1.3)
  .applyQuaternion(
    new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), POND_NORMAL),
  )
  .normalize();
export type FishingStatus = "idle" | "casting" | "bite" | "missed" | "caught";
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
  bank.scale.set(1.24, 0.13, 0.96);
  const water = add(new T.SphereGeometry(1, 32, 12), "#5caeb3", 0, 0.018);
  water.scale.set(1.12, 0.105, 0.83);
  water.castShadow = false;
  for (let i = 0; i < 7; i++)
    add(
      new T.BoxGeometry(0.62, 0.065, 0.13),
      i % 2 ? "#a47b51" : "#bb9567",
      0,
      0.09,
      0.62 + i * 0.13,
    );
  for (const x of [-0.26, 0.26])
    add(new T.CylinderGeometry(0.035, 0.04, 0.34, 8), "#815c40", x, 0.04, 0.64);
  for (let i = 0; i < 14; i++) {
    const a = i * 0.47;
    if (Math.cos(a) > 0.75) continue;
    const x = Math.sin(a) * 1.13,
      z = Math.cos(a) * 0.85;
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
      x,
      0.125,
      z,
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
  ripple.position.set(0.05, 0.135, 0.1);
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
        0.1,
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
          0.1 + leap * 0.65,
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
