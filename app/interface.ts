export interface simplifiedProduct {
  _id: string;
  imageUrl: string | null;
  price: number | null;
  slug: string;
  categoryName: string | null;
  name: string | null;
}

export interface fullProduct {
  _id: string;
  images: any;
  imageUrls: string[] | null;
  price: number | null;
  compareAtPrice: number | null;
  available: boolean | null;
  slug: string;
  categoryName: string | null;
  categorySlug: string | null;
  name: string | null;
  description: string | null;

  // Gem specs
  caratWeight: number | null;
  gemColour: string | null;
  clarity: string | null;
  shapeCut: string | null;
  dimensions: string | null;
  treatment: string | null;
  originCountry: string | null;
  certification: string | null;

  // SEO overrides
  seoTitle: string | null;
  seoDescription: string | null;
}