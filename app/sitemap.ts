import { MetadataRoute } from "next";
import { client } from "@/app/lib/sanity";

const BASE_URL = "https://riyasgems.com";

// Refresh hourly so lastmod reflects Sanity edits without a redeploy.
export const revalidate = 3600;

type ProductRow = {
  slug: string | null;
  updatedAt: string | null;
  // Dereferenced to a string by the query, but typed loose so a schema
  // change can never break the build again.
  category: unknown;
};

type PostRow = {
  slug: string | null;
  updatedAt: string | null;
};

// category is a reference field, so it needs the -> arrow. Without it the
// query returns {_ref, _type} and toSlug() throws during prerender.
const PRODUCTS_QUERY = `
  *[_type == "product" && defined(slug.current) && slug.current != ""] | order(_updatedAt desc) {
    "slug": slug.current,
    "updatedAt": _updatedAt,
    "category": category->name
  }
`;

const POSTS_QUERY = `
  *[_type == "post" && defined(slug.current) && slug.current != ""] | order(_updatedAt desc) {
    "slug": slug.current,
    "updatedAt": _updatedAt
  }
`;

function toSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || null;
}

function toDate(value: string | null): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: ProductRow[] = [];
  let posts: PostRow[] = [];

  // A Sanity outage should not fail the build. Worst case the sitemap
  // ships with static pages only.
  try {
    const results = await Promise.all([
      client.fetch<ProductRow[]>(PRODUCTS_QUERY),
      client.fetch<PostRow[]>(POSTS_QUERY),
    ]);
    products = Array.isArray(results[0]) ? results[0] : [];
    posts = Array.isArray(results[1]) ? results[1] : [];
  } catch (error) {
    console.error("sitemap: Sanity fetch failed", error);
  }

  const validProducts = products.filter((p) => typeof p.slug === "string" && p.slug);
  const validPosts = posts.filter((p) => typeof p.slug === "string" && p.slug);

  // Newest content drives lastmod on index pages, instead of build time.
  const newestProduct = toDate(validProducts[0]?.updatedAt ?? null);
  const newestPost = toDate(validPosts[0]?.updatedAt ?? null);

  // Distinct categories, lowercased to match the canonical route form.
  const categoryMap = new Map<string, string>();
  for (const p of validProducts) {
    const slug = toSlug(p.category);
    if (!slug) continue;
    const updatedAt = p.updatedAt;
    if (!updatedAt) continue;
    const current = categoryMap.get(slug);
    if (!current || updatedAt > current) {
      categoryMap.set(slug, updatedAt);
    }
  }

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: newestProduct,
      priority: 1,
    },
    {
      url: `${BASE_URL}/gems`,
      lastModified: newestProduct,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: newestPost,
      priority: 0.7,
    },
    {
      // /about is a duplicate and 301s here. Only this URL belongs in the sitemap.
      url: `${BASE_URL}/about-us`,
      priority: 0.5,
    },
  ];

  const categoryEntries: MetadataRoute.Sitemap = Array.from(categoryMap.entries()).map(
    ([slug, updatedAt]) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified: toDate(updatedAt),
      priority: 0.8,
    }),
  );

  const productEntries: MetadataRoute.Sitemap = validProducts.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: toDate(p.updatedAt),
    priority: 0.6,
  }));

  const postEntries: MetadataRoute.Sitemap = validPosts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: toDate(p.updatedAt),
    priority: 0.6,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries, ...postEntries];
}