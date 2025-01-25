import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper';

// UI Elements and Initialization
const xSlider = document.querySelector("#x-speed");
const ySlider = document.querySelector("#y-speed");
const zSlider = document.querySelector("#z-speed");
const hBtn = document.querySelector("#set-horizontal");
const vBtn = document.querySelector("#set-vertical");
const cover = document.querySelector(".cover");

// Audio Parameters
const MAX_FREQ = 20000;  // Full frequency spectrum
const MIN_FREQ = 200;    // Heavy muffling
let sound, audioContext, biquadFilter;

// Rotation Controls
let xSpeed = xSlider.value / 100;
let ySpeed = ySlider.value / 100;
let zSpeed = zSlider.value / 100;

// Event Listeners
xSlider.addEventListener("input", () => { xSpeed = xSlider.value / 100; });
ySlider.addEventListener("input", () => { ySpeed = ySlider.value / 100; });
zSlider.addEventListener("input", () => { zSpeed = zSlider.value / 100; });

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);
scene.fog = new THREE.FogExp2(0x000000, 0.025);

const camera = new THREE.PerspectiveCamera(
	50,
	window.innerWidth / window.innerHeight,
	0.05,
	1000
);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#bg") });
renderer.outputEncoding = THREE.sRGBEncoding;

// Audio Initialization
cover.addEventListener("click", async () => {
	const listener = new THREE.AudioListener();
	await camera.add(listener);
	sound = new THREE.PositionalAudio(listener);

	// Configure directional cone for spatial awareness without volume drop
	sound.setDirectionalCone(170, 190, 0.95);
	const audioHelper = new PositionalAudioHelper(sound);
	sound.add(audioHelper);

	const audioLoader = new THREE.AudioLoader();
	audioLoader.load("/swag.mp3", (buffer) => {
		sound.setBuffer(buffer);
		audioContext = sound.context;

		biquadFilter = audioContext.createBiquadFilter();
		biquadFilter.type = "lowpass";
		biquadFilter.frequency.setValueAtTime(MAX_FREQ, audioContext.currentTime);
		sound.setFilter(biquadFilter);

		sound.setRefDistance(5);
		sound.setDistanceModel('exponential');
		sound.setLoop(true);
		sound.setVolume(1);
		sound.play();

		document.addEventListener('click', async () => {
			await audioContext.resume();
		}, { once: true });
	});

	cover.style.display = "none";
});

// Model Loading
let model;
const loader = new GLTFLoader();
loader.load("sample.glb", (gltf) => {
	model = gltf.scene;
	model.scale.set(1, 1, 1);
	if (sound) model.add(sound);
	scene.add(model);
}, undefined, (error) => console.error(error));

// Lighting
const pointLight = new THREE.DirectionalLight(0xAAAAAA);
pointLight.position.set(0, 0, 1).normalize();
scene.add(pointLight);

// Renderer Configuration
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Animation Loop
function animate() {
	requestAnimationFrame(animate);

	if (model) {
		model.rotation.x += xSpeed;
		model.rotation.y += ySpeed;
		model.rotation.z += zSpeed;

		if (sound && biquadFilter) {
			// Calculate orientation using front vector
			const frontVector = new THREE.Vector3(0, 0, 1);
			model.localToWorld(frontVector);
			const cameraVector = camera.getWorldDirection(new THREE.Vector3());
			const angle = frontVector.angleTo(cameraVector);

			// Map angle to filter with wide muffling zone
			const FILTER_START = Math.PI * 0.4;  // 72° - Start muffling early
			const FILTER_END = Math.PI * 0.9;    // 162° - Full muffling
			const t = THREE.MathUtils.smoothstep(angle, FILTER_START, FILTER_END);

			// Invert mapping: full freq when facing camera, muffled when facing away
			const freq = THREE.MathUtils.lerp(MIN_FREQ, MAX_FREQ, t);

			biquadFilter.frequency.setValueAtTime(
				THREE.MathUtils.clamp(freq, MIN_FREQ, MAX_FREQ),
				audioContext.currentTime
			);
		}
	}

	controls.update();
	renderer.render(scene, camera);
}

animate();

// Reset Preset Handlers
hBtn.addEventListener("click", () => {
	ySpeed = 0.01;
	ySlider.value = 1;
	model.rotation.x = 0;
	xSpeed = 0;
	xSlider.value = 0;
	model.rotation.z = 0;
	zSpeed = 0;
	zSlider.value = 0;
	controls.reset();
	camera.position.set(0, 0, 5);
	camera.lookAt(0, 0, 0);
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
	controls.reset();
	camera.position.set(0, 0, 5);
	camera.lookAt(0, 0, 0);
});

window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
});