/**
 * Lightweight realm metadata helpers — NO filesystem imports.
 * Import these in pages that are prerendered (blog, home) to avoid
 * Next.js output-file-tracing bundling all of public/realms/ into
 * every serverless function (which causes 2GB+ bundle sizes).
 *
 * Pages that need gallery/lore/characters discovery (readdirSync-based)
 * should import those from realmImages.ts directly.
 */

/**
 * Returns card image URL by convention: /realms/[slug]/card.jpg
 * All realm cards are .jpg. Browser handles 404 gracefully if none exists.
 */
export function discoverRealmCardImage(slug: string): string | null {
  if (!slug) return null
  return `/realms/${slug}/card.jpg`
}

/**
 * Hero image is an optional enhancement — returns null to keep bundles small.
 * Realm pages that need hero imagery should source it from the gallery instead.
 */
export function discoverRealmHeroImage(_slug: string): string | null {
  return null
}
