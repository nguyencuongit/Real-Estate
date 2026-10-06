(function(root) {
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  const range = (value, a, b) => smooth((value - a) / (b - a));
  const progress = (position, start, distance) => distance > 0 ? clamp((position - start) / distance) : 0;
  const damp = (current, target, rate, seconds) => current + (target - current) * (1 - Math.exp(-rate * Math.max(0, seconds)));
  const chapter = value => Math.min(2, Math.floor(clamp(value) * 3));
  const motionModes = (width, height, paused, reduced) => {
    const enabled = !paused && !reduced;
    return {enabled, page:enabled && height >= 620, living:enabled && width >= 768 && height >= 560, horizontal:enabled && width >= 1024 && height >= 620};
  };
  const normalizePhone = value => value.replace(/[\s().-]/g, '').replace(/^\+84/, '0');
  const validPhone = value => /^0[35789]\d{8}$/.test(normalizePhone(value));
  const coverPoint = (width, height, imageWidth, imageHeight, x, y, alignX = .5) => {
    const scale = Math.max(width / imageWidth, height / imageHeight);
    return {
      x: (width - imageWidth * scale) * alignX + x * imageWidth * scale,
      y: (height - imageHeight * scale) * .56 + y * imageHeight * scale,
    };
  };
  const api = { clamp, smooth, range, progress, damp, chapter, motionModes, normalizePhone, validPhone, coverPoint };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ResidenceMotion = api;
})(typeof window !== 'undefined' ? window : this);
