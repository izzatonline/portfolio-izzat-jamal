import * as T from "three";

// Palette cells belong to the bundled KayKit explorer, not arbitrary GLTFs.
// Keep the original skin weights and geometry so every existing clip still works.
export function personaliseCharacter(model: T.Group) {
  const skin = "#b98769";
  const palettes: Record<string, Record<string, string>> = {
    head: { "1,3": "#20252c", "0,3": skin, "2,3": "#161b23", "3,3": "#303944" },
    arm: { "0,2": "#737e99", "5,1": skin, "5,3": "#66718c", "1,2": "#515e78" },
    body: { "7,2": "#303c4b", "0,2": "#737e99", "5,3": "#384450", "6,3": "#455365", "3,3": "#9ba9b5", "1,2": "#596680" },
    leg: { "3,1": "#343e4b", "0,3": skin, "7,2": "#354457" },
  };
  model.traverse((object) => {
    if (!(object instanceof T.SkinnedMesh)) return;
    const part = object.name.includes("Head") ? "head" : object.name.includes("Arm") ? "arm" : object.name.includes("Leg") ? "leg" : "body";
    const uv = object.geometry.getAttribute("uv");
    // Remove the stock earring and low hanging hair tail for a short haircut.
    if (part === "head") {
      const position = object.geometry.getAttribute("position");
      const index = object.geometry.getIndex();
      if (index) {
        const kept: number[] = [];
        for (let i = 0; i < index.count; i += 3) {
          const triangle = [index.getX(i), index.getX(i + 1), index.getX(i + 2)];
          const accessory = triangle.every((v) => Math.floor(uv.getX(v) * 8) === 3);
          const tail = triangle.every((v) => Math.floor(uv.getX(v) * 8) === 1) &&
            triangle.some((v) => position.getY(v) < 1.55);
          if (!accessory && !tail) kept.push(...triangle);
        }
        object.geometry.setIndex(kept);
      }
    }
    const colors: number[] = [];
    const color = new T.Color();
    for (let i = 0; i < uv.count; i++) {
      const cell = `${Math.floor(uv.getX(i) * 8)},${Math.floor((1 - uv.getY(i)) * 4)}`;
      color.set(palettes[part][cell] ?? "#69788a");
      colors.push(color.r, color.g, color.b);
    }
    object.geometry.setAttribute("color", new T.Float32BufferAttribute(colors, 3));
    // Clone to leave the source equipment's shared material intact for cleanup.
    const material = (object.material as T.MeshStandardMaterial).clone();
    material.map = null;
    material.color.set(0xffffff);
    material.vertexColors = true;
    material.roughness = 0.86;
    object.material = material;
  });

  const head = model.getObjectByName("head");
  if (!head) return;
  const details = new T.Group();
  details.name = "PersonalisedFace";
  head.add(details);
  const frame = new T.MeshStandardMaterial({ color: "#1c2430", roughness: 0.58 });
  const line = (points: T.Vector3[], radius: number, material: T.Material, closed = false) => {
    const curve = new T.CatmullRomCurve3(points, closed, "centripetal");
    const mesh = new T.Mesh(new T.TubeGeometry(curve, 40, radius, 6, closed), material);
    mesh.castShadow = true;
    details.add(mesh);
  };
  // Soft rectangular frames; open lenses keep the eyes readable at game scale.
  for (const side of [-1, 1]) {
    const cx = side * 0.205;
    line([
      [-0.15, 0.09], [0.15, 0.09], [0.17, 0.06], [0.15, -0.10],
      [0.11, -0.12], [-0.11, -0.12], [-0.15, -0.09], [-0.17, 0.05],
    ].map(([x, y]) => new T.Vector3(cx + x, 0.385 + y, 0.505 - Math.abs(cx + x) * 0.13)), 0.014, frame, true);
    line([new T.Vector3(side * 0.37, 0.435, 0.46), new T.Vector3(side * 0.46, 0.43, 0.27), new T.Vector3(side * 0.47, 0.36, 0.03)], 0.012, frame);
  }
  line([new T.Vector3(-0.05, 0.42, 0.503), new T.Vector3(0, 0.44, 0.527), new T.Vector3(0.05, 0.42, 0.503)], 0.013, frame);
}
