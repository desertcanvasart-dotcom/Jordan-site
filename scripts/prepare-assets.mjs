import sharp from 'sharp';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
await mkdir('public/assets/og', { recursive: true });
for (const file of (await readdir('public/assets/img')).filter(f => f.endsWith('.jpg'))) {
  const stem = file.slice(0, -4);
  for (const width of [320, 640, 960, 1200]) {
    await sharp(`public/assets/img/${file}`).resize(width, Math.round(width * 2 / 3), { fit: 'cover' }).webp({ quality: 65 }).toFile(`public/assets/img/${stem}${width === 1200 ? '' : `-${width}`}.webp`);
  }
  const overlay = Buffer.from(`<svg width="1200" height="630"><defs><linearGradient id="shade"><stop stop-color="#251a11" stop-opacity=".84"/><stop offset="1" stop-color="#251a11" stop-opacity=".08"/></linearGradient></defs><rect width="1200" height="630" fill="url(#shade)"/><rect x="60" y="65" width="4" height="500" fill="#e7d6b9"/><text x="95" y="180" font-family="Georgia,serif" font-size="72" fill="#fbf6ec">DIYAR</text><text x="98" y="235" font-family="Arial,sans-serif" font-size="22" letter-spacing="5" fill="#e7d6b9">JORDAN</text><text x="95" y="425" font-family="Georgia,serif" font-size="54" fill="#fbf6ec">Private journeys.</text><text x="95" y="490" font-family="Georgia,serif" font-size="54" fill="#fbf6ec">Planned around you.</text></svg>`);
  await sharp(`public/assets/img/${file}`).resize(1200, 630, { fit: 'cover' }).composite([{ input: overlay }]).jpeg({ quality: 88 }).toFile(`public/assets/og/${stem}.jpg`);
}
await writeFile('public/assets/logo.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="28" fill="#251a11"/><path d="M25 95V55a35 35 0 0 1 70 0v40" fill="none" stroke="#e7d6b9" stroke-width="3"/><text x="60" y="83" text-anchor="middle" font-family="Georgia,serif" font-size="56" fill="#fbf6ec">D</text></svg>');
