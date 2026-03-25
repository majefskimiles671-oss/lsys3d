import type { Vec3 } from "../core/Types.js";

export function rotateAround(v: Vec3, axis: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  // Normalize axis first
  axis = normalize(axis);


  return {
    x: v.x * cos + (axis.y * v.z - axis.z * v.y) * sin,
    y: v.y * cos + (axis.z * v.x - axis.x * v.z) * sin,
    z: v.z * cos + (axis.x * v.y - axis.y * v.x) * sin
  };
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z);
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}