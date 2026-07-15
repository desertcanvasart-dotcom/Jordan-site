import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";
import { diyarPages } from "@/lib/diyar-html";

const lastModified = new Date("2026-07-13T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/ar`,
      lastModified,
      changeFrequency: "weekly",
      alternates: {
        languages: {
          ar: `${SITE_URL}/ar`,
          en: `${SITE_URL}/en`,
          "x-default": `${SITE_URL}/ar`,
        },
      },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified,
      changeFrequency: "weekly",
      alternates: {
        languages: {
          ar: `${SITE_URL}/ar`,
          en: `${SITE_URL}/en`,
          "x-default": `${SITE_URL}/ar`,
        },
      },
    },
    ...diyarPages.map((page) => ({
      url: `${SITE_URL}/${page}`,
      lastModified,
      changeFrequency: "weekly" as const,
    })),
  ];
}
