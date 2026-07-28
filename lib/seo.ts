import type { Metadata } from "next";

import { siteConfig } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  /** Path relative to the app origin, used for the canonical URL. */
  path?: string;
  noIndex?: boolean;
}

/**
 * Compose page Metadata with sensible, consistent defaults:
 * canonical URL, OpenGraph and Twitter cards. OG/Twitter images are supplied
 * by the file-based `opengraph-image` convention and merged automatically.
 */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  noIndex = false,
}: BuildMetadataOptions = {}): Metadata {
  const url = absoluteUrl(path);
  // Full title for social cards; the document <title> uses the layout's
  // `%s — Sibero` template for page titles, or an absolute default.
  const fullTitle = title
    ? `${title} — ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`;

  return {
    title: title ?? { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      url,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      site: siteConfig.twitter,
      creator: siteConfig.twitter,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
