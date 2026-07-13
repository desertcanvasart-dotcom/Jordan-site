import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

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
  ];
}
