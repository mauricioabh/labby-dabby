/**
 * Generates PNG/ICO assets from SVG sources.
 * Source of truth: packages/ui/assets/*.svg (monorepo).
 * Run: pnpm generate-assets
 */
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import toIco from 'to-ico';

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'packages', 'ui', 'assets');
const WEB_PUBLIC = path.join(ROOT, 'apps', 'web', 'public');
const MOBILE_ASSETS = path.join(ROOT, 'apps', 'mobile', 'assets');

async function ensureDir(dir: string) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function svgToPng(
  svgPath: string,
  outPath: string,
  width: number,
  height: number,
  label: string
) {
  const buf = await sharp(svgPath)
    .resize(width, height)
    .png()
    .toBuffer();
  await fs.promises.writeFile(outPath, buf);
  console.log(`  ✓ ${label} → ${outPath}`);
}

async function main() {
  console.log('Generate assets from SVG sources\n');

  const isotipoPath = path.join(SRC, 'logo-isotipo.svg');
  const ogPath = path.join(SRC, 'og-image.svg');

  if (!fs.existsSync(isotipoPath)) {
    console.error('Missing packages/ui/assets/logo-isotipo.svg');
    process.exit(1);
  }
  if (!fs.existsSync(ogPath)) {
    console.error('Missing packages/ui/assets/og-image.svg');
    process.exit(1);
  }

  await ensureDir(WEB_PUBLIC);
  await ensureDir(MOBILE_ASSETS);

  // --- Web: favicons from isotipo ---
  console.log('Web (favicons & OG):');
  await svgToPng(isotipoPath, path.join(WEB_PUBLIC, 'favicon-16x16.png'), 16, 16, 'favicon-16');
  await svgToPng(isotipoPath, path.join(WEB_PUBLIC, 'favicon-32x32.png'), 32, 32, 'favicon-32');
  const favicon32Buf = await sharp(isotipoPath).resize(32, 32).png().toBuffer();
  const icoBuf = await toIco([favicon32Buf]);
  await fs.promises.writeFile(path.join(WEB_PUBLIC, 'favicon.ico'), icoBuf);
  console.log(`  ✓ favicon.ico (32x32) → ${path.join(WEB_PUBLIC, 'favicon.ico')}`);

  await svgToPng(isotipoPath, path.join(WEB_PUBLIC, 'apple-touch-icon.png'), 180, 180, 'apple-touch');
  await svgToPng(ogPath, path.join(WEB_PUBLIC, 'og-image.png'), 1200, 630, 'og-image');

  // --- Mobile: icon, adaptive-icon, splash ---
  console.log('\nMobile:');
  await svgToPng(isotipoPath, path.join(MOBILE_ASSETS, 'icon.png'), 1024, 1024, 'icon');
  await svgToPng(isotipoPath, path.join(MOBILE_ASSETS, 'adaptive-icon.png'), 1024, 1024, 'adaptive-icon');
  await svgToPng(isotipoPath, path.join(MOBILE_ASSETS, 'favicon.png'), 48, 48, 'favicon');

  // Splash: isotipo in white, centered on primary background (#3b82f6)
  const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="#3b82f6"/>
  <g transform="scale(16)" fill="#f8fafc">
    <path d="M32 8c-2 0-4 1.2-5.5 3.2C24 14.5 16 26 16 38c0 8.8 7.2 16 16 16s16-7.2 16-16c0-12-8-23.5-10.5-26.8C36 9.2 34 8 32 8z"/>
    <path d="M28 22v20h4V26h6v-4H28z"/>
  </g>
</svg>`;
  const splashPath = path.join(MOBILE_ASSETS, 'splash-icon.png');
  await sharp(Buffer.from(splashSvg))
    .resize(1024, 1024)
    .png()
    .toFile(splashPath);
  console.log(`  ✓ splash-icon.png (1024, primary bg) → ${splashPath}`);

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
