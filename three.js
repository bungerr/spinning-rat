import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const xSlider = document.querySelector("#x-speed");
const ySlider = document.querySelector("#y-speed");
const zSlider = document.querySelector("#z-speed");
const hBtn = document.querySelector("#set-horizontal");
const vBtn = document.querySelector("#set-vertical");
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
	ySpeed = 0.01;
	ySlider.value = 1;
	model.rotation.x = 0;
	xSpeed = 0;
	xSlider.value = 0;
	model.rotation.z = 0;
	zSpeed = 0;
	zSlider.value = 0;
	camera.position.set(0, 1.2, 10);
});

vBtn.addEventListener("click", () => {
	xSpeed = 0.01;
	xSlider.value = 1;
	model.rotation.y = 0;
	ySpeed = 0;
	ySlider.value = 0;
	model.rotation.z = -(Math.PI / 2);
	zSpeed = 0;
	zSlider.value = 0;
	camera.position.set(0, 1.2, 10);
});

cover.addEventListener("click", () => {
	cover.style.display = "none";
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

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

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
	controls.update();
	renderer.render(scene, camera);
}

animate();

