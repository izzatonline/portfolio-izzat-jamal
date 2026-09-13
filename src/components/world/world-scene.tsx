"use client";

import { useEffect, useRef } from "react";
import * as T from "three";
import { loadCharacter } from "./character";
import { createWorldCollision } from "./world-collision";
import type { Emote } from "./emotes";
import { destinations, POND_INDEX } from "./destinations";
import {
  createFishingPond,
  POND_NORMAL,
  POND_APPROACH,
  POND_DOCK,
  POND_RADII,
  pondDeckHeight,
  FISHING_DURATION,
  type FishingStatus,
} from "./fishing-pond";

export type WorldControls = {
  keys: Set<string>;
  paused: boolean;
  target: number | null;
  reset: boolean;
  view: "walk" | "globe";
  emote: Emote | null;
  running: boolean;
  jump: boolean;
  fish: boolean;
  joystick: { x: number; y: number; running: boolean };
};
type Props = {
  controls: React.RefObject<WorldControls>;
  onNear: (index: number | null) => void;
  onReady: () => void;
  onError: () => void;
  onEmote: (emote: Emote | null) => void;
  onJump: (jumping: boolean) => void;
  onFishing: (status: FishingStatus) => void;
};
const R = 12;
const UP = new T.Vector3(0, 1, 0);
export function spotNormal(angle: number) {
  return new T.Vector3(
    Math.sin(angle) * Math.sin(0.36),
    Math.cos(0.36),
    Math.cos(angle) * Math.sin(0.36),
  );
}

export default function WorldScene({
  controls,
  onNear,
  onReady,
  onError,
  onEmote,
  onJump,
  onFishing,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: T.WebGLRenderer;
    try {
      renderer = new T.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      onError();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.outputColorSpace = T.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    renderer.domElement.setAttribute(
      "aria-label",
      "A small green planet with a walking character and five portfolio destinations",
    );
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(39, 1, 0.1, 100);
    const world = new T.Group();
    scene.add(world);
    scene.add(new T.HemisphereLight(0xfff8e5, 0x66897a, 2.7));
    const sun = new T.DirectionalLight(0xffe9cf, 3.2);
    sun.position.set(-12, 28, 15);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, {
      left: -8,
      right: 8,
      top: 8,
      bottom: -8,
      far: 70,
    });
    sun.shadow.normalBias = 0.04;
    scene.add(sun);
    const materials = new Map<string, T.MeshStandardMaterial>();
    const mat = (color: string) => {
      if (!materials.has(color))
        materials.set(
          color,
          new T.MeshStandardMaterial({
            color,
            roughness: 0.9,
            flatShading: true,
          }),
        );
      return materials.get(color)!;
    };
    const mesh = (
      parent: T.Object3D,
      geometry: T.BufferGeometry,
      color: string,
      x = 0,
      y = 0,
      z = 0,
    ) => {
      const m = new T.Mesh(geometry, mat(color));
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      parent.add(m);
      return m;
    };
    const box = (
      p: T.Object3D,
      w: number,
      h: number,
      d: number,
      c: string,
      x = 0,
      y = 0,
      z = 0,
    ) => mesh(p, new T.BoxGeometry(w, h, d), c, x, y, z);
    const ball = (p: T.Object3D, r: number, c: string, x = 0, y = 0, z = 0) =>
      mesh(p, new T.IcosahedronGeometry(r, 1), c, x, y, z);
    const surface = (normal: T.Vector3, radius = R) => {
      const g = new T.Group();
      g.position.copy(normal).multiplyScalar(radius);
      g.quaternion.setFromUnitVectors(UP, normal);
      world.add(g);
      return g;
    };
    mesh(world, new T.IcosahedronGeometry(R, 4), "#86ab83");
    const fishingPond = createFishingPond(world);
    const collision = createWorldCollision(
      destinations.map((d) => spotNormal(d.angle)),
      POND_NORMAL,
      POND_APPROACH,
      POND_RADII,
    );
    let routeTarget: number | null = null;
    let route: T.Vector3[] = [];
    const playerNormal = () =>
      UP.clone().applyQuaternion(world.quaternion.clone().invert());
    const applyMovement = (rotation: T.Quaternion) => {
      const start = playerNormal();
      const proposed = world.quaternion.clone().premultiply(rotation);
      const desired = UP.clone().applyQuaternion(proposed.invert());
      const resolved = collision.move(start, desired);
      const localRotation = new T.Quaternion().setFromUnitVectors(
        resolved,
        start,
      );
      world.quaternion.multiply(localRotation).normalize();
      return start.angleTo(resolved) * R;
    };
    for (let i = 0; i < 340; i++) {
      const a = i * 2.399963;
      const y = 1 - ((i + 0.5) / 340) * 2;
      const n = new T.Vector3(
        Math.cos(a) * Math.sqrt(1 - y * y),
        y,
        Math.sin(a) * Math.sqrt(1 - y * y),
      );
      if (
        n.y > 0.995 ||
        destinations.some((d) => n.angleTo(spotNormal(d.angle)) < 0.095) ||
        n.angleTo(POND_NORMAL) < 0.29
      )
        continue;
      const g = surface(n);
      const size = 0.55 + ((i * 17) % 10) / 25;
      if (i % 4 === 0) {
        const rock = ball(g, 0.23, "#bac3ac", 0, 0.1);
        rock.scale.set(1, 0.6, 0.8);
      } else {
        mesh(
          g,
          new T.CylinderGeometry(0.035, 0.065, size * 0.7, 5),
          "#86694f",
          0,
          size * 0.35,
        );
        if (i % 2)
          mesh(g, new T.ConeGeometry(size * 0.36, size, 6), "#456f57", 0, size);
        else {
          ball(g, size * 0.36, "#638a57", 0, size * 0.8);
          ball(g, size * 0.27, "#76995f", 0.12, size * 1.05);
        }
      }
    }
    // A dotted footpath joins each stop to the arrival clearing.
    destinations.forEach((d, index) => {
      const n = spotNormal(d.angle);
      for (let j = 2; j < 15; j++) {
        const p = UP.clone()
          .lerp(n, j / 16)
          .normalize();
        const g = surface(p, R + 0.008);
        mesh(g, new T.CylinderGeometry(0.075, 0.075, 0.025, 6), "#d5c8a1");
      }
      const g = surface(n);
      mesh(g, new T.CylinderGeometry(0.69, 0.74, 0.14, 24), "#e1d4b3", 0, 0.03);
      if (index === 2) {
        mesh(g, new T.CylinderGeometry(0.38, 0.45, 0.8, 12), "#e8e1cc", 0, 0.5);
        mesh(
          g,
          new T.SphereGeometry(0.42, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
          d.color,
          0,
          0.91,
        );
        const scope = mesh(
          g,
          new T.CylinderGeometry(0.1, 0.14, 0.65, 10),
          "#455e68",
          0,
          1.25,
          0.15,
        );
        scope.rotation.x = 0.9;
      } else if (index === 3) {
        box(g, 0.9, 0.1, 0.6, "#8a6450", 0, 0.18);
        box(g, 0.9, 0.72, 0.18, "#826449", 0, 0.6, -0.2);
        for (let b = 0; b < 7; b++)
          box(
            g,
            0.08,
            0.28 + (b % 3) * 0.06,
            0.17,
            ["#a2b3bd", "#d3b165", "#d0947a"][b % 3],
            -0.34 + b * 0.11,
            0.55,
            -0.08,
          );
        const roof = mesh(
          g,
          new T.ConeGeometry(0.79, 0.4, 4),
          d.color,
          0,
          1.12,
        );
        roof.rotation.y = Math.PI / 4;
      } else {
        box(
          g,
          index === 1 ? 1.05 : 0.86,
          0.65,
          0.7,
          index === 1 ? "#e5dfce" : "#f2e4cb",
          0,
          0.43,
        );
        const roof = mesh(
          g,
          new T.ConeGeometry(index === 1 ? 0.88 : 0.78, 0.48, 4),
          d.color,
          0,
          1,
        );
        roof.rotation.y = Math.PI / 4;
        box(g, 0.19, 0.39, 0.025, "#655c4c", 0, 0.32, 0.36);
        [-0.28, 0.28].forEach((x) => {
          box(g, 0.17, 0.2, 0.035, "#779fa6", x, 0.54, 0.36);
        });
        if (index === 1) {
          box(g, 0.19, 0.65, 0.2, "#8a9399", 0.32, 1.02, -0.18);
        }
        if (index === 4) {
          mesh(
            g,
            new T.CylinderGeometry(0.24, 0.24, 0.08, 12),
            "#b7835f",
            0.55,
            0.35,
            0.55,
          );
          mesh(
            g,
            new T.CylinderGeometry(0.035, 0.035, 0.3, 6),
            "#715943",
            0.55,
            0.15,
            0.55,
          );
          mesh(
            g,
            new T.CylinderGeometry(0.055, 0.04, 0.09, 8),
            "#fff4db",
            0.55,
            0.43,
            0.55,
          );
        }
      }
      const sign = new T.Group();
      sign.position.set(-0.62, 0, 0.35);
      g.add(sign);
      box(sign, 0.035, 0.6, 0.035, "#856c50", 0, 0.3);
      ball(sign, 0.13, d.color, 0, 0.66);
    });
    const foliage: T.Mesh[] = [];
    world.traverse((o) => {
      if (
        o instanceof T.Mesh &&
        [mat("#456f57"), mat("#638a57"), mat("#76995f")].includes(
          o.material as T.MeshStandardMaterial,
        )
      )
        foliage.push(o);
    });
    const clouds = new T.Group();
    scene.add(clouds);
    for (let i = 0; i < 5; i++) {
      const cloud = new T.Group();
      cloud.position.set(
        (i - 2) * 5.5,
        R + 0.5 + (i % 2) * 0.9,
        -6 - (i % 3) * 2,
      );
      for (let j = 0; j < 4; j++) {
        const puff = ball(
          cloud,
          0.65 + (j % 2) * 0.3,
          "#f7fcf6",
          (j - 1.5) * 0.65,
          (j % 2) * 0.2,
          0,
        );
        puff.scale.set(1.2, 0.58, 0.8);
        puff.castShadow = false;
        puff.receiveShadow = false;
      }
      cloud.scale.setScalar(0.62 + (i % 3) * 0.19);
      cloud.userData.homeX = cloud.position.x;
      cloud.userData.homeY = cloud.position.y;
      clouds.add(cloud);
    }
    // A small flock follows a shared circuit with individual wingbeats and glides.
    const birds = Array.from({ length: 7 }, (_, i) => {
      const bird = new T.Group();
      const body = mesh(bird, new T.SphereGeometry(0.07, 8, 6), "#536e75");
      body.scale.set(0.7, 0.85, 1.9);
      const head = ball(bird, 0.047, "#536e75", 0, 0.025, 0.12);
      head.castShadow = false;
      const beak = mesh(
        bird,
        new T.ConeGeometry(0.025, 0.08, 5),
        "#d5ad69",
        0,
        0.017,
        0.18,
      );
      beak.rotation.x = Math.PI / 2;
      const wings = [-1, 1].map((side) => {
        const pivot = new T.Group();
        pivot.position.set(side * 0.045, 0.025, 0);
        bird.add(pivot);
        const shape = new T.Shape();
        shape.moveTo(0, 0.06);
        shape.lineTo(side * 0.34, -0.07);
        shape.lineTo(side * 0.17, -0.12);
        shape.lineTo(0, -0.065);
        shape.closePath();
        const geometry = new T.ShapeGeometry(shape);
        geometry.rotateX(Math.PI / 2);
        const wing = mesh(pivot, geometry, "#425e69");
        (wing.material as T.MeshStandardMaterial).side = T.DoubleSide;
        wing.castShadow = false;
        return pivot;
      });
      bird.scale.setScalar(0.8 + (i % 3) * 0.13);
      bird.traverse((o) => {
        if (o instanceof T.Mesh) {
          o.castShadow = false;
          o.receiveShadow = false;
        }
      });
      scene.add(bird);
      return { bird, wings };
    });
    // Character stays at the top; rotating the planet is equivalent to walking its spherical surface.
    const avatar = new T.Group();
    avatar.position.y = R + 0.04;
    scene.add(avatar);
    const body = new T.Group();
    body.rotation.y = Math.PI;
    avatar.add(body);
    let character: Awaited<ReturnType<typeof loadCharacter>> | undefined;
    let disposed = false;
    let posing = false;
    let jumpTime: number | null = null;
    let fishingTime: number | null = null;
    let walkingToDock = false;
    let settlingTime: number | null = null;
    let fishingAttempts = 0;
    let biteReported = false;
    loadCharacter(body, (emote) => {
      posing = emote !== null;
      onEmote(emote);
    })
      .then((loaded) => {
        if (disposed) {
          loaded.dispose();
          return;
        }
        character = loaded;
        onReady();
      })
      .catch(() => {
        if (!disposed) onError();
      });
    const ring = mesh(
      scene,
      new T.TorusGeometry(0.32, 0.017, 6, 32),
      "#f8edb7",
      0,
      R + 0.03,
    );
    ring.rotation.x = Math.PI / 2;
    const cameraTarget = new T.Vector3();
    const lookTarget = new T.Vector3();
    const cameraLook = new T.Vector3(0, R + 0.25, -1.7);
    const startPosition = new T.Vector3();
    const startLook = new T.Vector3();
    let cameraView = controls.current.view;
    let transitionTime = 1.4;
    let startFov = camera.fov;
    let pondFraming = 0;
    const updateCamera = (immediate: boolean, dt = 0) => {
      const walking = controls.current.view === "walk";
      const narrow = camera.aspect < 0.8;
      const besideDock = playerNormal().angleTo(POND_DOCK) < 0.055 ? 1 : 0;
      pondFraming = immediate
        ? besideDock
        : T.MathUtils.damp(pondFraming, besideDock, 4, dt);
      cameraTarget.set(
        0,
        walking ? R + 8 + pondFraming * 0.4 : 25.7,
        walking
          ? (narrow ? 10.2 : 7) + pondFraming * 0.8
          : narrow
            ? 57.6
            : 43.9,
      );
      lookTarget.set(
        0,
        walking ? R + 0.25 : 2.64,
        walking ? T.MathUtils.lerp(-1.7, 0.9, pondFraming) : 0,
      );
      if (!walking) {
        // Leave space for the interface now that both views share a full-size canvas.
        cameraTarget
          .sub(lookTarget)
          .multiplyScalar(narrow ? 1.65 : 1.3)
          .add(lookTarget);
      }
      const targetFov = walking ? 50 : 39;
      if (cameraView !== controls.current.view) {
        // Capture the current pose, including during a reversal of an unfinished transition.
        cameraView = controls.current.view;
        startPosition.copy(camera.position);
        startLook.copy(cameraLook);
        startFov = camera.fov;
        transitionTime = 0;
      }
      transitionTime = immediate ? 1.4 : Math.min(1.4, transitionTime + dt);
      const t = transitionTime / 1.4;
      // Smootherstep gives the pull-back and approach a gentle start and finish.
      const eased = t * t * t * (t * (t * 6 - 15) + 10);
      camera.position.lerpVectors(startPosition, cameraTarget, eased);
      cameraLook.lerpVectors(startLook, lookTarget, eased);
      camera.fov = T.MathUtils.lerp(startFov, targetFov, eased);
      camera.lookAt(cameraLook);
      camera.updateProjectionMatrix();
    };
    const resize = () => {
      const w = container.clientWidth,
        h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      updateCamera(true);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    const lost = (e: Event) => {
      e.preventDefault();
      renderer.setAnimationLoop(null);
      onError();
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let last = 0,
      speed = 0,
      near: number | null | undefined = undefined;
    const q = new T.Quaternion(),
      axis = new T.Vector3(),
      normal = new T.Vector3();
    renderer.setAnimationLoop((time: number) => {
      const dt = Math.min((time - last) / 1000 || 0, 0.04);
      last = time;
      if (document.hidden) return;
      const c = controls.current;
      updateCamera(reduced.matches, dt);
      if (
        (fishingTime !== null || walkingToDock || settlingTime !== null) &&
        (c.reset ||
          c.paused ||
          c.jump ||
          c.emote ||
          (c.target !== null && (!walkingToDock || c.target !== POND_INDEX)) ||
          c.keys.size > 0 ||
          c.joystick.x ||
          c.joystick.y)
      ) {
        if (walkingToDock && c.target === POND_INDEX) c.target = null;
        fishingTime = null;
        walkingToDock = false;
        settlingTime = null;
        routeTarget = null;
        route = [];
        onFishing("idle");
      }
      if (c.fish) {
        if (
          near === POND_INDEX &&
          fishingTime === null &&
          !walkingToDock &&
          settlingTime === null &&
          !c.paused &&
          jumpTime === null
        ) {
          walkingToDock = true;
          c.target = POND_INDEX;
          routeTarget = null;
          c.keys.clear();
          c.emote = null;
          character?.cancel();
          onFishing("walking");
        }
        c.fish = false;
      }
      if (c.reset) {
        world.quaternion.identity();
        body.rotation.y = Math.PI;
        character?.cancel();
        jumpTime = null;
        avatar.position.y = R + 0.04;
        c.jump = false;
        onJump(false);
        c.reset = false;
        c.target = null;
        routeTarget = null;
        route = [];
      }
      const wantsRun =
        c.joystick.x || c.joystick.y
          ? c.joystick.running
          : c.running || c.keys.has("shift");
      const requestedSpeed = c.paused ? 0 : wantsRun ? 4 : 2.1;
      let dx = 0,
        dz = 0;
      if (!c.paused) {
        dx =
          Number(c.keys.has("d") || c.keys.has("arrowright")) -
          Number(c.keys.has("a") || c.keys.has("arrowleft"));
        dz =
          Number(c.keys.has("s") || c.keys.has("arrowdown")) -
          Number(c.keys.has("w") || c.keys.has("arrowup"));
        const keyboardInput = dx !== 0 || dz !== 0;
        if (!keyboardInput) {
          dx = c.joystick.x;
          dz = c.joystick.y;
        }
        if (dx || dz) c.target = null;
        const inputStrength =
          keyboardInput || c.target !== null
            ? 1
            : Math.min(1, Math.hypot(dx, dz));
        const wantsMove = dx !== 0 || dz !== 0 || c.target !== null;
        speed = T.MathUtils.damp(
          speed,
          wantsMove ? requestedSpeed * inputStrength : 0,
          10,
          dt,
        );
        if (c.target !== routeTarget) {
          routeTarget = c.target;
          route =
            c.target === null
              ? []
              : collision.route(
                  playerNormal(),
                  c.target,
                  walkingToDock ? POND_DOCK : undefined,
                );
        }
        if (c.target !== null) {
          const next = route[0];
          if (!next) c.target = null;
          else {
            normal.copy(next).applyQuaternion(world.quaternion);
            const distance = normal.angleTo(UP);
            if (distance < 0.001) {
              route.shift();
              if (!route.length) c.target = null;
            } else {
              axis.crossVectors(normal, UP).normalize();
              q.setFromAxisAngle(axis, Math.min(distance, (dt * speed) / R));
              applyMovement(q);
              dx = normal.x;
              dz = normal.z;
            }
          }
        } else if (dx || dz) {
          axis.set(-dz, 0, dx).normalize();
          q.setFromAxisAngle(axis, (dt * speed) / R);
          const travelled = applyMovement(q);
          if (travelled < 0.00001) {
            dx = 0;
            dz = 0;
          }
        }
      }
      if (walkingToDock && c.target === null) {
        walkingToDock = false;
        if (playerNormal().angleTo(POND_DOCK) < 0.003) settlingTime = 0;
        else onFishing("idle");
      }
      if (settlingTime !== null) {
        // Gently orient the clearing so the water lies between the dock and camera.
        normal.copy(POND_NORMAL).applyQuaternion(world.quaternion);
        const heading = Math.atan2(normal.x, normal.z);
        q.setFromAxisAngle(
          UP,
          -heading * (reduced.matches ? 1 : 1 - Math.exp(-dt * 5)),
        );
        world.quaternion.premultiply(q).normalize();
        settlingTime += dt;
        if (
          reduced.matches ||
          (settlingTime >= 0.65 && Math.abs(heading) < 0.015)
        ) {
          settlingTime = null;
          fishingTime = 0;
          biteReported = false;
          speed = 0;
          onFishing("casting");
        }
      }
      const groundHeight = R + 0.04 + pondDeckHeight(playerNormal());
      if (jumpTime === null) avatar.position.y = groundHeight;
      ring.position.y = groundHeight - 0.01;
      if (c.jump) {
        if (character && !c.paused && jumpTime === null) {
          jumpTime = 0;
          character.cancel();
          c.emote = null;
          onJump(true);
        }
        c.jump = false;
      }
      if (jumpTime !== null && !c.paused) {
        jumpTime += dt;
        const flight = T.MathUtils.clamp((jumpTime - 0.1) / 0.68, 0, 1);
        avatar.position.y = groundHeight + 4 * 0.95 * flight * (1 - flight);
        if (jumpTime >= 0.9) {
          jumpTime = null;
          avatar.position.y = groundHeight;
          onJump(false);
        }
      }
      const moving = dx !== 0 || dz !== 0;
      const request = jumpTime === null ? c.emote : null;
      c.emote = null;
      if (
        moving ||
        request ||
        posing ||
        fishingTime !== null ||
        settlingTime !== null
      ) {
        normal.copy(POND_NORMAL).applyQuaternion(world.quaternion);
        const targetAngle =
          fishingTime !== null || settlingTime !== null
            ? Math.atan2(normal.x, normal.z)
            : moving
              ? Math.atan2(dx, dz)
              : 0;
        const delta = Math.atan2(
          Math.sin(targetAngle - body.rotation.y),
          Math.cos(targetAngle - body.rotation.y),
        );
        body.rotation.y += delta * (1 - Math.exp(-dt * (request ? 100 : 12)));
      }
      character?.update(
        dt,
        moving ? speed : 0,
        request,
        c.paused,
        reduced.matches,
        jumpTime !== null,
        fishingTime !== null,
      );
      let closest: number | null = null,
        distance = 0.105;
      destinations.forEach((d, i) => {
        normal.copy(spotNormal(d.angle)).applyQuaternion(world.quaternion);
        const a = normal.angleTo(UP);
        if (a < distance) {
          distance = a;
          closest = i;
        }
      });
      normal.copy(POND_NORMAL).applyQuaternion(world.quaternion);
      const pondDistance = normal.angleTo(UP);
      if (pondDistance < 0.26 && closest === null) closest = POND_INDEX;
      if (closest !== near) {
        near = closest;
        onNear(near);
      }
      const ambient = reduced.matches ? 0 : time / 1000;
      fishingPond.update(
        ambient,
        fishingTime,
        fishingAttempts >= 1,
        character?.rodTip,
      );
      if (fishingTime !== null) {
        fishingTime += dt;
        if (fishingTime >= 2.3 && !biteReported) {
          biteReported = true;
          onFishing("bite");
        }
        if (fishingTime >= FISHING_DURATION) {
          fishingTime = null;
          fishingAttempts += 1;
          onFishing(fishingAttempts >= 2 ? "caught" : "missed");
        }
      }
      foliage.forEach((tree, i) => {
        tree.rotation.z = Math.sin(ambient * 1.1 + i) * 0.035;
      });
      clouds.children.forEach((cloud, i) => {
        cloud.position.x =
          cloud.userData.homeX + Math.sin(ambient * 0.045 + i * 1.7) * 2.2;
        cloud.position.y =
          cloud.userData.homeY + Math.sin(ambient * 0.12 + i) * 0.09;
      });
      birds.forEach(({ bird, wings }, i) => {
        const phase = ambient * 0.16 + i * 0.19;
        const side = i % 2 === 0 ? 1 : -1;
        bird.position.set(
          Math.cos(phase) * 5.2 + side * (i % 4) * 0.26,
          R + 1.65 + Math.sin(phase * 1.6 + i) * 0.25,
          -5.3 + Math.sin(phase) * 1.65 - i * 0.12,
        );
        bird.rotation.y = Math.atan2(
          -5.2 * Math.sin(phase),
          1.65 * Math.cos(phase),
        );
        bird.rotation.z = Math.sin(phase) * 0.12;
        const gliding = Math.sin(ambient * 0.7 + i) > 0.4;
        const flap = reduced.matches
          ? 0.15
          : gliding
            ? 0.12
            : Math.sin(ambient * 8 + i * 0.9) * 0.55;
        wings[0].rotation.z = flap;
        wings[1].rotation.z = -flap;
      });

      renderer.render(scene, camera);
    });
    return () => {
      disposed = true;
      character?.dispose();
      renderer.setAnimationLoop(null);
      observer.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      const sceneMaterials = new Set<T.Material>(materials.values());
      scene.traverse((o) => {
        if (o instanceof T.Mesh || o instanceof T.Line) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
            sceneMaterials.add(m),
          );
        }
      });
      sceneMaterials.forEach((m) => m.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [controls, onNear, onReady, onError, onEmote, onJump, onFishing]);
  return <div className="world-canvas" ref={host} aria-hidden="true" />;
}
