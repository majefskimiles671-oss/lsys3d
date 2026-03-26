//--------------------------------------------------------------
// Project Metadata
//--------------------------------------------------------------
const project_def = "Lsys3d";
console.log("----------------------------------");
console.log(`Project Definition: ${project_def}`);
console.log("----------------------------------");


//--------------------------------------------------------------
// Imports
//--------------------------------------------------------------
import { LSystem } from "../core/LSystem.js";
import { Turtle3D } from "../core/Turtle3D.js";
import { Camera } from "../core/Camera.js";
import { Renderer } from "../core/Renderer.js";
import { GridRenderer } from "../core/GridRenderer.js";

import { deform } from "../util/transform.js";
import {
  recenterSegments,
  scaleSegments,
  translateSegments
} from "../util/scene.js";

import { ruleLibrary } from "./rules/library.js";


//--------------------------------------------------------------
// UI Setup
//--------------------------------------------------------------
const ruleSelect  = document.getElementById("ruleSelect") as HTMLSelectElement;
const iterSlider  = document.getElementById("iterSlider") as HTMLInputElement;
const iterLabel   = document.getElementById("iterLabel") as HTMLSpanElement;
const stepSlider  = document.getElementById("stepSlider") as HTMLInputElement;
const stepLabel   = document.getElementById("stepLabel") as HTMLSpanElement;

// Live labels
iterSlider.oninput = () => iterLabel.textContent = iterSlider.value;
stepSlider.oninput = () => stepLabel.textContent = stepSlider.value;

// Populate rule dropdown
for (const { name } of ruleLibrary) {
  const opt = document.createElement("option");
  opt.value = name;
  opt.textContent = name;
  ruleSelect.appendChild(opt);
}
ruleSelect.value = "Plant3D";


//--------------------------------------------------------------
// Canvas + Renderer Initialization
//--------------------------------------------------------------
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 900;
canvas.height = 700;

const camera = new Camera();
const renderer = new Renderer(canvas);
const projector = renderer.getProjector();
const grid = new GridRenderer(canvas, projector);


//--------------------------------------------------------------
//  Geometry Builder (L-System → Turtle → Segments)
//--------------------------------------------------------------
function buildGeometry(ruleName: string, iterations: number, step: number) {
  const entry = ruleLibrary.find(r => r.name === ruleName)!;

  const lsys = new LSystem("X", entry.rules);
  const program = lsys.generate(iterations);

  const turtle = new Turtle3D(step);
  const segments = turtle.interpret(program, 22.5);

  // Optional scene prep pipeline
  // recenterSegments(segments);
  scaleSegments(segments, 2.0);
  // translateSegments(segments, 0, 0, 200);

  return segments;
}


//--------------------------------------------------------------
//  Rebuild callback for any UI change
//--------------------------------------------------------------
function rebuild() {
  const iter = Number(iterSlider.value);
  const step = Number(stepSlider.value);
  baseSegments = buildGeometry(ruleSelect.value, iter, step);
}

// React to UI changes
ruleSelect.addEventListener("change", rebuild);
iterSlider.addEventListener("input", rebuild);
stepSlider.addEventListener("input", rebuild);


// Initial geometry
let baseSegments = buildGeometry(
  ruleSelect.value,
  Number(iterSlider.value),
  Number(stepSlider.value)
);


//--------------------------------------------------------------
// Orbit Camera Controls
//--------------------------------------------------------------
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

  camera.theta -= dx * 0.005;
  camera.phi   += dy * 0.005;

  camera.phi = Math.max(-1.5, Math.min(1.5, camera.phi));
});

window.addEventListener("mouseup", () => dragging = false);

// Zoom control
canvas.addEventListener("wheel", e => {
  e.preventDefault();
  camera.radius += e.deltaY * 0.5;
  camera.radius = Math.max(50, Math.min(2000, camera.radius));
}, { passive: false });


//--------------------------------------------------------------
// Main Animation Loop
//--------------------------------------------------------------
function loop(time: number) {
  const animated = deform(baseSegments, time);

  renderer.clear();
  grid.render(camera);
  renderer.render(animated, camera);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);