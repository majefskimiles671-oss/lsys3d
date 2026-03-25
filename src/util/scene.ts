import type { Segment3D, Vec3 } from "../core/Types.js";

/**
 * Compute the bounding box of a set of 3D line segments.
 */
export function getBounds(segments: Segment3D[]) {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (const seg of segments) {
    const pts = [seg.start, seg.end];
    for (const p of pts) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
      minZ = Math.min(minZ, p.z);
      maxZ = Math.max(maxZ, p.z);
    }
  }

  return {
    min: { x: minX, y: minY, z: minZ } as Vec3,
    max: { x: maxX, y: maxY, z: maxZ } as Vec3,
    center: {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
      z: (minZ + maxZ) / 2
    } as Vec3
  };
}

/**
 * Shift all segments by a given offset.
 */
export function translateSegments(
  segments: Segment3D[],
  dx: number,
  dy: number,
  dz: number
) {
  for (const seg of segments) {
    seg.start.x += dx;  seg.end.x += dx;
    seg.start.y += dy;  seg.end.y += dy;
    seg.start.z += dz;  seg.end.z += dz;
  }
}

/**
 * Uniformly scale all segments from the origin (0,0,0).
 */
export function scaleSegments(segments: Segment3D[], factor: number) {
  for (const seg of segments) {
    seg.start.x *= factor;  seg.end.x *= factor;
    seg.start.y *= factor;  seg.end.y *= factor;
    seg.start.z *= factor;  seg.end.z *= factor;
  }
}

/**
 * Center the segments so their geometric center is at (0,0,0).
 */
export function recenterSegments(segments: Segment3D[]) {
  const bounds = getBounds(segments);
  const cx = bounds.center.x;
  const cy = bounds.center.y;
  const cz = bounds.center.z;

  translateSegments(segments, -cx, -cy, -cz);
}