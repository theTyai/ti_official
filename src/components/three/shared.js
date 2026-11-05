// src/components/three/shared.js – small helpers shared by the Three.js scenes.
import * as THREE from 'three';
import { INDIA_PATH } from '../../data/indiaPath';

export const COLORS = {
  saffron: new THREE.Color('#FF9933'),
  saffronDeep: new THREE.Color('#F26B0F'),
  gold: new THREE.Color('#FFC233'),
  white: new THREE.Color('#FFFFFF'),
  green: new THREE.Color('#138808'),
  greenSoft: new THREE.Color('#2FA84F'),
  navy: new THREE.Color('#1B2A8C'),
};

/** India outline as [[x, y], …] in the original SVG coordinate space. */
export function indiaPoints() {
  const nums = INDIA_PATH.match(/-?\d+(\.\d+)?/g).map(Number);
  const pts = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
  return pts;
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isSmallScreen() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches;
}

export { webglAvailable } from './support';

/** Soft round sprite so points render as dots, not squares. */
export function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.45, 'rgba(255,255,255,0.9)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Radial-gradient sprite texture (used for the sun glow). */
export function glowTexture(inner, outer = 'rgba(255,153,51,0)') {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, inner);
  grd.addColorStop(0.55, inner.replace(/[\d.]+\)$/, '0.35)'));
  grd.addColorStop(1, outer);
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** An Ashoka-chakra style wheel (rim + 24 spokes) built from line segments. */
export function chakraLines(radius, color, opacity = 1) {
  const pos = [];
  const seg = 96;
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * Math.PI * 2;
    const a1 = ((i + 1) / seg) * Math.PI * 2;
    pos.push(Math.cos(a0) * radius, Math.sin(a0) * radius, 0, Math.cos(a1) * radius, Math.sin(a1) * radius, 0);
    const r2 = radius * 0.86;
    pos.push(Math.cos(a0) * r2, Math.sin(a0) * r2, 0, Math.cos(a1) * r2, Math.sin(a1) * r2, 0);
  }
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    pos.push(0, 0, 0, Math.cos(a) * radius * 0.86, Math.sin(a) * radius * 0.86, 0);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const mat = new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity });
  return new THREE.LineSegments(geo, mat);
}

/** Dispose every geometry / material / texture under an object. */
export function disposeTree(root) {
  root.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    mats.forEach((m) => {
      Object.values(m).forEach((v) => { if (v && v.isTexture) v.dispose(); });
      m.dispose();
    });
  });
}
