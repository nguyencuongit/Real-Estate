(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.GymMotion = api;
})(typeof window !== 'undefined' ? window : this, function () {
    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const progress = (top, height, viewport) => height <= viewport ? 0 : clamp(-top / (height - viewport));
    const panelOffset = (index, position, count) => clamp(index - clamp(position) * (count - 1)) * 100;
    const activePanel = (position, count) => Math.min(count - 1, Math.floor(clamp(position) * (count - 1) + 0.5));
    const wrap = (index, count) => ((index % count) + count) % count;
    return { clamp, progress, panelOffset, activePanel, wrap };
});
