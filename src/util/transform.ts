
import type { Segment3D } from "../core/Types.js";
import { rotateY } from "./rotateY.js";

// Simple wind sway deformation
export function deform(segments: Segment3D[], t: number): Segment3D[] {
  const sway = Math.sin(t * 0.001) * 0.1; // radians, small sway

  return segments.map(seg => ({
    start: rotateY(seg.start, sway),
    end:   rotateY(seg.end,   sway)
  }));
}

// export function scaleSegments(segments: Segment3D[], factor: number) {
//   for (const s of segments) {
//     s.start.x *= factor;
//   }
// }


// export function translateSegments(segments: Segment3D[], dx: number, dy: number, dz: number) {
//   for (const s of segments) {
//     s.start.x += dx;
//     s.start.y += dy;
//     s.start.z += dz;
//     s.end.x   += dx;
//     s.end.y   += dy;
//     s.end.z   += dz;
//   }
// }



// export function recenter(segments: Segment3D[]) {
//   let minX = Infinity, maxX = -Infinity;
//   let minY = Infinity, maxY = -Infinity;
//   let minZ = Infinity, maxZ = -Infinity;

//   for (const s of segments) {
//     const pts = [s.start, s.end];
//     for (const p of pts) {
//       minX = Math.min(minX, p.x);
//       maxX = Math.max(maxX, p.x);
//       minY = Math.min(minY, p.y);
//       maxY = Math.max(maxY, p.y);
//       minZ = Math.min(minZ, p.z);
//       maxZ = Math.max(maxZ, p.z);
//     }
//   }

//   const cx = (minX + maxX) / 2;
//   const cy = (minY + maxY) / 2;
//   const cz = (minZ + maxZ) / 2;

//   for (const s of segments) {
//     s.start.x -= cx;  s.end.x -= cx;
//     s.start.y -= cy;  s.end.y -= cy;
//     s.start.z -= cz;  s.end.z -= cz;
//   }
// }