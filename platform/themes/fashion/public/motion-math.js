(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.FashionMotionMath = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const clamp = value => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
    return {
        clamp,
        entrance(top, viewport, end = 0) {
            return viewport > end ? clamp((viewport - top) / (viewport - end)) : 0;
        },
        smooth(value) {
            const progress = clamp(value);
            return progress * progress * (3 - 2 * progress);
        },
        travel(top, height, viewport, offset) {
            const distance = height - viewport;
            return distance > 0 ? clamp((offset - top) / distance) : 0;
        },
        seek(time, delta, duration) {
            if (!Number.isFinite(duration) || duration <= 0) return 0;
            return ((time + delta) % duration + duration) % duration;
        }
    };
});
