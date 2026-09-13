import * as T from "three";

const DURATION = 4.8;
const ease = (a: number, b: number, t: number) =>
  T.MathUtils.smootherstep(t, a, b);

/** Bake a hand-targeted sip into the existing rig so normal mixer fades still apply. */
export function createCoffeeEmote(
  model: T.Group,
  idleClip: T.AnimationClip,
  fishing = false,
) {
  const upper = model.getObjectByName("upperarmr")!;
  const lower = model.getObjectByName("lowerarmr")!;
  const hand = model.getObjectByName("handr")!;
  const head = model.getObjectByName("head")!;
  const chest = model.getObjectByName("chest")!;
  const tracks = idleClip.tracks.map((track) => {
    const binding = T.PropertyBinding.parseTrackName(track.name);
    return {
      track,
      node: model.getObjectByName(binding.nodeName)!,
      property: binding.propertyName as "quaternion" | "position" | "scale",
      values: [] as number[],
    };
  });
  const times: number[] = [];
  const sampler = new T.AnimationMixer(model);
  sampler.clipAction(idleClip).play();
  sampler.update(0);
  const rest = tracks.map(({ node, property }) => node[property].clone());
  const position = (o: T.Object3D) => o.getWorldPosition(new T.Vector3());
  const aim = (bone: T.Object3D, from: T.Vector3, to: T.Vector3) => {
    const rotation = new T.Quaternion().setFromUnitVectors(
      from.normalize(),
      to.normalize(),
    );
    const world = rotation.multiply(
      bone.getWorldQuaternion(new T.Quaternion()),
    );
    bone.quaternion.copy(
      bone
        .parent!.getWorldQuaternion(new T.Quaternion())
        .invert()
        .multiply(world),
    );
    model.updateMatrixWorld(true);
  };
  for (let i = 0; i <= 144; i++) {
    const t = (i / 144) * DURATION;
    // Restore before sampling: the mixer's cache does not rewrite constant tracks.
    tracks.forEach(({ node, property }, index) =>
      node[property].fromArray(rest[index].toArray()),
    );
    sampler.setTime(t);
    const hold = ease(0, 0.65, t) * (1 - ease(4.05, DURATION, t));
    const sip = ease(0.8, 1.65, t) * (1 - ease(2.85, 3.65, t));
    const tilt = (fishing ? 0 : sip) * (0.28 + 0.025 * Math.sin(t * 5));
    head.quaternion.multiply(
      new T.Quaternion().setFromEuler(
        new T.Euler(-0.055 * sip, -0.07 * hold, 0),
      ),
    );
    chest.quaternion.multiply(
      new T.Quaternion().setFromEuler(
        new T.Euler(0.025 * hold, -0.025 * hold, 0),
      ),
    );
    model.updateMatrixWorld(true);
    const start = position(upper),
      elbow = position(lower),
      palm = position(hand);
    const a = start.distanceTo(elbow),
      b = elbow.distanceTo(palm);
    const target = new T.Vector3(-0.37, 0.98, 0.38).lerp(
      new T.Vector3(-0.2, 1.2, 0.52),
      sip,
    );
    if (fishing) target.set(-0.32, 1.02, 0.43 + 0.05 * sip);
    target.lerpVectors(palm, target, hold);
    const axis = target.clone().sub(start);
    const distance = T.MathUtils.clamp(
      axis.length(),
      Math.abs(a - b) + 0.001,
      a + b - 0.001,
    );
    axis.normalize();
    const along = (a * a - b * b + distance * distance) / (2 * distance);
    const pole = new T.Vector3(-1, -0.6, 0);
    pole.addScaledVector(axis, -pole.dot(axis)).normalize();
    const bend = start
      .clone()
      .addScaledVector(axis, along)
      .addScaledVector(pole, Math.sqrt(Math.max(0, a * a - along * along)));
    aim(upper, elbow.clone().sub(start), bend.sub(start));
    aim(
      lower,
      position(hand).sub(position(lower)),
      target.sub(position(lower)),
    );
    const desired = new T.Quaternion().setFromEuler(new T.Euler(-tilt, 0, 0));
    const current = hand
      .getWorldQuaternion(new T.Quaternion())
      .slerp(desired, hold);
    hand.quaternion.copy(
      hand
        .parent!.getWorldQuaternion(new T.Quaternion())
        .invert()
        .multiply(current),
    );
    tracks.forEach(({ node, property, values }) =>
      values.push(...node[property].toArray()),
    );
    times.push(t);
  }
  sampler.stopAllAction();
  sampler.uncacheRoot(model);
  tracks.forEach(({ node, property }, index) =>
    node[property].fromArray(rest[index].toArray()),
  );
  return new T.AnimationClip(
    fishing ? "Fishing" : "Coffee",
    DURATION,
    tracks.map(({ track, property, values }) =>
      property === "quaternion"
        ? new T.QuaternionKeyframeTrack(track.name, times, values)
        : new T.VectorKeyframeTrack(track.name, times, values),
    ),
  );
}

export function createCoffeeCup(hand: T.Object3D) {
  const cup = new T.Group();
  cup.name = "Coffee mug";
  hand.add(cup);
  // The hand grips the handle; the bowl sits beside the palm, away from the fingers.
  cup.position.set(0.16, -0.035, 0);
  const ceramic = new T.MeshStandardMaterial({
    color: 0xfff1d6,
    roughness: 0.35,
  });
  const glaze = new T.MeshStandardMaterial({ color: 0x3d8277, roughness: 0.4 });
  const mesh = (
    geometry: T.BufferGeometry,
    material: T.Material,
    y: number,
  ) => {
    const item = new T.Mesh(geometry, material);
    item.position.y = y;
    item.castShadow = true;
    cup.add(item);
    return item;
  };
  mesh(new T.CylinderGeometry(0.14, 0.115, 0.26, 24, 1, true), ceramic, 0.13);
  mesh(new T.CylinderGeometry(0.118, 0.11, 0.025, 24), glaze, 0.012);
  const rim = mesh(new T.TorusGeometry(0.132, 0.012, 8, 32), ceramic, 0.26);
  rim.rotation.x = Math.PI / 2;
  const coffee = mesh(
    new T.CircleGeometry(0.129, 24),
    new T.MeshStandardMaterial({
      color: 0x46281b,
      roughness: 0.28,
      side: T.DoubleSide,
    }),
    0.243,
  );
  coffee.rotation.x = -Math.PI / 2;
  const stripe = mesh(
    new T.CylinderGeometry(0.133, 0.127, 0.07, 24, 1, true),
    glaze,
    0.15,
  );
  stripe.scale.set(1.015, 1, 1.015);
  const handle = mesh(new T.TorusGeometry(0.075, 0.025, 10, 24), ceramic, 0.14);
  handle.position.x = -0.16;
  const steam = Array.from({ length: 3 }, (_, i) => {
    const material = new T.MeshBasicMaterial({
      color: 0xfffaf0,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const puff = mesh(new T.SphereGeometry(1, 8, 6), material, 0.3);
    puff.castShadow = false;
    return { puff, material, phase: i / 3 };
  });
  cup.visible = false;
  return {
    cup,
    update(time: number, reduced: boolean) {
      const presence = ease(0, 0.25, time) * (1 - ease(4.4, DURATION, time));
      cup.scale.setScalar(presence);
      steam.forEach(({ puff, material, phase }) => {
        const cycle = (time * 0.65 + phase) % 1;
        puff.position.set(
          Math.sin(cycle * 5 + phase * 6) * 0.035,
          0.29 + cycle * 0.26,
          Math.cos(phase * 6) * 0.025,
        );
        puff.scale.set(
          0.022 + cycle * 0.016,
          0.045 + cycle * 0.04,
          0.022 + cycle * 0.016,
        );
        material.opacity = reduced
          ? 0
          : Math.sin(cycle * Math.PI) * 0.22 * presence;
      });
    },
  };
}
