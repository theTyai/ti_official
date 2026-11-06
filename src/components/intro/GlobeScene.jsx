// src/components/intro/GlobeScene.jsx
// Scene 1 of the intro: a dotted-land globe in a warm dark room. It turns until India
// (drawn from the site's own outline, glowing saffron) faces the viewer, then the camera
// dives towards it. Driven by the intro's shared clock (`startAt`, ms since page load).
// Loaded lazily with Three.js; the intro carries on without it if it fails.
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LAND, INDIA_DOTS, INDIA_OUTLINE } from '../../data/globeData';

const DEG = Math.PI / 180;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t) => Math.min(1, Math.max(0, t));

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
  grd.addColorStop(0.45, 'rgba(255,255,255,0.9)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
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

export default function GlobeScene({ startAt, onReady }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const small = window.matchMedia('(max-width: 700px)').matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 50);
    camera.position.set(0, 0, 3.6);

    const tilt = new THREE.Group(); // brings India's latitude to the centre
    const spin = new THREE.Group(); // turns the globe
    tilt.add(spin);
    scene.add(tilt);

    const tex = dotTexture();

    // Body of the globe (occludes the far side) + soft atmosphere
    spin.add(new THREE.Mesh(new THREE.SphereGeometry(0.995, 64, 48), new THREE.MeshBasicMaterial({ color: 0x24170f })));
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.14, 64, 48),
      new THREE.ShaderMaterial({
        transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { c: { value: new THREE.Color('#E99A36') } },
        vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: 'uniform vec3 c; varying vec3 vN; void main(){ float i = pow(0.62 - dot(vN, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(c, clamp(i,0.0,1.0) * 0.9); }',
      }),
    );
    tilt.add(atmo);

    // Graticule
    const grat = [];
    for (let lat = -60; lat <= 60; lat += 30) for (let lon = 0; lon < 360; lon += 4) grat.push(...toXYZ(lon, lat, 1.001), ...toXYZ(lon + 4, lat, 1.001));
    for (let lon = 0; lon < 360; lon += 30) for (let lat = -84; lat < 84; lat += 4) grat.push(...toXYZ(lon, lat, 1.001), ...toXYZ(lon, lat + 4, 1.001));
    const gratGeo = new THREE.BufferGeometry();
    gratGeo.setAttribute('position', new THREE.Float32BufferAttribute(grat, 3));
    spin.add(new THREE.LineSegments(gratGeo, new THREE.LineBasicMaterial({ color: 0xD8C2A2, transparent: true, opacity: 0.08 })));

    // Land, India and India's glowing outline
    spin.add(pointsFrom(LAND, 1.004, 0xD8C2A2, small ? 0.022 : 0.018, tex, 0.55));
    spin.add(pointsFrom(INDIA_DOTS, 1.006, 0xE99A36, 0.02, tex, 0.95));
    const outline = pointsFrom(INDIA_OUTLINE, 1.01, 0xFF9933, 0.05, tex, 0.9, true);
    spin.add(outline);
    const glowLine = [];
    for (let i = 0; i < INDIA_OUTLINE.length / 2; i++) glowLine.push(new THREE.Vector3(...toXYZ(INDIA_OUTLINE[i * 2], INDIA_OUTLINE[i * 2 + 1], 1.009)));
    const lineGeo = new THREE.BufferGeometry().setFromPoints(glowLine);
    spin.add(new THREE.LineLoop(lineGeo, new THREE.LineBasicMaterial({ color: 0xFFB45C, transparent: true, opacity: 0.95 })));

    // Warm dust around the globe
    const dustN = small ? 120 : 220;
    const dust = new Float32Array(dustN * 3);
    for (let i = 0; i < dustN; i++) dust.set([(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, -Math.random() * 4 - 0.5], i * 3);
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3));
    scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xE99A36, size: 0.02, map: tex, transparent: true, opacity: 0.5, depthWrite: false })));

    const resize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    // India's centre: ~80°E, 22°N
    const L = 80, PHI = 22;
    const START_LON = -25;
    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      const t = (performance.now() - startAt()) / 1000;
      if (t < 0) { renderer.render(scene, camera); return; }
      const turn = ease(clamp01(t / 1.25));
      spin.rotation.y = -(START_LON + (L - START_LON) * turn) * DEG;
      tilt.rotation.x = (8 + (PHI - 8) * turn) * DEG;
      const dive = ease(clamp01((t - 0.85) / 0.8));
      // Far enough back that the whole globe fits the narrower side of the screen.
      const fitZ = Math.max(3.6, 1.15 / (Math.tan((17.5 * Math.PI) / 180) * Math.min(1, camera.aspect)));
      camera.position.z = fitZ + (fitZ * 0.6 - fitZ) * dive; // a gentle push-in; the map scene takes over
      camera.position.y = -0.04 * dive;
      outline.material.size = 0.05 + Math.sin(t * 5) * 0.012;
      renderer.render(scene, camera);
      if (t > 2.2) cancelAnimationFrame(raf); // done; the map scene has taken over
    };
    renderer.render(scene, camera);
    onReady?.();
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      scene.traverse((o) => {
        o.geometry?.dispose?.();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
      });
      tex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [startAt, onReady]);

  return <div ref={mountRef} className="intro-globe" aria-hidden="true" />;
}
