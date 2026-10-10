/* Shared deterministic geometry for native scroll animations and boundary tests. */
(function (root) {
    const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
    const phase = (progress, start, end) => clamp((progress - start) / (end - start));
    const lerp = (a, b, t) => a + (b - a) * t;
    const smooth = (value) => value * value * (3 - 2 * value);
    const journeyState = (progress) => {
        const p = clamp(progress);
        const stack = smooth(phase(p, 0, .25));
        const portal = smooth(phase(p, .12, .68));
        return {
            stack,
            radius: lerp(0, 115, portal),
            center: lerp(145, 50, portal),
            titleOpacity: 1 - phase(p, .48, .65),
            metaOpacity: 1 - phase(p, 0, .1),
            invitationOpacity: phase(p, .64, .79),
            landscapeScale: 1 + p * .14,
        };
    };
    const giftState = (progress) => {
        const p = clamp(progress);
        return {frontAngle:lerp(-20, -6, p), backAngle:lerp(26, 11, p), rotateY:lerp(-28, 0, p), lift:lerp(85, 0, p), dome:lerp(45, 8, p)};
    };
    const ritualState = (progress, count = 3) => {
        const position = clamp(progress) * (count - 1);
        const index = Math.min(count - 1, Math.floor(position));
        return {index, mix:position - index};
    };
    const progressFor = (top, height, viewport) => height <= viewport ? 0 : clamp(-top / (height - viewport));
    const api = {clamp, phase, lerp, journeyState, giftState, ritualState, progressFor};
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.SpaMotion = api;
})(typeof window !== 'undefined' ? window : globalThis);
