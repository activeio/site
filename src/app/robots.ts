import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Prerender robots.txt at build time — required by `output: "export"`.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `https://${site.domain}/sitemap.xml`,
  };
}
