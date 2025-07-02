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
  alert(`Command sent: ${color} ${shape}`);
};

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("preview") });
renderer.setSize(300, 300);
camera.position.z = 3;
let geometry = new THREE.BoxGeometry();
let material = new THREE.MeshNormalMaterial();
let mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
