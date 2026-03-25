import type { Vec3, Segment3D } from "./Types.js";
import { rotateAround } from "../util/math.js";
import { add, scale, clone } from "../util/vector.js";

/**
 * A stable 3D turtle interpreter with orthonormal basis maintenance.
 * This prevents exploding geometry and ensures long-term numerical stability.
 */
export class Turtle3D {
    private pos: Vec3 = { x: 0, y: 0, z: 0 };

    // Local basis vectors (Heading, Left, Up)
    private H: Vec3 = { x: 0, y: 1, z: 0 };   // forward
    private L: Vec3 = { x: -1, y: 0, z: 0 };  // left
    private U: Vec3 = { x: 0, y: 0, z: 1 };   // up

    private stack: any[] = [];
    private segments: Segment3D[] = [];

    constructor(private step = 7) { }

    // ----------------------------------------------------------
    // Math helpers
    // ----------------------------------------------------------

    private normalize(v: Vec3): Vec3 {
        const len = Math.hypot(v.x, v.y, v.z);
        return { x: v.x / len, y: v.y / len, z: v.z / len };
    }

    private cross(a: Vec3, b: Vec3): Vec3 {
        return {
            x: a.y * b.z - a.z * b.y,
            y: a.z * b.x - a.x * b.z,
            z: a.x * b.y - a.y * b.x,
        };
    }

    /**
     * Fix orthonormal basis drift.
     * Ensures H, L, U remain perpendicular & normalized.
     * This is absolutely critical for stability.
     */
    private fixBasis() {
        // Normalize heading
        this.H = this.normalize(this.H);

        // Make Left perpendicular to H
        this.L = this.normalize(this.cross(this.U, this.H));

        // Make Up perpendicular to both (Right-hand rule)
        this.U = this.cross(this.H, this.L);
    }

    // ----------------------------------------------------------
    // Interpret the L-system program into 3D line segments
    // ----------------------------------------------------------

    interpret(program: string, angleDeg: number): Segment3D[] {
        const angle = angleDeg * Math.PI / 180;
        this.segments = [];

        for (const c of program) {

            if (!Number.isFinite(this.pos.x) ||
                !Number.isFinite(this.pos.y) ||
                !Number.isFinite(this.pos.z)) {
                console.error("BAD POSITION")
            };

            switch (c) {

                // ------------------------------------------------------
                // Move forward & draw
                // ------------------------------------------------------
                case "F": {
                    const newPos = add(this.pos, scale(this.H, this.step));
                    this.segments.push({ start: clone(this.pos), end: clone(newPos) });
                    this.pos = newPos;
                    break;
                }

                // ------------------------------------------------------
                // Yaw left/right
                // ------------------------------------------------------
                case "+": {
                    this.H = rotateAround(this.H, this.U, +angle);
                    this.L = rotateAround(this.L, this.U, +angle);
                    this.fixBasis();
                    break;
                }

                case "-": {
                    this.H = rotateAround(this.H, this.U, -angle);
                    this.L = rotateAround(this.L, this.U, -angle);
                    this.fixBasis();
                    break;
                }

                // ------------------------------------------------------
                // Pitch down/up
                // ------------------------------------------------------
                case "&": { // pitch down
                    this.H = rotateAround(this.H, this.L, +angle);
                    this.U = rotateAround(this.U, this.L, +angle);
                    this.fixBasis();
                    break;
                }

                case "^": { // pitch up
                    this.H = rotateAround(this.H, this.L, -angle);
                    this.U = rotateAround(this.U, this.L, -angle);
                    this.fixBasis();
                    break;
                }

                // ------------------------------------------------------
                // Roll left/right
                // ------------------------------------------------------
                case "\\": {
                    this.L = rotateAround(this.L, this.H, +angle);
                    this.U = rotateAround(this.U, this.H, +angle);
                    this.fixBasis();
                    break;
                }

                case "/": {
                    this.L = rotateAround(this.L, this.H, -angle);
                    this.U = rotateAround(this.U, this.H, -angle);
                    this.fixBasis();
                    break;
                }

                // ------------------------------------------------------
                // Push/pop turtle state
                // ------------------------------------------------------
                case "[":
                    this.stack.push({
                        pos: clone(this.pos),
                        H: clone(this.H),
                        L: clone(this.L),
                        U: clone(this.U),
                    });
                    break;

                case "]": {
                    const s = this.stack.pop();
                    this.pos = s.pos;
                    this.H = s.H;
                    this.L = s.L;
                    this.U = s.U;
                    break;
                }
            }
        }

        return this.segments;
    }
}