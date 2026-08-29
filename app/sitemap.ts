import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

const BASE_URL = "https://riyasgems.com";

// Revalidate hourly so lastmod reflects Sanity edits without a redeploy.
export const revalidate = 3600;

type ProductRow = {
  slug: string;
  updatedAt: string;
  category: string | null;
};

type PostRow = {
  slug: string;
  updatedAt: string;
};

const PRODUCTS_QUERY = `
  *[_type == "product" && defined(slug.current)] | order(_updatedAt desc) {
    "slug": slug.current,
    "updatedAt": _updatedAt,
    "category": category
  }
`;

const POSTS_QUERY = `
  *[_type == "post" && defined(slug.current)] | order(_updatedAt desc) {
    "slug": slug.current,
    "updatedAt": _updatedAt
  }
`;

function toSlug(category: string): string {
  return category.trim().toLowerCase().replace(/\s+/g, "-");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([
    client.fetch<ProductRow[]>(PRODUCTS_QUERY),
    client.fetch<PostRow[]>(POSTS_QUERY),
  ]);

  // Newest content date drives lastmod on index pages, not build time.
  const newestProduct = products[0]?.updatedAt;
  const newestPost = posts[0]?.updatedAt;

  // Distinct categories, lowercased to match the canonical route form.
  const categoryMap = new Map<string, string>();
  for (const p of products) {
    if (!p.category) continue;
    const slug = toSlug(p.category);
    const current = categoryMap.get(slug);
    if (!current || p.updatedAt > current) {
      categoryMap.set(slug, p.updatedAt);
    }
  }

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: newestProduct ? new Date(newestProduct) : undefined,
      priority: 1,
    },
    {
      url: `${BASE_URL}/gems`,
      lastModified: newestProduct ? new Date(newestProduct) : undefined,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: newestPost ? new Date(newestPost) : undefined,
      priority: 0.7,
    },
    {
      // /about is a duplicate and now 301s here. Only this URL belongs in the sitemap.
      url: `${BASE_URL}/about-us`,
      priority: 0.5,
    },
  ];

  const categoryEntries: MetadataRoute.Sitemap = Array.from(
    categoryMap.entries()
  ).map(([slug, updatedAt]) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: new Date(updatedAt),
    priority: 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    priority: 0.6,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...categoryEntries,
    ...productEntries,
    ...postEntries,
  ];
}