const project_def = "Lsys3d Yay!!!";

console.log("----------------------------------");
console.log(`Project Definition: ${project_def}`);
console.log("----------------------------------");

import { LSystem } from "../core/LSystem.js";
import { Turtle3D } from "../core/Turtle3D.js";
import { Camera } from "../core/Camera.js";
import { Renderer } from "../core/Renderer.js";
import { plantRules } from "./rules/Plant3D.js";
import { lerp } from "../util/math.js";
import { deform} from "../util/transform.js";

import { recenterSegments, scaleSegments, translateSegments } 
  from "../util/scene.js";


const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 900;
canvas.height = 700;

const lsys = new LSystem("X", plantRules);
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
recenterSegments(baseSegments);

// Increase size if needed
scaleSegments(baseSegments, 10.0);

// Move plant away from camera
translateSegments(baseSegments, 0, 0, 400);


function loop(time: number) {
    const animated = deform(baseSegments, time);
    renderer.render(animated, camera);

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

// // --- Animation ---
// let angleOffsetPrev = 0;
// let angleOffsetNext = 0;
// let t = 0;
// const updateInterval = 500;
// // let lastUpdate = 0;

// let lastUpdate = 0;
// let lastFrameTime = 0;

// const baseSegments = turtle.interpret(program, 22.5);

// function loop(time: number) {
//     //   const dt = time - lastUpdate;


//     const frameDelta = time - lastFrameTime;
//     lastFrameTime = time;



//     // // choose new offset occasionally
//     // if (dt > updateInterval) {
//     //     lastUpdate = time;
//     //     angleOffsetPrev = angleOffsetNext;
//     //     angleOffsetNext = (Math.random() * 10) - 5;
//     //     t = 0;
//     // }

//     // // interpolate offset
//     // t = Math.min(1, t + (dt / updateInterval));
//     // const angleOffset = lerp(angleOffsetPrev, angleOffsetNext, t);


//     // UPDATE INTERVAL LOGIC
//     if (time - lastUpdate > updateInterval) {
//         lastUpdate = time;
//         angleOffsetPrev = angleOffsetNext;
//         angleOffsetNext = (Math.random() * 10) - 5;
//         t = 0;
//     }

//     // INTERPOLATION USING frameDelta
//     t += frameDelta / updateInterval;
//     t = Math.min(t, 1);

//     // const angleOffset = lerp(angleOffsetPrev, angleOffsetNext, t);
//     // const angleOffset = 0;

//     // const segments = turtle.interpret(program, 22.5 + angleOffset);
//     // const segments = turtle.interpret(program, 0);
//     console.log(baseSegments[0]?.start.y, baseSegments[0]?.end.y);
//     const deformed = baseSegments.map(seg => deform(seg, time * 0.001));
// renderer.render(deformed, camera);
//     renderer.render(baseSegments, camera);
//     console.log("radius:", camera.radius);
//     requestAnimationFrame(loop);
// }

// requestAnimationFrame(loop);