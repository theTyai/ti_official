// src/components/intro/GlobeScene.jsx
// The 3D part of the intro, one Three.js scene on one clock (`startAt`):
//   0.0–1.5 s  a dotted globe turns until India faces you, glowing saffron, and the camera pushes in;
//   1.3–2.6 s  the globe dissolves into a raised 3D India: a slab topped with the Amer Fort
//              photograph, a saffron outline drawing itself, tricolour edges and contour
//              layers floating up off the land, over a survey grid; the camera tilts to a 3/4 view;
//   2.1–3.1 s  arcs of light rise from Delhi, Mumbai, Kolkata and Chennai and land on Bhopal;
//   2.9–3.6 s  a pin drops onto MANIT, a chakra turns, ripples spread and a beam of light rises;
//   3.6 s →    the camera pulls back and slowly orbits while the brand is shown over it.
// Loaded lazily; the intro falls back to its 2D scene if this fails.
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LAND, INDIA_DOTS, INDIA_OUTLINE } from '../../data/globeData';
import { INDIA_PATH, BHOPAL } from '../../data/indiaPath';
import amerFort from '../../assets/heritage/amer-fort.jpg';

const DEG = Math.PI / 180;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const outExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const outBack = (t) => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const clamp01 = (t) => Math.min(1, Math.max(0, t));
const span = (t, a, b) => clamp01((t - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;

export const TIMING = { BRAND: 3.6, OUT: 5.7 };

// SVG map units → scene units (map ~1.9 wide, centred, y up)
const MX = 400, MY = 440, MS = 400;
const P = (x, y) => new THREE.Vector2((x - MX) / MS, -(y - MY) / MS);
const CITIES = [
  { name: 'DELHI', x: 262, y: 279 },
  { name: 'MUMBAI', x: 156, y: 541 },
  { name: 'KOLKATA', x: 537, y: 445 },
  { name: 'CHENNAI', x: 338, y: 706 },
];
const SLAB = 0.07;

function toXYZ(lon, lat, r = 1) {
  const la = lat * DEG, lo = lon * DEG;
  return [r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo)];
}

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.4, 'rgba(255,255,255,0.85)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function chakraTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.translate(128, 128);
  g.fillStyle = 'rgba(250,247,240,0.96)';
  g.beginPath(); g.arc(0, 0, 124, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#1B2A8C'; g.lineWidth = 10;
  g.beginPath(); g.arc(0, 0, 112, 0, Math.PI * 2); g.stroke();
  g.lineWidth = 4;
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * 108, Math.sin(a) * 108); g.stroke();
  }
  g.fillStyle = '#1B2A8C';
  g.beginPath(); g.arc(0, 0, 18, 0, Math.PI * 2); g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function textSprite(text, { size = 46, color = '#FFF1D6', sub = '', subColor = '#E99A36', height = 0.08 } = {}) {
  const c = document.createElement('canvas');
  const g = c.getContext('2d');
  const font = `500 ${size}px Oswald, "Arial Narrow", sans-serif`;
  const subFont = `600 ${Math.round(size * 0.62)}px Mukta, sans-serif`;
  g.font = font;
  const w = Math.ceil(Math.max(g.measureText(text).width, sub ? (g.font = subFont, g.measureText(sub).width) : 0)) + 24;
  c.width = w; c.height = sub ? Math.round(size * 2.1) : Math.round(size * 1.35);
  g.font = font; g.textBaseline = 'top';
  g.lineJoin = 'round'; g.lineWidth = 8; g.strokeStyle = 'rgba(23,15,10,0.9)';
  g.strokeText(text, 12, 4); g.fillStyle = color; g.fillText(text, 12, 4);
  if (sub) { g.font = subFont; g.lineWidth = 6; g.strokeText(sub, 12, size * 1.2); g.fillStyle = subColor; g.fillText(sub, 12, size * 1.2); }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false, opacity: 0 }));
  s.scale.set(height * (c.width / c.height), height, 1);
  s.center.set(0, 0.5);
  s.renderOrder = 10;
  return s;
}

function pointsFrom(flat, r, color, size, tex, opacity = 1, additive = false) {
  const n = flat.length / 2;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) pos.set(toXYZ(flat[i * 2], flat[i * 2 + 1], r), i * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({
    color, size, map: tex, transparent: true, opacity, depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, sizeAttenuation: true,
  }));
}

/** The India outline as scene-space points, sampled with the browser's own SVG engine
 *  (no extra Three.js loaders needed). */
function indiaOutline() {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
  svg.style.position = 'absolute'; svg.style.visibility = 'hidden';
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', INDIA_PATH);
  svg.appendChild(path);
  document.body.appendChild(svg);
  const len = path.getTotalLength();
  const n = 700;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const q = path.getPointAtLength((i / n) * len);
    pts.push(P(q.x, q.y));
  }
  svg.remove();
  return pts;
}

export default function GlobeScene({ startAt, onReady }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const small = window.matchMedia('(max-width: 700px)').matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x170f0a, 6, 14);
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 50);
    camera.position.set(0, 0, 3.6);
    const tex = dotTexture();
    const fades = []; // [material, baseOpacity, group] for cross-fading the two stages
    const reg = (m, group) => { m.transparent = true; fades.push([m, m.opacity, group]); return m; };

    /* ------------------------------ Stage 1: globe ------------------------------ */
    const tilt = new THREE.Group();
    const spin = new THREE.Group();
    tilt.add(spin);
    scene.add(tilt);
    spin.add(new THREE.Mesh(new THREE.SphereGeometry(0.995, 64, 48), reg(new THREE.MeshBasicMaterial({ color: 0x24170f }), 'g')));
    const atmoMat = new THREE.ShaderMaterial({
      transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { c: { value: new THREE.Color('#E99A36') }, k: { value: 1 } },
      vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 c; uniform float k; varying vec3 vN; void main(){ float i = pow(0.62 - dot(vN, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(c, clamp(i,0.0,1.0) * 0.9 * k); }',
    });
    tilt.add(new THREE.Mesh(new THREE.SphereGeometry(1.14, 64, 48), atmoMat));
    const grat = [];
    for (let lat = -60; lat <= 60; lat += 30) for (let lon = 0; lon < 360; lon += 4) grat.push(...toXYZ(lon, lat, 1.001), ...toXYZ(lon + 4, lat, 1.001));
    for (let lon = 0; lon < 360; lon += 30) for (let lat = -84; lat < 84; lat += 4) grat.push(...toXYZ(lon, lat, 1.001), ...toXYZ(lon, lat + 4, 1.001));
    const gratGeo = new THREE.BufferGeometry();
    gratGeo.setAttribute('position', new THREE.Float32BufferAttribute(grat, 3));
    spin.add(new THREE.LineSegments(gratGeo, reg(new THREE.LineBasicMaterial({ color: 0xD8C2A2, opacity: 0.08 }), 'g')));
    const land = pointsFrom(LAND, 1.004, 0xD8C2A2, small ? 0.022 : 0.018, tex, 0.55); reg(land.material, 'g'); spin.add(land);
    const indiaDots = pointsFrom(INDIA_DOTS, 1.006, 0xE99A36, 0.02, tex, 0.95); reg(indiaDots.material, 'g'); spin.add(indiaDots);
    const gOutline = pointsFrom(INDIA_OUTLINE, 1.01, 0xFF9933, 0.05, tex, 0.9, true); reg(gOutline.material, 'g'); spin.add(gOutline);
    const gl = [];
    for (let i = 0; i < INDIA_OUTLINE.length / 2; i++) gl.push(new THREE.Vector3(...toXYZ(INDIA_OUTLINE[i * 2], INDIA_OUTLINE[i * 2 + 1], 1.009)));
    spin.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(gl), reg(new THREE.LineBasicMaterial({ color: 0xFFB45C, opacity: 0.95 }), 'g')));

    /* --------------------------- Stage 2: 3D India map -------------------------- */
    const map = new THREE.Group();
    map.visible = false;
    scene.add(map);
    const outline = indiaOutline();
    const shape = new THREE.Shape(outline);

    scene.add(new THREE.AmbientLight(0xffe2c0, 0.55));
    const key = new THREE.DirectionalLight(0xffd29a, 2.2); key.position.set(-1.5, -2, 3); scene.add(key);
    const rim = new THREE.PointLight(0xff9933, 3, 4, 1.5); rim.position.set(0.8, 1.4, 0.6); scene.add(rim);

    // Survey grid under the land
    const grid = new THREE.GridHelper(8, 40, 0xD8C2A2, 0xD8C2A2);
    grid.rotation.x = Math.PI / 2; grid.position.z = -0.02;
    grid.material.transparent = true; grid.material.opacity = 0;
    map.add(grid);

    // The land: a slab topped with the Amer Fort photograph, bronze sides
    const photo = new THREE.TextureLoader().load(amerFort);
    photo.colorSpace = THREE.SRGBColorSpace;
    photo.wrapS = photo.wrapT = THREE.ClampToEdgeWrapping;
    photo.repeat.set(1 / 2.2, 1 / 2.6); photo.offset.set(0.5, 0.4); // crop to the fort, not the sky
    const slabGeo = new THREE.ExtrudeGeometry(shape, { depth: SLAB, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.006, bevelSegments: 2, curveSegments: 1 });
    const topMat = reg(new THREE.MeshStandardMaterial({ map: photo, color: 0xffd2a6, roughness: 0.85, emissive: 0x3a1c08, emissiveIntensity: 0.6 }), 'm');
    const sideMat = reg(new THREE.MeshStandardMaterial({ color: 0x6b3a1e, roughness: 0.5, metalness: 0.35, emissive: 0xA65338, emissiveIntensity: 0.35 }), 'm');
    const slab = new THREE.Mesh(slabGeo, [topMat, sideMat]);
    map.add(slab);

    const lineFrom = (pts, z, color, opacity, dx = 0, dy = 0, open = false) => {
      const list = open ? [...pts, pts[0]] : pts;
      const geo = new THREE.BufferGeometry().setFromPoints(list.map((p) => new THREE.Vector3(p.x + dx, p.y + dy, z)));
      const m = reg(new THREE.LineBasicMaterial({ color, opacity, blending: THREE.AdditiveBlending, depthWrite: false }), 'm');
      const l = open ? new THREE.Line(geo, m) : new THREE.LineLoop(geo, m);
      map.add(l);
      return l;
    };
    // Tricolour edges at the foot of the slab
    lineFrom(outline, 0.002, 0xFF9933, 0.9, -0.022, 0.016);
    lineFrom(outline, 0.002, 0x138808, 0.9, 0.022, -0.016);
    // Glowing outline on top, drawn progressively, with a sparkle of points along it
    const topLine = lineFrom(outline, SLAB + 0.01, 0xFFC46B, 1, 0, 0, true);
    const sparkPos = new Float32Array(outline.length * 3);
    outline.forEach((p, i) => sparkPos.set([p.x, p.y, SLAB + 0.011], i * 3));
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const spark = new THREE.Points(sparkGeo, reg(new THREE.PointsMaterial({ color: 0xFF9933, size: 0.035, map: tex, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }), 'm'));
    map.add(spark);

    // Contour layers that float up off the land (a relief you can see in 3D)
    const cen = outline.reduce((a, p) => a.add(p), new THREE.Vector2()).multiplyScalar(1 / outline.length);
    const contours = [0.84, 0.68, 0.52, 0.37, 0.23].map((s, i) => {
      const pts = outline.map((p) => new THREE.Vector2(cen.x + (p.x - cen.x) * s, cen.y + (p.y - cen.y) * s));
      const l = lineFrom(pts, SLAB + 0.012, i % 2 ? 0xD8C2A2 : 0xE99A36, 0.75 - i * 0.06);
      return l;
    });

    // Cities, arcs of light and their travelling heads
    const B = P(BHOPAL.x, BHOPAL.y);
    const top = SLAB + 0.012;
    const arcs = CITIES.map((c) => {
      const a = P(c.x, c.y);
      const dist = a.distanceTo(B);
      const mid = a.clone().add(B).multiplyScalar(0.5);
      const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(a.x, a.y, top), new THREE.Vector3(mid.x, mid.y, top + 0.25 + dist * 0.45), new THREE.Vector3(B.x, B.y, top));
      const geo = new THREE.TubeGeometry(curve, 80, 0.006, 6, false);
      const tube = new THREE.Mesh(geo, reg(new THREE.MeshBasicMaterial({ color: 0xFFC46B, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.95 }), 'm'));
      geo.setDrawRange(0, 0);
      map.add(tube);
      const head = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: 0xFFF1D6, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 }));
      head.scale.setScalar(0.09);
      map.add(head);
      const dot = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: 0xFFB45C, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 }));
      dot.position.set(a.x, a.y, top + 0.005); dot.scale.setScalar(0.07);
      map.add(dot);
      const label = textSprite(c.name, { size: 40, color: '#D8C2A2', height: small ? 0.07 : 0.05 });
      label.position.set(a.x + 0.035, a.y, top + 0.03);
      map.add(label);
      return { curve, geo, head, dot, label, total: geo.index.count };
    });

    // MANIT, Bhopal: pin, chakra, ripples, beam and label
    const pin = new THREE.Group();
    const pinMat = reg(new THREE.MeshStandardMaterial({ color: 0xA65338, roughness: 0.35, metalness: 0.2, emissive: 0x5a1f0c, emissiveIntensity: 0.5 }), 'm');
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.13, 24), pinMat);
    cone.rotation.x = -Math.PI / 2; cone.position.z = 0.065;
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.042, 24, 16), pinMat);
    ball.position.z = 0.14;
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.017, 16, 12), reg(new THREE.MeshBasicMaterial({ color: 0xFFF1D6 }), 'm'));
    eye.position.set(0, -0.03, 0.145);
    pin.add(cone, ball, eye);
    pin.position.set(B.x, B.y, 2);
    map.add(pin);
    const chakraTex = chakraTexture();
    const chakra = new THREE.Mesh(new THREE.CircleGeometry(0.075, 48), new THREE.MeshBasicMaterial({ map: chakraTex, transparent: true, opacity: 0, depthWrite: false }));
    chakra.position.set(B.x, B.y, top + 0.004);
    map.add(chakra);
    const ripples = [0, 1, 2].map(() => {
      const r = new THREE.Mesh(new THREE.RingGeometry(0.07, 0.078, 64), new THREE.MeshBasicMaterial({ color: 0xFFC46B, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      r.position.set(B.x, B.y, top + 0.003);
      map.add(r);
      return r;
    });
    const beamMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { k: { value: 0 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform float k; varying vec2 vUv; void main(){ float a = pow(1.0 - vUv.y, 2.2) * k * 0.6; gl_FragColor = vec4(1.0, 0.75, 0.4, a); }',
    });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.022, 1.2, 24, 1, true), beamMat);
    beam.rotation.x = Math.PI / 2; beam.position.set(B.x, B.y, top + 0.6);
    map.add(beam);
    const bLabel = textSprite('MANIT · BHOPAL', { size: 52, sub: '23.26° N · 77.41° E', height: small ? 0.17 : 0.12 });
    bLabel.position.set(B.x + 0.11, B.y - 0.02, 0.26);
    map.add(bLabel);

    // Warm dust in the air
    const dustN = small ? 140 : 260;
    const dust = new Float32Array(dustN * 3);
    for (let i = 0; i < dustN; i++) dust.set([(Math.random() - 0.5) * 7, (Math.random() - 0.5) * 7, Math.random() * 2.2 - 0.6], i * 3);
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3));
    const dustPts = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xE99A36, size: 0.022, map: tex, transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending }));
    scene.add(dustPts);

    const resize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    const tanH = Math.tan(17.5 * DEG);
    const lookTarget = new THREE.Vector3();
    const L = 80, PHI = 22, START_LON = -25;
    let raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      const t = Math.max(0, (performance.now() - startAt()) / 1000);
      const asp = Math.min(1, camera.aspect);

      // Globe: turn, push in, dissolve
      const turn = ease(span(t, 0, 1.2));
      spin.rotation.y = -(START_LON + (L - START_LON) * turn) * DEG;
      tilt.rotation.x = (8 + (PHI - 8) * turn) * DEG;
      const fitZ = Math.max(3.6, 1.15 / (tanH * asp));
      const gFade = 1 - span(t, 1.15, 1.6);
      const mFade = span(t, 1.25, 1.75);
      tilt.visible = gFade > 0.001;
      tilt.scale.setScalar(1 + span(t, 1.0, 1.6) * 0.6);
      atmoMat.uniforms.k.value = gFade;
      map.visible = mFade > 0.001;
      fades.forEach(([m, base, grp]) => { m.opacity = base * (grp === 'g' ? gFade : mFade); });

      // Camera: globe push-in, then a top-down map that tilts to a 3/4 view, leans to Bhopal,
      // and finally pulls back into a slow orbit behind the brand.
      const mapZ = Math.max(1.12 / tanH, 1.02 / (tanH * asp));
      const push = ease(span(t, 0.8, 1.5));
      const tiltK = ease(span(t, 1.45, 2.9));
      const focus = ease(span(t, 2.6, 3.6));
      const back = ease(span(t, TIMING.BRAND, TIMING.BRAND + 1.6));
      const orbit = (t - 1.45) * 0.07 * (t > 1.45 ? 1 : 0) + back * 0.25;
      if (t < 1.4) {
        camera.position.set(0, -0.04 * push, lerp(fitZ, fitZ * 0.55, push));
        camera.up.set(0, 1, 0);
        camera.lookAt(0, 0, 0);
      } else {
        const dist = mapZ * lerp(1.12, 1.16, tiltK) * lerp(1, 0.84, focus) * lerp(1, 1.2, back);
        const elev = lerp(89, small ? 58 : 50, tiltK) * DEG + back * 6 * DEG;
        const az = -Math.PI / 2 + orbit;
        lookTarget.set(lerp(0, B.x * 0.55, focus) * (1 - back * 0.6), lerp(0, B.y * 0.55, focus) * (1 - back * 0.6), 0);
        camera.position.set(
          lookTarget.x + Math.cos(az) * Math.cos(elev) * dist,
          lookTarget.y + Math.sin(az) * Math.cos(elev) * dist,
          Math.sin(elev) * dist,
        );
        camera.up.set(0, 1, 0);
        camera.lookAt(lookTarget);
      }

      // Map build
      map.position.z = lerp(-0.25, 0, outExpo(span(t, 1.25, 2.1)));
      const draw = span(t, 1.35, 2.3);
      topLine.geometry.setDrawRange(0, Math.floor((outline.length + 1) * ease(draw)));
      spark.geometry.setDrawRange(0, Math.floor(outline.length * ease(draw)));
      spark.material.size = 0.03 + Math.sin(t * 6) * 0.008;
      contours.forEach((c, i) => {
        const k = outExpo(span(t, 1.7 + i * 0.09, 2.6 + i * 0.09));
        c.position.z = k * (0.05 + i * 0.045);
        c.material.opacity = (0.75 - i * 0.06) * k * mFade * (1 - back * 0.4);
      });
      grid.material.opacity = 0.12 * mFade;

      // Arcs
      arcs.forEach((a, i) => {
        const at = 2.1 + i * 0.08;
        a.dot.material.opacity = span(t, at - 0.15, at) * mFade;
        a.label.material.opacity = span(t, at - 0.05, at + 0.25) * 0.9 * (1 - back);
        const p = ease(span(t, at, at + 0.85));
        a.geo.setDrawRange(0, Math.floor((a.total / 3) * p) * 3);
        a.head.position.copy(a.curve.getPoint(p));
        a.head.material.opacity = p > 0 && p < 1 ? 1 : 0;
      });

      // Bhopal
      const drop = span(t, 2.85, 3.35);
      pin.position.z = drop <= 0 ? 2 : lerp(1.2, top, outBack(drop));
      pin.visible = drop > 0;
      pin.rotation.z = t * 1.2;
      const land = span(t, 3.15, 3.5);
      chakra.material.opacity = land;
      chakra.rotation.z = -t * 1.4;
      chakra.scale.setScalar(0.4 + 0.6 * outBack(land));
      ripples.forEach((r, k) => {
        const ph = t - 3.2 - k * 0.45;
        const q = ph > 0 ? (ph % 1.35) / 1.35 : 0;
        r.scale.setScalar(1 + q * 5);
        r.material.opacity = ph > 0 ? (1 - q) * 0.8 : 0;
      });
      beamMat.uniforms.k.value = span(t, 3.2, 3.7) * (0.8 + Math.sin(t * 4) * 0.2);
      bLabel.material.opacity = span(t, 3.3, 3.6) * (1 - span(t, TIMING.BRAND, TIMING.BRAND + 0.4));
      rim.position.set(B.x + Math.cos(t * 0.8) * 0.6, B.y + Math.sin(t * 0.8) * 0.6, 0.5);

      dustPts.rotation.z = t * 0.03;
      renderer.render(scene, camera);
    };
    renderer.render(scene, camera);
    onReady?.();
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      scene.traverse((o) => {
        o.geometry?.dispose?.();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m.map?.dispose?.(); m.dispose(); });
      });
      tex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [startAt, onReady]);

  return <div ref={mountRef} className="intro-globe" aria-hidden="true" />;
}
