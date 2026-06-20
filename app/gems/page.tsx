import { client } from "@/sanity/lib/client";
import GemsClient from "./GemsClient";

export const revalidate = 60;

export default async function GemsPage() {
  const products = await client.fetch(`
    *[_type == "product" && defined(slug.current)] | order(name asc) {
      _id,
      name,
      slug,
      description,
      price,
      images,
      "category": category->{ name }
    }
  `);

  const categories = [
    ...new Map(
      products
        .filter((p: any) => p.category?.name)
        .map((p: any) => [p.category.name, p.category.name]),
    ).values(),
  ] as string[];

  return <GemsClient products={products} categories={categories} />;
}
