import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Prerender sitemap.xml at build time — required by `output: "export"`.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `https://${site.domain}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
