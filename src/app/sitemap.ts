import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// one page site, one entry. here so the robots.txt sitemap line isn't a 404
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE.url, lastModified: SITE.launchedAt, changeFrequency: "monthly", priority: 1 }];
}
