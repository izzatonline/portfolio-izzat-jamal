"use client";

import { useEffect, useRef, useState } from "react";
import * as T from "three";
import { Globe2 } from "lucide-react";

export default function WorldLauncherGlobe() {
  const host = useRef<HTMLSpanElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: T.WebGLRenderer;
    try {
      renderer = new T.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      const timer = window.setTimeout(() => setFailed(true), 0);
      return () => window.clearTimeout(timer);
    }
    renderer.setSize(152, 152);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = T.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(34, 1, 0.1, 20);
    camera.position.set(0, 1.6, 5.2);
    camera.lookAt(0, 0.05, 0);
    scene.add(new T.HemisphereLight(0xfff5da, 0x426953, 2.6));
    const sun = new T.DirectionalLight(0xffe4b8, 3.1);
    sun.position.set(-3, 5, 4);
    scene.add(sun);
    const world = new T.Group();
    scene.add(world);
    const materials = new Map<number, T.MeshStandardMaterial>();
    const add = (
      parent: T.Object3D,
      geometry: T.BufferGeometry,
      color: number,
      y = 0,
    ) => {
      if (!materials.has(color))
        materials.set(
          color,
          new T.MeshStandardMaterial({
            color,
            roughness: 0.85,
            flatShading: true,
          }),
        );
      const mesh = new T.Mesh(geometry, materials.get(color));
      mesh.position.y = y;
      parent.add(mesh);
      return mesh;
    };
    add(world, new T.IcosahedronGeometry(1, 2), 0x94b87c);
    const up = new T.Vector3(0, 1, 0);
    const surface = (normal: T.Vector3) => {
      const group = new T.Group();
      group.position.copy(normal).multiplyScalar(0.985);
      group.quaternion.setFromUnitVectors(up, normal);
      world.add(group);
      return group;
    };
    for (let i = 0; i < 22; i++) {
      const y = 1 - ((i + 0.5) * 2) / 22;
      const angle = i * 2.39996;
      const normal = new T.Vector3(
        Math.cos(angle) * Math.sqrt(1 - y * y),
        y,
        Math.sin(angle) * Math.sqrt(1 - y * y),
      );
      const group = surface(normal);
      if (i % 7 === 0) {
        add(group, new T.BoxGeometry(0.23, 0.23, 0.2), 0xffe8bd, 0.1);
        const roof = add(
          group,
          new T.ConeGeometry(0.21, 0.17, 4),
          [0xe79569, 0x8aace0, 0xd9b864][Math.floor(i / 7) % 3],
          0.28,
        );
        roof.rotation.y = Math.PI / 4;
        const door = add(
          group,
          new T.BoxGeometry(0.07, 0.13, 0.014),
          0x486352,
          0.07,
        );
        door.position.z = 0.105;
      } else if (i % 5 === 0) {
        const rock = add(
          group,
          new T.IcosahedronGeometry(0.11, 0),
          0xd4d0a8,
          0.03,
        );
        rock.scale.y = 0.55;
      } else {
        add(
          group,
          new T.CylinderGeometry(0.018, 0.026, 0.14, 5),
          0x916a48,
          0.06,
        );
        add(
          group,
          i % 2
            ? new T.ConeGeometry(0.11, 0.28, 5)
            : new T.IcosahedronGeometry(0.115, 0),
          i % 2 ? 0x3d7352 : 0x6d9753,
          0.23,
        );
      }
    }
    const lake = surface(new T.Vector3(-0.4, 0.35, 1).normalize());
    const water = add(lake, new T.SphereGeometry(1, 16, 6), 0x6cc2be, 0.007);
    water.scale.set(0.26, 0.025, 0.18);
    world.rotation.set(0.14, 0.45, -0.15);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let previous = 0;
    const draw = (time: number) => {
      if (previous && time - previous < 1000 / 30) return;
      const dt = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
      previous = time;
      world.rotation.y += dt * 0.14;
      renderer.render(scene, camera);
    };
    const updateMotion = () => {
      previous = 0;
      renderer.setAnimationLoop(null);
      if (!document.hidden) {
        renderer.render(scene, camera);
        if (!reduced.matches) renderer.setAnimationLoop(draw);
      }
    };
    const lost = (event: Event) => {
      event.preventDefault();
      renderer.setAnimationLoop(null);
      setFailed(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    reduced.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateMotion);
    updateMotion();
    return () => {
      renderer.setAnimationLoop(null);
      reduced.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateMotion);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      world.traverse((o) => {
        if (o instanceof T.Mesh) o.geometry.dispose();
      });
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);
  return (
    <span
      ref={host}
      className={`world-launcher-canvas${failed ? " is-unavailable" : ""}`}
    >
      {failed && <Globe2 className="world-launcher-fallback" strokeWidth={1} />}
    </span>
  );
}
