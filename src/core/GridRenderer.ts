import type { Vec3 } from "./Types.js";
import type { Camera } from "./Camera.js";

export class GridRenderer {
    constructor(
        private canvas: HTMLCanvasElement,
        private projectPoint: (p: Vec3, camera: Camera) => { x: number; y: number } | null
    ) { }

    private drawLine(
        a: Vec3,
        b: Vec3,
        camera: Camera,
        ctx: CanvasRenderingContext2D
    ) {
        const A = this.projectPoint(a, camera);
        const B = this.projectPoint(b, camera);
        if (!A || !B) return;

        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
    }

    render(camera: Camera) {
        const ctx = this.canvas.getContext("2d")!;
        ctx.save();

        // grid plane BELOW EVERYTHING
        const GRID_Y = 0;

        const SIZE = 500;
        const STEP = 50;

        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(180,180,180,0.35)";

        // draw lines parallel to X
        for (let z = -SIZE; z <= SIZE; z += STEP) {
            this.drawLine(
                { x: -SIZE, y: GRID_Y, z },
                { x: SIZE, y: GRID_Y, z },
                camera,
                ctx
            );
        }

        // draw lines parallel to Z
        for (let x = -SIZE; x <= SIZE; x += STEP) {
            this.drawLine(
                { x, y: GRID_Y, z: -SIZE },
                { x, y: GRID_Y, z: SIZE },
                camera,
                ctx
            );
        }

        // AXES
        const AXIS_LEN = 200;

        // X (red)
        ctx.strokeStyle = "red";
        this.drawLine(
            { x: 0, y: GRID_Y, z: 0 },
            { x: AXIS_LEN, y: GRID_Y, z: 0 },
            camera,
            ctx
        );

        // Y (green)
        ctx.strokeStyle = "green";
        this.drawLine(
            { x: 0, y: GRID_Y, z: 0 },
            { x: 0, y: GRID_Y + AXIS_LEN, z: 0 },
            camera,
            ctx
        );

        // Z (blue)
        ctx.strokeStyle = "blue";
        this.drawLine(
            { x: 0, y: GRID_Y, z: 0 },
            { x: 0, y: GRID_Y, z: AXIS_LEN },
            camera,
            ctx
        );

        ctx.restore();
    }
}