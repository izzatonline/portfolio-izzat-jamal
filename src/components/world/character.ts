import * as T from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { createCoffeeCup, createCoffeeEmote } from "./coffee-emote";

import type { Emote } from "./emotes";
import { withEmoteGaze } from "./emote-gaze";

export async function loadCharacter(
  parent: T.Group,
  onEmote: (emote: Emote | null) => void,
) {
  const loader = new GLTFLoader();
  const [asset, waving] = await Promise.all([
    loader.loadAsync("/models/character/explorer.glb"),
    loader.loadAsync("/models/character/simulation.glb"),
  ]);
  const model = asset.scene;
  // Remove the source character's game equipment; this is a peaceful explorer.
  model.traverse((o) => {
    if (/Knife|Crossbow|Throwable|Cape/.test(o.name)) o.visible = false;
    if (o instanceof T.Mesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  const mixer = new T.AnimationMixer(model);
  const clips = new Map(asset.animations.map((a) => [a.name, a]));
  const wave = waving.animations[0].clone();
  // Both packs use the KayKit medium rig. Ignore auxiliary IK/slot tracks absent on this model.
  wave.tracks = wave.tracks.filter((t) => {
    const binding = T.PropertyBinding.parseTrackName(t.name);
    return (
      binding.nodeName !== "root" &&
      !!model.getObjectByName(binding.nodeName) &&
      (!t.name.endsWith(".position") || /^(root|hips)\./.test(t.name))
    );
  });
  clips.set("Wave", wave);
  const idle = mixer.clipAction(clips.get("Idle")!);
  idle.play();
  mixer.update(0);
  const danceTracks: T.KeyframeTrack[] = [];
  for (const [name, x, y, z] of [
    ["chest", 0.12, 0.22, 0.15],
    ["head", 0.08, -0.15, 0.09],
    ["upperarml", 0.55, 0.1, -0.65],
    ["upperarmr", -0.55, -0.1, 0.65],
    ["lowerarml", 0.4, 0, 0.3],
    ["lowerarmr", -0.4, 0, -0.3],
    ["upperlegl", 0.22, 0, 0.06],
    ["upperlegr", -0.22, 0, -0.06],
  ] as const) {
    const bone = model.getObjectByName(name);
    if (!bone) continue;
    const values: number[] = [];
    const times: number[] = [];
    for (let i = 0; i <= 16; i++) {
      const pulse = Math.sin((i * Math.PI) / 2);
      const envelope = Math.sin((i / 16) * Math.PI);
      const q = bone.quaternion
        .clone()
        .multiply(
          new T.Quaternion().setFromEuler(
            new T.Euler(x * pulse, y * pulse, z * envelope),
          ),
        );
      values.push(q.x, q.y, q.z, q.w);
      times.push(i * 0.25);
    }
    danceTracks.push(
      new T.QuaternionKeyframeTrack(`${name}.quaternion`, times, values),
    );
  }
  clips.set("Dance", new T.AnimationClip("Dance", 4, danceTracks));
  const jumpTracks: T.KeyframeTrack[] = [];
  for (const [name, bend] of [
    ["upperlegl", -0.5],
    ["upperlegr", -0.5],
    ["lowerlegl", 0.85],
    ["lowerlegr", 0.85],
    ["upperarml", -0.65],
    ["upperarmr", -0.65],
    ["chest", 0.16],
  ] as const) {
    const bone = model.getObjectByName(name);
    if (!bone) continue;
    const values: number[] = [];
    for (const amount of [0, 0.65, 1, 0.3, 0.7, 0]) {
      const q = bone.quaternion
        .clone()
        .multiply(
          new T.Quaternion().setFromEuler(new T.Euler(bend * amount, 0, 0)),
        );
      values.push(q.x, q.y, q.z, q.w);
    }
    jumpTracks.push(
      new T.QuaternionKeyframeTrack(
        `${name}.quaternion`,
        [0, 0.1, 0.25, 0.55, 0.78, 0.9],
        values,
      ),
    );
  }
  clips.set("Jump", new T.AnimationClip("Jump", 0.9, jumpTracks));
  clips.set("Coffee", createCoffeeEmote(model, clips.get("Idle")!));
  clips.set("Fishing", createCoffeeEmote(model, clips.get("Idle")!, true));
  for (const name of ["Wave", "Dance", "Cheer", "Coffee"]) {
    clips.set(name, withEmoteGaze(clips.get(name)!, name === "Coffee"));
  }
  const fishingRod = new T.Group();
  const shaft = new T.Mesh(
    new T.CylinderGeometry(0.012, 0.023, 1.45, 8),
    new T.MeshStandardMaterial({ color: 0x93663e }),
  );
  shaft.position.y = 0.68;
  fishingRod.add(shaft);
  fishingRod.rotation.x = 1.03;
  const rodTip = new T.Object3D();
  rodTip.position.y = 1.405;
  fishingRod.add(rodTip);
  model.getObjectByName("handr")!.add(fishingRod);
  fishingRod.visible = false;
  const coffeeEmote = createCoffeeCup(model.getObjectByName("handr")!);
  const { cup } = coffeeEmote;
  model.scale.setScalar(0.72);
  parent.add(model);
  let active = idle;
  let currentEmote: Emote | null = null;
  let remaining = 0;
  let locomotion = "Idle";
  const change = (name: string, once = false) => {
    const next = mixer.clipAction(clips.get(name)!);
    if (next === active && !once) return;
    next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1);
    next.setLoop(once ? T.LoopOnce : T.LoopRepeat, once ? 1 : Infinity);
    next.clampWhenFinished = once;
    if (next !== active) {
      active.fadeOut(0.22);
      next.fadeIn(0.22);
    }
    next.play();
    active = next;
  };
  const end = () => {
    if (currentEmote) {
      currentEmote = null;
      cup.visible = false;
      onEmote(null);
      change("Idle");
      locomotion = "Idle";
    }
  };
  return {
    cancel: end,
    rodTip,
    update(
      dt: number,
      speed: number,
      request: Emote | null,
      paused: boolean,
      reduced: boolean,
      jumping: boolean,
      fishing = false,
    ) {
      fishingRod.visible = fishing && !paused;
      if (fishing && !paused) {
        end();
        if (locomotion !== "Fishing") {
          change("Fishing", true);
          locomotion = "Fishing";
        }
        mixer.update(dt);
        return;
      }
      if (paused) {
        end();
        return;
      }
      if (jumping) {
        end();
        if (locomotion !== "Jump") {
          change("Jump", true);
          locomotion = "Jump";
        }
        mixer.update(dt);
        return;
      }
      if (speed > 0.05) end();
      if (request && speed <= 0.05) {
        currentEmote = request;
        onEmote(request);
        const clipName = {
          wave: "Wave",
          dance: "Dance",
          celebrate: "Cheer",
          kopi: "Coffee",
        }[request];
        change(clipName, true);
        active.timeScale = 1;
        remaining = active.getClip().duration / active.timeScale;
        cup.visible = request === "kopi";
      }
      if (currentEmote) {
        remaining -= dt;
        if (remaining <= 0) end();
      } else {
        const state =
          speed > 2.7 ? "Running_A" : speed > 0.05 ? "Walking_A" : "Idle";
        if (state !== locomotion) {
          change(state);
          locomotion = state;
        }
        if (state !== "Idle")
          active.timeScale = speed / (state === "Running_A" ? 4 : 2.1);
      }
      // Explicitly requested emotes still play; reduced motion suppresses ambient idle motion.
      mixer.update(reduced && !currentEmote && speed <= 0.05 ? 0 : dt);
      if (currentEmote === "kopi") coffeeEmote.update(active.time, reduced);
    },
    dispose() {
      mixer.stopAllAction();
      mixer.uncacheRoot(model);
      const textures = new Set<T.Texture>(),
        materials = new Set<T.Material>();
      for (const scene of [model, waving.scene])
        scene.traverse((o) => {
          if (o instanceof T.Mesh) {
            o.geometry.dispose();
            for (const m of Array.isArray(o.material)
              ? o.material
              : [o.material]) {
              materials.add(m);
              Object.values(m).forEach((v) => {
                if (v instanceof T.Texture) textures.add(v);
              });
            }
          }
        });
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      model.removeFromParent();
    },
  };
}
