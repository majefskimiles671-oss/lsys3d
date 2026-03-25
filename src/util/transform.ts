
import type { Segment3D } from "../core/Types.js";
import { rotateY } from "./rotateY.js";

// Simple wind sway deformation
export function deform(segments: Segment3D[], t: number): Segment3D[] {
  const sway = Math.sin(t * 0.001) * 0.1; // radians, small sway

  return segments.map(seg => ({
    start: rotateY(seg.start, sway),
    end: rotateY(seg.end, sway)
  }));
}
