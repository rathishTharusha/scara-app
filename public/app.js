const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.getElementById('login-btn').onclick = async () => {
const provider = new firebase.auth.GoogleAuthProvider();
const res = await auth.signInWithPopup(provider);
document.getElementById('form').style.display = 'block';
};

document.getElementById('submit').onclick = async () => {
const shape = document.getElementById('shape').value;
const color = document.getElementById('color').value;
await db.collection('commands').add({ shape, color, timestamp: new Date() });
alert(Command sent: ${color} ${shape});
};

const getColorHex = (colorName) => {
const colors = {
red: 0xff0000,
green: 0x00ff00,
blue: 0x0000ff
};
return colors[colorName] || 0xffffff;
};

// Three.js setup
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("preview") });
renderer.setSize(300, 300);
camera.position.z = 3;

let mesh = null;

const createMesh = (shape, color) => {
if (mesh) scene.remove(mesh);

let geometry;
switch (shape) {
case 'cube':
geometry = new THREE.BoxGeometry();
break;
case 'sphere':
geometry = new THREE.SphereGeometry(0.7, 32, 32);
break;
case 'cylinder':
geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
break;
default:
geometry = new THREE.BoxGeometry();
}

const material = new THREE.MeshStandardMaterial({ color: getColorHex(color) });
mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
};

const updatePreview = () => {
const shape = document.getElementById('shape').value;
const color = document.getElementById('color').value;
createMesh(shape, color);
};

// Listen to dropdown changes
document.getElementById('shape').addEventListener('change', updatePreview);
document.getElementById('color').addEventListener('change', updatePreview);

// Lighting
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// Initialize
updatePreview();

// Animation loop
function animate() {
requestAnimationFrame(animate);
if (mesh) {
mesh.rotation.x += 0.01;
mesh.rotation.y += 0.01;
}
renderer.render(scene, camera);
}
animate();
