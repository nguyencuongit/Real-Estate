(function (root) {
  "use strict";
  const clamp = (value) => Math.max(0, Math.min(1, value));
  const smooth = (value) => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };
  const range = (value, start, end) => smooth((value - start) / (end - start));
  function damp(current, target, rate, deltaSeconds) {
    return (
      current +
      (target - current) * (1 - Math.exp(-rate * Math.max(0, deltaSeconds)))
    );
  }
  function sceneProgress(scroll, start, distance) {
    return distance > 0 ? clamp((scroll - start) / distance) : 0;
  }
  function storyWeights(progress) {
    const a = range(progress, 0.26, 0.4),
      b = range(progress, 0.6, 0.74);
    return [1 - a, a - b, b];
  }
  function cinematicState(progress) {
    return {
      heading: 1 - range(progress, 0.06, 0.34),
      interior: range(progress, 0.32, 0.65),
      interiorHeading: range(progress, 0.5, 0.78),
      zoom: 1 + range(progress, 0, 0.58) * 0.2,
    };
  }
  function mixVector(a, b, t) {
    return a.map((value, index) => value + (b[index] - value) * t);
  }
  function vehiclePose(kind, progress, mobile = false) {
    const p = clamp(progress);
    if (kind === "hero") {
      const keys = [
        [0, [4.5, 2.1, 6.4], [0, 1.02, 0]],
        [0.2, [0, 1.55, 6.8], [0, 0.7, 0]],
        [0.53, [0, 1.06, 1.6], [0, 0.77, -0.5]],
        [0.78, [0.18, 0.88, 0.65], [-0.1, 0.62, -0.65]],
        [1, [0.28, 0.86, 0.54], [-0.3, 0.56, -0.6]],
      ];
      const index = Math.min(keys.length - 2, keys.findIndex((key, i) => i < keys.length - 1 && p <= keys[i + 1][0]));
      const a = keys[Math.max(0, index)], b = keys[Math.max(0, index) + 1];
      const t = range(p, a[0], b[0]);
      const camera = mixVector(a[1], b[1], t);
      if (mobile) camera[2] += (1 - range(p, 0, 0.5)) * 5;
      return { camera, target: mixVector(a[2], b[2], t), explode: 0, rotation: 0, fov: 35 + range(p, 0.35, 0.8) * 24 };
    }
    if (kind === "explode") {
      const expansion = range(p, 0.16, 0.48) * (1 - range(p, 0.72, 0.94));
      const orbit = range(p, 0.06, 0.86);
      return {
        camera: [Math.sin(orbit * 1.5) * 7, 8.8 - orbit * 3, (mobile ? 22 : 7) + expansion * 6],
        target: [0, 0.75 + expansion * 0.35, 0],
        explode: expansion, rotation: -0.12 + orbit * 0.5, fov: 38,
      };
    }
    return { camera: [0, 1.35, mobile ? -17 : -8.8], target: [0, mobile ? 2.1 : 1.7, 0], explode: 0, rotation: 0, fov: 35 };
  }
  function chapterMotion(progress) {
    const p = clamp(progress);
    const reveals = [1, range(p, 0.26, 0.4), range(p, 0.61, 0.75)];
    return reveals.map((reveal, index) => ({
      reveal,
      text: index === 0 ? 1 - range(p, 0.27, 0.32) : range(p, index === 1 ? 0.32 : 0.67, index === 1 ? 0.39 : 0.74) * (index === 1 ? 1 - range(p, 0.62, 0.67) : 1),
      scale: 1.13 - 0.13 * range(p, index === 0 ? 0 : index === 1 ? 0.26 : 0.61, index === 0 ? 0.3 : index === 1 ? 0.65 : 1),
    }));
  }
  const orbitZoom = value => Math.max(.65, Math.min(1.65, value));
  function rotateOrbit(state, dx, dy, width) {
    const turn = Math.PI * 2;
    const yaw = state.yaw - dx / Math.max(1, width) * turn;
    return {...state, yaw: ((yaw % turn) + turn) % turn, pitch: Math.max(.08, Math.min(1.05, state.pitch + dy * .006))};
  }
  function orbitPose(state, aspect) {
    const distance = 6.2 * orbitZoom(state.zoom) / Math.min(1, Math.max(.4, aspect / 1.5));
    return {
      camera: [Math.sin(state.yaw) * Math.cos(state.pitch) * distance, .7 + Math.sin(state.pitch) * distance, Math.cos(state.yaw) * Math.cos(state.pitch) * distance],
      target: [0, .7, 0], rotation: 0, explode: 0, fov: 35,
    };
  }
  const api = {
    clamp,
    smooth,
    range,
    damp,
    sceneProgress,
    storyWeights,
    cinematicState,
    vehiclePose,
    chapterMotion,
    orbitPose,
    rotateOrbit,
    orbitZoom,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.VantaMotion = api;
})(typeof window !== "undefined" ? window : this);
