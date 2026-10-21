import { readFileSync } from 'node:fs';
const business = JSON.parse(readFileSync('content/business.json', 'utf8'));
const verification = JSON.parse(readFileSync('content/launch-verification.json', 'utf8'));
const failures = [];
const required = ['legalName', 'foundingDate', 'phone', 'whatsapp', 'email', 'address', 'priceRange'];
for (const key of required) if (!business[key]) failures.push(`Business information missing: ${key}`);
if (!business.founders.length) failures.push('Verified founder name and biography missing');
const origin = process.env.SITE_URL || business.productionUrl;
if (!origin) failures.push('Confirmed production URL missing (SITE_URL or productionUrl)');
else {
  try {
    const url = new URL(origin);
    if (url.protocol !== 'https:' || /^(localhost|127\.0\.0\.1)$/.test(url.hostname)) failures.push('Production URL must be a public HTTPS origin');
  } catch { failures.push('Production URL is invalid'); }
}
if (business.address) for (const key of ['streetAddress', 'addressLocality', 'addressRegion', 'postalCode', 'addressCountry']) if (!business.address[key]) failures.push(`Address field missing: ${key}`);
for (const [key, value] of Object.entries(verification)) if (!value.passed || !value.evidence || !value.checkedAt) failures.push(`Launch validation pending: ${key}`);
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log('Launch requirements verified.');
