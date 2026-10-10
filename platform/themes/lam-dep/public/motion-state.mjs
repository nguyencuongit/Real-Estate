const clamp = value => Math.max(0, Math.min(1, value));

export function sceneProgress(top, height, viewport) {
    if (height <= viewport) return 0;
    return clamp(-top / (height - viewport));
}

export function artOffsets(progress, reduced = false) {
    if (reduced) return [0, 0, 0, 0, 0, 0];
    const phase = clamp(progress);
    return [-1250, -1250, -1250, -1250, -850, -850].map(distance => phase * distance);
}

export function welcomeFrame(progress, reduced = false) {
    if (reduced) return { width: 100, height: 100, card: 1 };
    const phase = clamp(progress);
    return { width: 20 + phase * 80, height: 40 + phase * 60, card: Math.round(clamp((phase - .8) / .2) * 1000) / 1000 };
}

export function galleryPose(position) {
    const distance = Math.max(-1, Math.min(1, position));
    return { y: distance * 92, angle: distance * 5, imageX: -distance * 9 || 0 };
}

// The image uses object-fit: cover with a centered crop. Source coordinates
// keep each point on the same feature even when the viewport changes shape.
export function coverPoint(width, height, sourceWidth, sourceHeight, x, y) {
    const scale = Math.max(width / sourceWidth, height / sourceHeight);
    const left = (width - sourceWidth * scale) / 2;
    const top = (height - sourceHeight * scale) / 2;
    const pointX = left + x * sourceWidth * scale;
    const pointY = top + y * sourceHeight * scale;
    return { x: pointX, y: pointY, visible: pointX >= 22 && pointX <= width - 22 && pointY >= 22 && pointY <= height - 22 };
}
