import type { Vec3 } from "./Types.js";

export class Camera {
  constructor(
    public theta = 0,
    public phi = 0.5,
    public radius = 200
  ) { }

  getPosition(): Vec3 {
    return {
      x: this.radius * Math.cos(this.phi) * Math.sin(this.theta),
      y: this.radius * Math.sin(this.phi),
      z: this.radius * Math.cos(this.phi) * Math.cos(this.theta)
    };
  }
}