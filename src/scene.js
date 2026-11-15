// 3D background: glossy pastel tech objects (laptop, browser window, charts, cloud, robot...)
// that float, face the visitor, move away from the mouse, and slide sideways
// like a camera pan when the page changes scene.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import gsap from 'gsap';

const COLORS = {
  coral: '#ff7a5c',
  lilac: '#a48bff',
  mint: '#6fdca8',
  butter: '#ffc93c',
  sky: '#6db6ff',
  pink: '#ff9cc2',
  ink: '#2a2420',
  cream: '#fff6ea',
};

const materials = {};
function mat(color) {
  if (!materials[color]) {
    materials[color] = new THREE.MeshPhysicalMaterial({
      color: COLORS[color],
      roughness: 0.62,
      metalness: 0,
      clearcoat: 0.25,
      clearcoatRoughness: 0.6,
      sheen: 0.6,
      sheenRoughness: 0.5,
    });
  }
  return materials[color];
}

// Small helpers to place a piece inside an object
function add(group, geometry, color, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geometry, mat(color));
  m.position.set(x, y, z);
  group.add(m);
  return m;
}
const box = (w, h, d, r = 0.06) => new RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2, h / 2, d / 2));
const ball = (r) => new THREE.SphereGeometry(r, 32, 32);
const tube = (r, h) => new THREE.CylinderGeometry(r, r, h, 40);

// --- Objects --------------------------------------------------------------
function laptop() {
  const g = new THREE.Group();
  add(g, box(1.7, 0.1, 1.1, 0.05), 'cream', 0, -0.45, 0.1);
  add(g, box(1.3, 0.02, 0.5, 0.01), 'lilac', 0, -0.39, 0.02);
  const lid = new THREE.Group();
  lid.position.set(0, -0.42, -0.42);
  lid.rotation.x = -0.22;
  add(lid, box(1.7, 1.1, 0.08, 0.04), 'cream', 0, 0.55, 0);
  add(lid, box(1.5, 0.9, 0.02, 0.01), 'ink', 0, 0.56, 0.045);
  // A little chart on the screen
  [
    [0.3, 'coral'],
    [0.52, 'butter'],
    [0.4, 'mint'],
    [0.62, 'sky'],
  ].forEach(([h, c], i) => add(lid, box(0.18, h, 0.03, 0.01), c, -0.42 + i * 0.28, 0.22 + h / 2, 0.06));
  g.add(lid);
  return g;
}

function browser() {
  const g = new THREE.Group();
  add(g, box(1.8, 1.25, 0.14, 0.07), 'cream');
  add(g, box(1.8, 0.28, 0.16, 0.07), 'lilac', 0, 0.485, 0);
  ['coral', 'butter', 'mint'].forEach((c, i) => add(g, ball(0.055), c, -0.72 + i * 0.16, 0.485, 0.08));
  add(g, box(0.62, 0.62, 0.05, 0.02), 'sky', -0.45, -0.12, 0.08);
  [0.82, 0.82, 0.5].forEach((w, i) => add(g, box(w, 0.1, 0.05, 0.02), i === 2 ? 'coral' : 'pink', 0.36 - (0.82 - w) / 2, 0.12 - i * 0.22, 0.08));
  return g;
}

function barChart() {
  const g = new THREE.Group();
  [
    [0.7, 'coral'],
    [1.15, 'butter'],
    [0.95, 'mint'],
    [1.5, 'lilac'],
  ].forEach(([h, c], i) => add(g, box(0.36, h, 0.36, 0.1), c, (i - 1.5) * 0.46, h / 2 - 0.75, 0));
  add(g, box(2, 0.1, 0.5, 0.05), 'ink', 0, -0.8, 0);
  return g;
}

function pieChart() {
  const g = new THREE.Group();
  const big = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.3, 48, 1, false, 0, Math.PI * 1.5), mat('butter'));
  const slice = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.3, 24, 1, false, Math.PI * 1.5, Math.PI * 0.5), mat('coral'));
  slice.position.set(-0.11, 0, 0.11);
  const disc = new THREE.Group();
  disc.add(big, slice);
  disc.rotation.x = Math.PI / 2.4;
  g.add(disc);
  return g;
}

function cloud() {
  const g = new THREE.Group();
  [
    [-0.62, -0.05, 0, 0.42],
    [-0.1, 0.2, 0, 0.6],
    [0.55, 0.02, 0, 0.46],
    [-0.25, -0.2, 0.1, 0.4],
    [0.2, -0.22, 0.1, 0.42],
  ].forEach(([x, y, z, r]) => add(g, ball(r), 'cream', x, y, z));
  // An upload arrow in front of it
  add(g, box(0.14, 0.5, 0.1, 0.04), 'sky', 0, -0.1, 0.6);
  const head = add(g, new THREE.ConeGeometry(0.24, 0.3, 4), 'sky', 0, 0.26, 0.6);
  head.rotation.y = Math.PI / 4;
  head.scale.z = 0.4;
  return g;
}

function chat() {
  const g = new THREE.Group();
  add(g, box(1.6, 1.0, 0.34, 0.3), 'mint');
  const tail = add(g, new THREE.ConeGeometry(0.22, 0.42, 4), 'mint', -0.45, -0.58, 0);
  tail.rotation.z = Math.PI + 0.5;
  tail.scale.z = 0.6;
  [-0.36, 0, 0.36].forEach((x) => add(g, ball(0.1), 'ink', x, 0, 0.18));
  return g;
}

function gear() {
  const g = new THREE.Group();
  const wheel = new THREE.Group();
  add(wheel, tube(0.58, 0.28), 'lilac');
  add(wheel, tube(0.22, 0.3), 'ink');
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const tooth = add(wheel, box(0.26, 0.28, 0.3, 0.05), 'lilac', Math.cos(a) * 0.66, 0, Math.sin(a) * 0.66);
    tooth.rotation.y = -a;
  }
  wheel.rotation.x = Math.PI / 2;
  g.add(wheel);
  return g;
}

function robot() {
  const g = new THREE.Group();
  add(g, box(1.2, 0.95, 0.85, 0.24), 'sky');
  add(g, box(0.9, 0.5, 0.06, 0.03), 'cream', 0, 0.04, 0.42);
  [-0.22, 0.22].forEach((x) => add(g, ball(0.1), 'ink', x, 0.08, 0.45));
  add(g, box(0.3, 0.06, 0.05, 0.02), 'ink', 0, -0.12, 0.45);
  add(g, tube(0.035, 0.3), 'ink', 0, 0.62, 0);
  add(g, ball(0.11), 'coral', 0, 0.82, 0);
  [-0.66, 0.66].forEach((x) => {
    const ear = add(g, tube(0.14, 0.14), 'butter', x, 0, 0);
    ear.rotation.z = Math.PI / 2;
  });
  return g;
}

function database() {
  const g = new THREE.Group();
  ['lilac', 'cream', 'lilac'].forEach((c, i) => add(g, tube(0.72, 0.36), c, 0, (i - 1) * 0.46, 0));
  return g;
}

function codeTag() {
  const g = new THREE.Group();
  const bar = (x, y, rot, color, len = 0.62) => {
    const m = add(g, box(len, 0.17, 0.17, 0.08), color, x, y, 0);
    m.rotation.z = rot;
  };
  bar(-0.72, 0.19, 0.6, 'coral');
  bar(-0.72, -0.19, -0.6, 'coral');
  bar(0.72, 0.19, -0.6, 'coral');
  bar(0.72, -0.19, 0.6, 'coral');
  bar(0, 0, 1.25, 'ink', 1.05);
  return g;
}

function phone() {
  const g = new THREE.Group();
  add(g, box(0.82, 1.5, 0.12, 0.12), 'ink');
  add(g, box(0.7, 1.32, 0.03, 0.05), 'pink', 0, 0, 0.06);
  ['butter', 'mint', 'sky', 'coral'].forEach((c, i) => add(g, box(0.24, 0.24, 0.04, 0.06), c, i % 2 ? 0.16 : -0.16, i < 2 ? 0.3 : -0.02, 0.08));
  add(g, box(0.5, 0.12, 0.04, 0.05), 'cream', 0, -0.42, 0.08);
  return g;
}

function magnifier() {
  const g = new THREE.Group();
  add(g, new THREE.TorusGeometry(0.52, 0.11, 24, 64), 'butter', -0.15, 0.2, 0);
  const glass = add(g, tube(0.45, 0.05), 'sky', -0.15, 0.2, 0);
  glass.rotation.x = Math.PI / 2;
  const handle = add(g, tube(0.1, 0.75), 'ink', 0.52, -0.5, 0);
  handle.rotation.z = Math.PI / 4;
  return g;
}

// make, x and y (−1 … 1 is the visible screen; beyond that is off-screen), depth, size,
// and "true" for the small objects that step aside on busy screens
const LAYOUT = [
  // On screen behind the hero
  [laptop, 0.6, 0.3, 0, 1.25],
  [barChart, 0.24, -0.5, 0.8, 0.8],
  [robot, 0.9, -0.55, -1, 0.85],
  [chat, 0.2, 0.8, -2.5, 0.65, true],
  [codeTag, -0.78, 0.74, -1.5, 0.6, true],
  [cloud, -0.25, 0.42, -4, 0.6, true],
  // Waiting just off-screen: they slide in along the edges when the scene changes,
  // so they frame the text instead of sitting behind it
  [browser, 1.14, 0.8, -0.5, 0.85],
  [gear, 1.12, -0.82, -1.5, 0.8],
  [database, -1.48, 0.9, -0.5, 0.8],
  [magnifier, -1.1, 0.12, -1, 0.75],
  [pieChart, -1.14, -0.8, 0, 0.85],
  [phone, 1.5, 0.92, -3, 0.7],
];

const wrap = (v, half) => ((((v + half) % (half * 2)) + half * 2) % (half * 2)) - half;

export function createScene(canvas, { reducedMotion = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 10);
  const viewH = 2 * 10 * Math.tan(THREE.MathUtils.degToRad(35 / 2));

  scene.add(new THREE.HemisphereLight(0xffffff, 0xffd9d0, 1.2));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 6, 8);
  scene.add(key);

  const items = LAYOUT.map(([make, xn, yn, z, size, light], i) => {
    const object = make();
    scene.add(object);
    return {
      object,
      xn,
      yn,
      z,
      size,
      light: !!light,
      k: 0, // intro scale, 0 → 1
      phase: i * 1.7,
      baseY: (i % 2 ? -1 : 1) * 0.35, // each object is turned slightly to one side
      push: new THREE.Vector2(),
    };
  });

  let halfW = 1;
  let mobile = false;
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    halfW = (viewH * camera.aspect) / 2;
    mobile = w < 800;
  }
  resize();
  window.addEventListener('resize', resize);

  const pointer = new THREE.Vector2(99, 99);
  const tilt = new THREE.Vector2();
  const tiltTarget = new THREE.Vector2();
  window.addEventListener('pointermove', (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    pointer.set(nx * halfW, -ny * (viewH / 2));
    tiltTarget.set(nx, ny);
  });

  const pan = { x: 0, y: 0, lastX: 0, dim: 0 };
  const clock = new THREE.Clock();
  let swing = 0; // objects lean while the world slides sideways

  function frame() {
    const time = reducedMotion ? 0 : clock.getElapsedTime();
    const speed = pan.x - pan.lastX;
    pan.lastX = pan.x;
    swing += (THREE.MathUtils.clamp(speed * 30, -1.4, 1.4) - swing) * 0.1;
    tilt.lerp(tiltTarget, 0.05);
    const halfH = viewH / 2;

    for (const it of items) {
      const depth = 1 - it.z / 10; // far objects look smaller, so spread them a little wider
      const x = wrap(it.xn - pan.x * 2, 2) * halfW * 0.92 * depth;
      const y = wrap(it.yn + pan.y, 1.45) * halfH * 0.86 * depth + Math.sin(time * 0.8 + it.phase) * 0.14;

      // Move away from the mouse
      const dx = x + it.push.x - pointer.x;
      const dy = y + it.push.y - pointer.y;
      const dist = Math.hypot(dx, dy);
      const reach = 2.2;
      let tx = 0;
      let ty = 0;
      if (dist < reach && dist > 0.001 && !reducedMotion) {
        const f = ((reach - dist) / reach) * 1.1;
        tx = (dx / dist) * f;
        ty = (dy / dist) * f;
      }
      it.push.x += (tx - it.push.x) * 0.07;
      it.push.y += (ty - it.push.y) * 0.07;

      it.object.position.set(x + it.push.x - tilt.x * 0.25 * depth, y + it.push.y + tilt.y * 0.2 * depth, it.z);
      it.object.scale.setScalar(Math.max(it.size * it.k * (mobile ? 0.55 : 1) * (it.light ? 1 - pan.dim : 1), 0.0001));
      // Objects keep facing the visitor and only sway, so they stay easy to recognise
      it.object.rotation.set(
        0.12 + Math.sin(time * 0.5 + it.phase) * 0.14 + tilt.y * 0.2,
        it.baseY + Math.sin(time * 0.4 + it.phase * 1.3) * 0.3 + tilt.x * 0.35 - swing,
        Math.sin(time * 0.35 + it.phase * 0.7) * 0.07 - swing * 0.25
      );
    }

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return {
    // The objects pop in one after the other
    intro() {
      if (reducedMotion) {
        items.forEach((it) => (it.k = 1));
        return;
      }
      gsap.to(items, { k: 1, duration: 1.4, ease: 'elastic.out(1, 0.6)', stagger: 0.07 });
    },
    // The page drives this: x slides the whole world sideways (1 = one full screen), y shifts it up
    pan,
  };
}
