import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//galaxy

const parameters = {};
parameters.count = 100000;
parameters.size = 0.01;
parameters.radius = 6;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomness = 1;
parameters.randomnessPower = 3;
parameters.insideColor = "#ff4584";
parameters.outsideColor = "#004598";

let geometry = null;
let material = null;
let points = null;

const particlegalaxy = () => {
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const Colors = new Float32Array(parameters.count * 3);

  const colorinside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius;
    const spinagle = radius * parameters.spin;
    const branchangele =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);

    positions[i3 + 0] = Math.cos(branchangele + spinagle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchangele + spinagle) * radius + randomZ;

    // color

    const mixedColor = colorinside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);

    Colors[i3 + 0] = mixedColor.r;
    Colors[i3 + 1] = mixedColor.g;
    Colors[i3 + 2] = mixedColor.b;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(Colors, 3));

  material = new THREE.PointsMaterial();
  material.size = parameters.size;
  material.sizeAttenuation = true;
  material.depthWrite = false;
  material.blending = THREE.AdditiveBlending;
  // material.color = "#ff4795";
  material.vertexColors = true;

  points = new THREE.Points(geometry, material);
  scene.add(points);
};
particlegalaxy();
gui
  .add(parameters, "count")
  .min(100)
  .max(1000000)
  .step(100)
  .name("የኮከቦች ብዛት")
  .onFinishChange(particlegalaxy);
gui
  .add(parameters, "size")
  .min(0.01)
  .max(0.82)
  .step(0.001)
  .name("የኮከቦች መጠን")
  .onFinishChange(particlegalaxy);
particlegalaxy();
gui
  .add(parameters, "radius")
  .min(1)
  .max(100)
  .step(1)
  .name("የኮከቦች እርዝመት")
  .onFinishChange(particlegalaxy);
gui
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .name("ቅርኝጫፎች")
  .onFinishChange(particlegalaxy);
gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.01)
  .name("የኮከቦች ዙረት")
  .onFinishChange(particlegalaxy);
gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.01)
  .name("የኮከቦች ስርጭት")
  .onFinishChange(particlegalaxy);
gui
  .add(parameters, "randomnessPower")
  .min(1)
  .max(10)
  .step(0.01)
  .name("የኮከቦች ስርጭት ሃይል")
  .onFinishChange(particlegalaxy);
gui
  .addColor(parameters, "insideColor")
  .name("የውስጥ ቀለም")
  .onFinishChange(particlegalaxy);
gui
  .addColor(parameters, "outsideColor")
  .name("የውጪ ቀለም")
  .onFinishChange(particlegalaxy);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
