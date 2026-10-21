export function serializeJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
export function jsonLdTag(data: Record<string, unknown>, id = "page-jsonld") {
  return `<script id="${id}" type="application/ld+json">${serializeJsonLd(data)}</script>`;
}
