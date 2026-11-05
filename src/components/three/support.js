// src/components/three/support.js – WebGL feature check, kept free of Three.js imports
// so the main bundle does not pull Three.js in (the 3D scenes load lazily).
export function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}
