import type { Segment3D, Vec3 } from "./Types.js";
import { Camera } from "./Camera.js";

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
  }


  getProjector() {
    return this.project.bind(this);
  }


  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }


  /**
   * Convert world-space point to screen-space.
   * Uses a stable orbit-camera transform + safe projection.
   */
  private project(p: Vec3, camera: Camera) {
    const cam = camera.getPosition();

    const theta = camera.theta;
    const phi = camera.phi;

    // ------------------------------------------------------------
    // 1. Compute a stable forward vector from spherical angles
    //    (look direction, not -cameraPos!)
    // ------------------------------------------------------------
    // Vector pointing from camera to the origin (0,0,0)
    const forward = {
      x: -cam.x,
      y: -cam.y,
      z: -cam.z
    };

    // Normalize
    const flen = Math.hypot(forward.x, forward.y, forward.z);
    forward.x /= flen;
    forward.y /= flen;
    forward.z /= flen;

    // ------------------------------------------------------------
    // 2. Compute right axis (perpendicular to yaw)
    // ------------------------------------------------------------
    const right = {
      x: Math.cos(theta),
      y: 0,
      z: -Math.sin(theta)
    };

    // ------------------------------------------------------------
    // 3. Compute up = right × forward
    // ------------------------------------------------------------
    const up = {
      x: right.y * forward.z - right.z * forward.y,
      y: right.z * forward.x - right.x * forward.z,
      z: right.x * forward.y - right.y * forward.x,
    };

    // ------------------------------------------------------------
    // 4. Convert point to camera-local coordinates
    // ------------------------------------------------------------
    const dx = p.x - cam.x;
    const dy = p.y - cam.y;
    const dz = p.z - cam.z;

    const cx = dx * right.x + dy * right.y + dz * right.z;
    const cy = dx * up.x + dy * up.y + dz * up.z;
    const cz = dx * forward.x + dy * forward.y + dz * forward.z;

    // ------------------------------------------------------------
    // 5. Near-plane cutoff to prevent infinite zoom
    //    cz < -NEAR means the point is behind the camera
    // ------------------------------------------------------------
    const NEAR = -1000; // safe near clipping plane (in camera space)
    if (cz < NEAR) {
      return null; // skip this point
    }

    // ------------------------------------------------------------
    // 6. Stable perspective projection with clamped denominator
    // ------------------------------------------------------------
    const denom = Math.max(300 + cz, 1); // never let it get near 0
    const depth = 300 / denom;

    return {
      x: this.canvas.width / 2 + cx * depth,
      y: this.canvas.height / 2 - cy * depth
    };
  }

  /**
   * Draw all visible 3D segments.
   */
  render(segments: Segment3D[], camera: Camera) {
    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = 1;

    for (const seg of segments) {
      const A = this.project(seg.start, camera);
      if (!A) continue;
      const B = this.project(seg.end, camera);
      if (!B) continue;

      this.ctx.beginPath();
      this.ctx.moveTo(A.x, A.y);
      this.ctx.lineTo(B.x, B.y);
      this.ctx.stroke();
    }
  }
}