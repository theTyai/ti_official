// src/components/ImageWithFallback.jsx
// Renders an <img> if the src resolves; otherwise shows a themed
// placeholder with the event name. Handles Vite dynamic-import paths.

import { useState, useEffect } from 'react';
import { getAssetUrl } from '../utils/assets';

export default function ImageWithFallback({ src, alt, title, style = {}, imgStyle = {}, className }) {
  const resolvedSrc = getAssetUrl(src) || src;
  const [failed, setFailed] = useState(!resolvedSrc);

  useEffect(() => {
    setFailed(!resolvedSrc);
  }, [resolvedSrc]);

  if (failed || !resolvedSrc) {
    return (
      <div className={`fallback ${className || ''}`} style={style} role="img" aria-label={alt || title}>
        <span>{title || alt || 'Image coming soon'}</span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      style={{ display: 'block', ...imgStyle }}
      className={className}
    />
  );
}
