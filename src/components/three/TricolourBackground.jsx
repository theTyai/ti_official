// src/components/three/TricolourBackground.jsx
// Permanent animated backdrop: a waving tricolour field of particles (saffron, chakra
// navy, green) seen in perspective, slow drifting chakra wheels and a light dust of
// sparkles. Lightweight: one draw call per layer, fewer points on phones, paused when
// the tab is hidden, still frame for reduced motion.
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { COLORS, prefersReducedMotion, isSmallScreen, dotTexture, chakraLines, disposeTree } from './shared';

export default function TricolourBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const reduced = prefersReducedMotion();
    const small = isSmallScreen();

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
    camera.position.set(0, 7, 26);
    camera.lookAt(0, 0, -10);

    const dot = dotTexture();

    // ── Waving tricolour field ─────────────────────────────────────────────
    const COLS = small ? 70 : 120;
    const ROWS = small ? 42 : 60;
    const SPACING = 1.05;
    const count = COLS * ROWS;
    const base = new Float32Array(count * 3);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const white = new THREE.Color('#9AA3DD'); // the white band, tinted so it reads on a light page
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        const x = (c - COLS / 2) * SPACING;
        const z = -r * SPACING * 1.15 + 8;
        base.set([x, 0, z], i * 3);
        // Bands across the depth: green (near) → white/navy (middle) → saffron (far)
        const t = r / (ROWS - 1);
        const cc = t < 0.33 ? COLORS.green : t < 0.66 ? (c % 9 === 0 ? COLORS.navy : white) : COLORS.saffron;
        col.set([cc.r, cc.g, cc.b], i * 3);
      }
    }
    pos.set(base);
    const fieldGeo = new THREE.BufferGeometry();
    fieldGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    fieldGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const field = new THREE.Points(fieldGeo, new THREE.PointsMaterial({
      size: small ? 0.3 : 0.26, map: dot, vertexColors: true, transparent: true, opacity: small ? 0.22 : 0.3, depthWrite: false, alphaTest: 0.02,
    }));
    field.position.y = -6;
    scene.add(field);

    // ── Drifting chakra wheels ─────────────────────────────────────────────
    const wheels = [
      { r: 7, x: 36, y: 17, z: -42, op: 0.16, sp: 0.05 },
      { r: 4.5, x: -44, y: 22, z: -44, op: 0.14, sp: -0.07 },
      { r: 3, x: 19, y: -2, z: -10, op: 0.12, sp: 0.1 },
    ].map((w) => {
      const m = chakraLines(w.r, COLORS.navy, w.op);
      m.position.set(w.x, w.y, w.z);
      m.userData = w;
      scene.add(m);
      return m;
    });

    // ── Sparkles (diya dust) ───────────────────────────────────────────────
    const SP = small ? 90 : 180;
    const spPos = new Float32Array(SP * 3);
    const spCol = new Float32Array(SP * 3);
    const spSeed = new Float32Array(SP);
    for (let i = 0; i < SP; i++) {
      spPos.set([(Math.random() - 0.5) * 70, Math.random() * 30 - 4, -Math.random() * 40], i * 3);
      const cc = [COLORS.saffron, COLORS.gold, COLORS.green][i % 3];
      spCol.set([cc.r, cc.g, cc.b], i * 3);
      spSeed[i] = Math.random() * 10;
    }
    const spGeo = new THREE.BufferGeometry();
    spGeo.setAttribute('position', new THREE.BufferAttribute(spPos, 3));
    spGeo.setAttribute('color', new THREE.BufferAttribute(spCol, 3));
    const sparkles = new THREE.Points(spGeo, new THREE.PointsMaterial({
      size: 0.45, map: dot, vertexColors: true, transparent: true, opacity: 0.75, depthWrite: false, alphaTest: 0.02,
    }));
    scene.add(sparkles);

    // ── Sizing / input ─────────────────────────────────────────────────────
    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (reduced) renderer.render(scene, camera);
    };
    window.addEventListener('resize', resize);
    resize();

    const pointer = { x: 0, y: 0 };
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const clock = new THREE.Clock();
    let raf = 0;
    let scrollY = window.scrollY;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    const update = (t) => {
      const arr = fieldGeo.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const j = i * 3;
        const x = base[j], z = base[j + 2];
        arr[j + 1] = Math.sin(x * 0.18 + t * 0.9) * 0.9 + Math.sin(z * 0.22 + t * 0.7) * 0.7 + Math.sin((x + z) * 0.08 + t * 0.4) * 0.6;
      }
      fieldGeo.attributes.position.needsUpdate = true;

      wheels.forEach((m) => {
        const w = m.userData;
        m.rotation.z = t * w.sp;
        m.rotation.y = Math.sin(t * 0.2 + w.r) * 0.4;
        m.position.y = w.y + Math.sin(t * 0.3 + w.x) * 0.8;
      });

      const sp = spGeo.attributes.position.array;
      for (let i = 0; i < SP; i++) {
        sp[i * 3 + 1] += 0.012;
        sp[i * 3] += Math.sin(t * 0.5 + spSeed[i]) * 0.004;
        if (sp[i * 3 + 1] > 26) sp[i * 3 + 1] = -4;
      }
      spGeo.attributes.position.needsUpdate = true;

      // Parallax: pointer + scroll gently move the camera
      const scrollT = Math.min(scrollY / 4000, 1);
      camera.position.x += (pointer.x * 2.2 - camera.position.x) * 0.03;
      camera.position.y += (7 - pointer.y * 1.2 + scrollT * 3 - camera.position.y) * 0.03;
      camera.lookAt(0, -scrollT * 2, -10);
      field.rotation.y = Math.sin(t * 0.05) * 0.08;
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      update(clock.getElapsedTime());
      renderer.render(scene, camera);
    };

    if (reduced) {
      update(0);
      renderer.render(scene, camera);
    } else {
      frame();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      disposeTree(scene);
      dot.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="bg-three" aria-hidden="true" />;
}
