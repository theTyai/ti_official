// src/components/three/HeroLogo3D.jsx
// The Think India mark rebuilt in 3D: a glowing sun with rotating rays, an extruded
// tricolour map of India, the Ashoka chakra over MANIT Bhopal with pulse rings,
// sparkling map outline particles that fly in on load, and tilted tricolour orbits.
// It lives in the fixed page background. On the home page it sits on the hero's
// ".hero-stage" slot (beside the copy on desktop, above it on phones); as you scroll it
// glides to the centre, grows and turns once, becoming the backdrop for the whole site
// (the CSS veil fades in from the --map-p variable it publishes).
// Pauses when the tab is hidden; renders still frames for reduced motion.
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BHOPAL } from '../../data/indiaPath';
import {
  COLORS, indiaPoints, prefersReducedMotion, isSmallScreen, dotTexture, glowTexture, chakraLines, disposeTree,
} from './shared';

const MAP_H = 4.5; // map height in world units

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t) => { const c1 = 1.4; const c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const clamp01 = (t) => Math.min(1, Math.max(0, t));

function tricolourTexture() {
  const c = document.createElement('canvas');
  c.width = 8; c.height = 512;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, 512);
  grd.addColorStop(0, '#FF8A1F');
  grd.addColorStop(0.3, '#FFA247');
  grd.addColorStop(0.36, '#FFFFFF');
  grd.addColorStop(0.62, '#FFFFFF');
  grd.addColorStop(0.68, '#1E9A2C');
  grd.addColorStop(1, '#0F6E09');
  g.fillStyle = grd;
  g.fillRect(0, 0, 8, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function HeroLogo3D({ className, isHome = true }) {
  const mountRef = useRef(null);
  const homeRef = useRef(isHome);
  useEffect(() => { homeRef.current = isHome; }, [isHome]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const reduced = prefersReducedMotion();
    const small = isSmallScreen();

    // ── Renderer / scene / camera ───────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-hidden', 'true');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 16.5);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xffe2c4, 1.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 5, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffb36b, 0.9);
    rim.position.set(-6, -2, 3);
    scene.add(rim);

    const root = new THREE.Group();
    scene.add(root);

    // ── Map geometry ───────────────────────────────────────────────────────
    const raw = indiaPoints();
    const xs = raw.map((p) => p[0]); const ys = raw.map((p) => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const k = MAP_H / (maxY - minY);
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    const toWorld = (x, y) => [(x - cx) * k, -(y - cy) * k];
    const pts2 = raw.map(([x, y]) => new THREE.Vector2(...toWorld(x, y)));

    const shape = new THREE.Shape(pts2);
    const depth = 0.34;
    const mapGeo = new THREE.ExtrudeGeometry(shape, {
      depth, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.035, bevelSegments: 2, curveSegments: 1,
    });
    mapGeo.translate(0, 0, -depth / 2);

    const capTex = tricolourTexture();
    const w = (maxX - minX) * k, h = MAP_H;
    capTex.repeat.set(1 / w, 1 / h);
    capTex.offset.set(w / 2 / w, h / 2 / h);
    const capMat = new THREE.MeshStandardMaterial({ map: capTex, roughness: 0.42, metalness: 0.05 });
    const sideMat = new THREE.MeshStandardMaterial({ color: COLORS.navy, roughness: 0.5, metalness: 0.2 });
    const map = new THREE.Mesh(mapGeo, [capMat, sideMat]);

    const mapGroup = new THREE.Group();
    mapGroup.add(map);
    mapGroup.position.y = -0.25;
    root.add(mapGroup);

    const frontZ = depth / 2 + 0.07;

    // Navy outline on the front face
    const outlineGeo = new THREE.BufferGeometry().setFromPoints(pts2.map((v) => new THREE.Vector3(v.x, v.y, frontZ)));
    const outline = new THREE.LineLoop(outlineGeo, new THREE.LineBasicMaterial({ color: COLORS.navy, transparent: true, opacity: 0.55 }));
    mapGroup.add(outline);

    // Chakra + pulse rings over MANIT Bhopal
    const [bx, by] = toWorld(BHOPAL.x, BHOPAL.y);
    const chakra = chakraLines(0.3, COLORS.navy);
    chakra.position.set(bx, by, frontZ + 0.01);
    mapGroup.add(chakra);
    const pulses = [0, 1, 2].map((i) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.31, 0.345, 64),
        new THREE.MeshBasicMaterial({ color: COLORS.saffronDeep, transparent: true, opacity: 0, depthWrite: false }),
      );
      ring.position.set(bx, by, frontZ + 0.005);
      ring.userData.offset = i / 3;
      mapGroup.add(ring);
      return ring;
    });

    // ── Fly-in outline particles ───────────────────────────────────────────
    const N = small ? 520 : 900;
    // Sample evenly along the outline
    const segLens = []; let total = 0;
    for (let i = 0; i < pts2.length; i++) {
      const a = pts2[i], b = pts2[(i + 1) % pts2.length];
      const l = a.distanceTo(b); segLens.push(l); total += l;
    }
    const target = new Float32Array(N * 3);
    const start = new Float32Array(N * 3);
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const tmpC = new THREE.Color();
    let seg = 0, acc = 0;
    for (let i = 0; i < N; i++) {
      const d = (i / N) * total;
      while (acc + segLens[seg] < d && seg < segLens.length - 1) { acc += segLens[seg]; seg++; }
      const a = pts2[seg], b = pts2[(seg + 1) % pts2.length];
      const t = (d - acc) / (segLens[seg] || 1);
      const x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t;
      target.set([x, y, frontZ + 0.02], i * 3);
      const r = 6 + Math.random() * 4, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      start.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph)], i * 3);
      const ny = (y + h / 2) / h;
      tmpC.copy(ny > 0.64 ? COLORS.saffronDeep : ny > 0.36 ? COLORS.navy : COLORS.green);
      col.set([tmpC.r, tmpC.g, tmpC.b], i * 3);
    }
    pos.set(reduced ? target : start);
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const dot = dotTexture();
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
      size: small ? 0.075 : 0.065, map: dot, vertexColors: true, transparent: true, depthWrite: false, alphaTest: 0.05,
    }));
    mapGroup.add(dust);

    // ── Sun disc + rays (behind the map) ───────────────────────────────────
    const sunGroup = new THREE.Group();
    sunGroup.position.set(0, 0.35, -1.1);
    root.add(sunGroup);

    const sunTex = glowTexture('rgba(255,140,30,1)', 'rgba(255,170,60,0)');
    const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTex, transparent: true, depthWrite: false, opacity: 0.95 }));
    sun.scale.set(6.4, 6.4, 1);
    sunGroup.add(sun);

    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('rgba(255,200,90,0.55)', 'rgba(255,255,255,0)'), transparent: true, depthWrite: false }));
    halo.scale.set(8.6, 8.6, 1);
    halo.position.z = -0.2;
    sunGroup.add(halo);

    const RAYS = 40;
    const rayPos = []; const rayCol = [];
    const cIn = new THREE.Color('#F26B0F'), cOut = new THREE.Color('#FFC233');
    for (let i = 0; i < RAYS; i++) {
      const a = (i / RAYS) * Math.PI * 2;
      const r0 = 2.75, len = i % 2 ? 0.65 : 1.15, r1 = r0 + len, wdt = (Math.PI * 2 / RAYS) * 0.26;
      const p0 = [Math.cos(a - wdt) * r0, Math.sin(a - wdt) * r0, 0];
      const p1 = [Math.cos(a + wdt) * r0, Math.sin(a + wdt) * r0, 0];
      const p2 = [Math.cos(a + 0.03) * r1, Math.sin(a + 0.03) * r1, 0]; // slight curl, like the logo
      rayPos.push(...p0, ...p1, ...p2);
      rayCol.push(cIn.r, cIn.g, cIn.b, cIn.r, cIn.g, cIn.b, cOut.r, cOut.g, cOut.b);
    }
    const rayGeo = new THREE.BufferGeometry();
    rayGeo.setAttribute('position', new THREE.Float32BufferAttribute(rayPos, 3));
    rayGeo.setAttribute('color', new THREE.Float32BufferAttribute(rayCol, 3));
    const rays = new THREE.Mesh(rayGeo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, transparent: true, opacity: 0.95 }));
    sunGroup.add(rays);

    // Thin chakra-like ring around the rays
    const ring = chakraLines(4.15, COLORS.navy, 0.18);
    ring.position.z = -0.05;
    sunGroup.add(ring);

    // ── Tilted tricolour orbits ────────────────────────────────────────────
    const orbits = new THREE.Group();
    root.add(orbits);
    const makeOrbit = (radius, count, colors, tiltX, tiltY, size) => {
      const p = new Float32Array(count * 3); const c = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        p.set([Math.cos(a) * radius, Math.sin(a) * radius, 0], i * 3);
        const cc = colors[Math.floor((i / count) * colors.length) % colors.length];
        c.set([cc.r, cc.g, cc.b], i * 3);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      g.setAttribute('color', new THREE.BufferAttribute(c, 3));
      const pts = new THREE.Points(g, new THREE.PointsMaterial({ size, map: dot, vertexColors: true, transparent: true, depthWrite: false, alphaTest: 0.05 }));
      const holder = new THREE.Group();
      holder.rotation.set(tiltX, tiltY, 0);
      holder.add(pts);
      orbits.add(holder);
      return pts;
    };
    const orbitA = makeOrbit(4.7, small ? 120 : 180, [COLORS.saffronDeep, COLORS.navy, COLORS.green], 1.18, 0.25, 0.09);
    const orbitB = makeOrbit(4.35, small ? 90 : 140, [COLORS.green, COLORS.saffron], -1.05, -0.4, 0.07);

    // Satellite beads riding the orbits
    const bead = (color, s) => new THREE.Mesh(new THREE.SphereGeometry(s, 20, 20), new THREE.MeshStandardMaterial({ color, roughness: 0.3, emissive: color, emissiveIntensity: 0.25 }));
    const beadA = bead(COLORS.saffronDeep, 0.13); orbitA.parent.add(beadA);
    const beadB = bead(COLORS.green, 0.11); orbitB.parent.add(beadB);

    // ── Layout: where the emblem sits on the hero vs. as the page backdrop ──
    const R = 4.3;
    const view = { halfH: R / 0.7, halfW: R / 0.7, w: 1, h: 1 };
    const layout = { hx: 0, hy: 0, hs: 1, bs: 1, hasStage: false };
    const measure = () => {
      const stage = homeRef.current ? document.querySelector('.hero-stage') : null;
      if (!stage) { layout.hasStage = false; return; }
      const r = stage.getBoundingClientRect();
      if (!r.width || !r.height) { layout.hasStage = false; return; }
      const wpp = (view.halfH * 2) / view.h; // world units per CSS pixel
      const cx = r.left + r.width / 2;
      const cy = r.top + window.scrollY + r.height / 2; // position when scrolled to the top
      layout.hx = (cx - view.w / 2) * wpp;
      layout.hy = -(cy - view.h / 2) * wpp;
      layout.hs = Math.min(1.1, ((Math.min(r.width, r.height) / 2) * wpp) / R);
      layout.hasStage = true;
    };
    let prog = homeRef.current ? 0 : 1;
    let lastP = -1;
    const targetProg = () => {
      if (!homeRef.current || !layout.hasStage) return 1;
      return clamp01(window.scrollY / (window.innerHeight * 0.8));
    };
    const applyPose = (e) => {
      const hx = layout.hasStage ? layout.hx : 0;
      const hy = layout.hasStage ? layout.hy : 0;
      const hs = layout.hasStage ? layout.hs : layout.bs;
      root.position.x = lerp(hx, 0, e);
      root.position.y = lerp(hy, 0, e);
      root.scale.setScalar(lerp(hs, layout.bs, e));
      if (Math.abs(prog - lastP) > 0.002) {
        lastP = prog;
        document.documentElement.style.setProperty('--map-p', prog.toFixed(3));
      }
    };
    const renderStill = () => {
      measure();
      prog = targetProg();
      applyPose(easeInOut(prog));
      renderer.render(scene, camera);
    };

    // ── Sizing ─────────────────────────────────────────────────────────────
    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      const aspect = width / height;
      camera.aspect = aspect;
      // Fixed camera: the emblem (radius R) fills ~70% of the height at scale 1.
      const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      view.halfH = R / 0.7;
      view.halfW = view.halfH * aspect;
      view.w = width; view.h = height;
      camera.position.z = view.halfH / tanH;
      camera.updateProjectionMatrix();
      // Background pose: centred, as wide as the screen allows
      layout.bs = Math.min(1.08, Math.max(0.78, (view.halfW * 1.05) / R));
      measure();
      if (reduced) renderStill();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    // ── Pointer tilt ───────────────────────────────────────────────────────
    const pointer = { x: 0, y: 0 };
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // ── Loop ───────────────────────────────────────────────────────────────
    let frameNo = 0;
    const onScrollStill = () => renderStill();

    const clock = new THREE.Clock();
    let raf = 0;
    const INTRO = 2.4;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) { clock.getDelta(); return; }
      const t = clock.getElapsedTime();

      // Scroll → pose. Re-measure the hero slot while it can still matter.
      frameNo++;
      if (homeRef.current ? (window.scrollY < window.innerHeight * 1.2 || frameNo % 30 === 0) : layout.hasStage) measure();
      prog += (targetProg() - prog) * 0.09;
      const e = easeInOut(clamp01(prog));
      applyPose(e);
      const calm = 1 - 0.65 * e; // less pointer play once it is the backdrop

      // Intro: map spins in, rays grow, particles converge onto the outline
      const pIn = clamp01(t / 1.6);
      const s = 0.55 + 0.45 * easeOutBack(pIn);
      mapGroup.scale.setScalar(s);
      const intro = (1 - easeOutCubic(pIn)) * -Math.PI * 1.2;

      const pDust = easeOutCubic(clamp01((t - 0.2) / INTRO));
      const arr = dustGeo.attributes.position.array;
      for (let i = 0; i < N; i++) {
        const j = i * 3;
        const wob = pDust >= 1 ? Math.sin(t * 2 + i * 0.7) * 0.012 : 0;
        arr[j] = start[j] + (target[j] - start[j]) * pDust;
        arr[j + 1] = start[j + 1] + (target[j + 1] - start[j + 1]) * pDust + wob;
        arr[j + 2] = start[j + 2] + (target[j + 2] - start[j + 2]) * pDust;
      }
      dustGeo.attributes.position.needsUpdate = true;

      const pRays = easeOutBack(clamp01((t - 0.4) / 1.3));
      rays.scale.setScalar(Math.max(0.001, pRays * (1 + Math.sin(t * 1.6) * 0.025)));
      rays.rotation.z = t * 0.12;
      ring.rotation.z = -t * 0.05;
      sun.material.opacity = 0.85 + Math.sin(t * 1.3) * 0.1;
      halo.scale.setScalar(8.6 + Math.sin(t * 0.9) * 0.4);

      chakra.rotation.z = -t * 0.8;
      pulses.forEach((r) => {
        const p = (t * 0.45 + r.userData.offset) % 1;
        r.scale.setScalar(1 + p * 1.8);
        r.material.opacity = (1 - p) * 0.7 * pIn;
      });

      orbitA.rotation.z = t * 0.18;
      orbitB.rotation.z = -t * 0.13;
      const aa = t * 0.5, ab = -t * 0.38 + 2;
      beadA.position.set(Math.cos(aa) * 4.7, Math.sin(aa) * 4.7, 0);
      beadB.position.set(Math.cos(ab) * 4.35, Math.sin(ab) * 4.35, 0);

      // Idle sway + pointer tilt (smoothed)
      // The map makes one full turn when it hands over from hero to backdrop (and back)
      const targetY = intro + (e > 0.5 ? Math.PI * 2 : 0) + Math.sin(t * 0.45) * 0.28 * calm + pointer.x * 0.35 * calm;
      const targetX = Math.sin(t * 0.33) * 0.08 + pointer.y * 0.22 * calm;
      mapGroup.rotation.y += (targetY - mapGroup.rotation.y) * (pIn < 1 ? 1 : 0.06);
      mapGroup.rotation.x += (targetX - mapGroup.rotation.x) * 0.06;
      mapGroup.position.y = -0.25 + Math.sin(t * 1.1) * 0.06;
      root.rotation.y += (pointer.x * 0.12 * calm - root.rotation.y) * 0.05;
      root.rotation.x += (pointer.y * 0.08 * calm - root.rotation.x) * 0.05;
      sunGroup.rotation.z = e * 0.6;

      renderer.render(scene, camera);
    };

    if (reduced) {
      rays.scale.setScalar(1);
      pulses.forEach((r) => { r.material.opacity = 0; });
      dustGeo.attributes.position.needsUpdate = true;
      window.addEventListener('scroll', onScrollStill, { passive: true });
      renderStill();
    } else {
      frame();
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScrollStill);
      document.documentElement.style.removeProperty('--map-p');
      disposeTree(scene);
      dot.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className={className} />;
}
