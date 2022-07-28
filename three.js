import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const xSlider = document.querySelector("#x-speed");
const ySlider = document.querySelector("#y-speed");
const zSlider = document.querySelector("#z-speed");
const hBtn = document.querySelector("#set-horizontal");
const cover = document.querySelector(".cover");

let xSpeed = xSlider.value / 100;
let ySpeed = ySlider.value / 100;
let zSpeed = zSlider.value / 100;

xSlider.addEventListener("input", () => {
	xSpeed = xSlider.value / 100;
});
ySlider.addEventListener("input", () => {
	ySpeed = ySlider.value / 100;
});
zSlider.addEventListener("input", () => {
	zSpeed = zSlider.value / 100;
});

hBtn.addEventListener("click", () => {
	model.rotation.x = 0;
	xSpeed = 0;
	model.rotation.z = 0;
	zSpeed = 0;
});

cover.addEventListener("click", () => {
	cover.style.display = "none";
	// sound.play();
});

// SETUP -- Initialises essential elements for three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector("#bg"),
});
renderer.outputEncoding = THREE.sRGBEncoding;

// MODEL -- Imports and sets model logic
let model;
const loader = new GLTFLoader();
loader.load(
	"/rat/scene.gltf",
	function (gltf) {
		model = gltf.scene;
		model.scale.set(0.1, 0.1, 0.1);
		scene.add(model);
	},
	function (xhr) {
		console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
	},
	function (error) {
		console.error(error);
	}
);

// LIGHT -- innits light attribute
const pointLight = new THREE.AmbientLight(0x404040);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 1.2, 10);

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
const sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load("/bird.mp3", function (buffer) {
	sound.setBuffer(buffer);
	sound.setLoop(true);
	sound.setVolume(1);
	sound.play();
});

window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
	requestAnimationFrame(animate);
	if (model) {
		model.rotation.x += xSpeed;
		model.rotation.y += ySpeed;
		model.rotation.z += zSpeed;
	}
	renderer.render(scene, camera);
}

animate();

