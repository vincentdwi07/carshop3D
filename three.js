import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls';

const container = document.getElementById('three');
let mouseX = container.clientWidth / 2;
let mouseY = container.clientHeight / 2;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, container.clientWidth / container.clientHeight, 0.1, 1000);
let object;
let controls;

const loader = new GLTFLoader();

loader.load(
    './car2.glb',
    function (gltf) {
        object = gltf.scene;
        object.position.y = -7;
        scene.add(object);

        const boundingBox = new THREE.Box3().setFromObject(object);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        const distance = maxDim / Math.tan(camera.fov * Math.PI / 360);
        camera.position.copy(center);
        camera.position.z = center.z + distance;

        camera.lookAt(center);

        if (controls) {
            controls.dispose();
        }

        controls = new OrbitControls(camera, renderer.domElement);

        controls.target.copy(center);

        controls.update();

        animate();
    },

    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log(error);
    }
);

const renderer = new THREE.WebGLRenderer({ alpha: true });

const containerWidth = container.clientWidth;
const containerHeight = container.clientHeight;

document.getElementById("three").appendChild(renderer.domElement);
renderer.setSize(containerWidth, containerHeight);

const topLight = new THREE.DirectionalLight(0xffffff, 2); // Increase intensity
topLight.position.set(0, 200, 0);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

ambientLight.color.setHex(0xffffff);

function animate() {
    requestAnimationFrame(animate);

    if (object) {
        object.rotation.y += 0;
    }
    renderer.render(scene, camera);
}

window.addEventListener('resize', function () {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
