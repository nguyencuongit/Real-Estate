const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const p = clamp(value); return p * p * (3 - 2 * p); };
export const scrollProgress = (top, height, viewport) => clamp(-top / Math.max(1, height - viewport));
export function sceneAt(progress, reduced = false) {
  if (reduced) return { yaw: -.35, pitch: .52, separation: 0, reveal: 1 };
  const p = clamp(progress), turn = smooth(p), perspective = smooth(p / .65);
  return {
    yaw: -.7 + turn * 2.6,
    pitch: 1.48 - perspective * .96,
    separation: p === 0 || p === 1 ? 0 : .7 * Math.sin(Math.PI * p) ** 2,
    reveal: smooth((p - .12) / .35),
  };
}
export function solutionStackLayout({width,height,header,contentHeight,reduced=false}) {
  const gap = Math.max(38,Math.min(44,height*.055));
  const cardHeight = Math.min(480,height-header-gap*3-20);
  return {gap,cardHeight,enabled:!reduced && width>=1024 && cardHeight>=contentHeight};
}
