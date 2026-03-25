const project_def = "Lsys3d Yay!!!";

console.log("----------------------------------");
console.log(`Project Definition: ${project_def}`);
console.log("----------------------------------");

import { ruleSets } from "./rules/index.js"
import { LSystem } from "../core/LSystem.js";
import { Turtle3D } from "../core/Turtle3D.js";
import { Camera } from "../core/Camera.js";
import { Renderer } from "../core/Renderer.js";
import { deform} from "../util/transform.js";
import { recenterSegments, scaleSegments, translateSegments } 
  from "../util/scene.js";


const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 900;
canvas.height = 700;


// const selected = "Plant3D";
// const selected = "Starburst";
// const selected = "SimpleTree";
const selected = "SpiralTree";
const rules = ruleSets.get(selected)!

const lsys = new LSystem("X", rules);
const program = lsys.generate(5);

const turtle = new Turtle3D(6);
const camera = new Camera();
const renderer = new Renderer(canvas);

// --- Orbit Controls ---
let dragging = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener("mousedown", e => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
});

window.addEventListener("mousemove", e => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    camera.theta += dx * 0.005;
    camera.phi += dy * 0.005;
    camera.phi = Math.max(-1.5, Math.min(1.5, camera.phi));

});

window.addEventListener("mouseup", () => dragging = false);

canvas.addEventListener("wheel", e => {
    camera.radius += e.deltaY * 0.5;
    camera.radius = Math.max(50, Math.min(2000, camera.radius));
});


const baseSegments = turtle.interpret(program, 22.5); // generate once

// Keep it centered
// recenterSegments(baseSegments);

// Increase size if needed
scaleSegments(baseSegments, 10);

// Move plant away from camera
translateSegments(baseSegments, 0, 0, 1000);


function loop(time: number) {
    const animated = deform(baseSegments, time);
    renderer.render(animated, camera);

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
