// ビューポートをランダムに設定
const viewports = [
  { width: 1920, height: 1080 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 864 },
];

export function getRandomViewport() {
  return viewports[Math.floor(Math.random() * viewports.length)];
}
