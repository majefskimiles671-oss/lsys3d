import type { Vec3 } from "../core/Types.js";

export function add(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function scale(v: Vec3, s: number): Vec3 {
  return { x: v.x * s, y: v.y * s, z: v.z * s };
}

export function clone(v: Vec3): Vec3 {
  return { x: v.x, y: v.y, z: v.z };
}