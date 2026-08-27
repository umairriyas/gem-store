import { MetadataRoute } from "next";
import { client } from "@/app/lib/sanity";

const BASE_URL = "https://riyasgems.com";

// 1. Define a strict type for Sanity query responses to prevent TypeScript errors
interface SitemapEntry {
  slug: string;
  _updatedAt: string;
}

// 2. Fetch ALL published products (detects new ones automatically)
async function getProducts(): Promise<SitemapEntry[]> {
  const query = `*[_type == "product" && defined(slug.current) && slug.current != ""] {
    "slug": slug.current,
    _updatedAt
  }`;
  return await client.fetch(query);
}

// 3. Fetch ALL blog posts (adjust "post" to "blog" if your Sanity schema uses that type)
async function getBlogPosts(): Promise<SitemapEntry[]> {
  const query = `*[_type == "post" && defined(slug.current) && slug.current != ""] {
    "slug": slug.current,
    _updatedAt
  }`;
  return await client.fetch(query);
}

// 4. Fetch ALL gem categories
async function getCategories(): Promise<SitemapEntry[]> {
  const query = `*[_type == "category" && defined(slug.current) && slug.current != ""] {
    "slug": slug.current,
    _updatedAt
  }`;
  return await client.fetch(query);
}

// 5. Force Next.js to always fetch fresh data from Sanity (instant new product detection)
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all dynamic data in parallel for maximum speed
  const [products, blogPosts, categories] = await Promise.all([
    getProducts(),
    getBlogPosts(),
    getCategories(),
  ]);

  // --- STATIC ROUTES (High Priority Focus) ---
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0, // Highest priority for Homepage
    },
    {
      url: `${BASE_URL}/gems`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9, // High priority for main shop page
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9, // High priority for Blog index
    },
    {
      url: `${BASE_URL}/about`, // Change to "/about-us" if your route is different
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8, // Solid priority for About page
    },
  ];

  // --- DYNAMIC CATEGORY ROUTES ---
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/${category.slug}`,
    lastModified: new Date(category._updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // --- DYNAMIC PRODUCT ROUTES (Auto-detects new uploads) ---
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: "weekly", // Change to "daily" if you upload products multiple times a day
    priority: 0.6,
  }));

  // --- DYNAMIC BLOG POST ROUTES ---
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Combine all routes and return
  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...blogRoutes,
  ];
}