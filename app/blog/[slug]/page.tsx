import { client } from "@/app/lib/sanity";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/app/components/footer";

async function getPost(slug: string) {
  return await client.fetch(`
    *[_type == "post" && slug.current == "${slug}"][0] {
      _id,
      title,
      excerpt,
      publishedAt,
      tags,
      body,
      "coverImageUrl": coverImage.asset->url
    }
  `);
}

// Dynamic SEO metadata per post
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  return {
    title: `${post?.title} | Riya's Gems Blog`,
    description: post?.excerpt ?? "",
  };
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Post not found.</p>
        <Link
          href="/blog"
          className="text-green-700 underline mt-4 inline-block"
        >
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/blog"
          className="text-sm text-green-700 hover:underline mb-6 inline-block"
        >
          ← Back to Blog
        </Link>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

        {/* Date */}
        {post.publishedAt && (
          <p className="text-sm text-gray-400 mb-8">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className="rounded-2xl overflow-hidden mb-10">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              width={800}
              height={450}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Body — rich text from Sanity */}
        <div className="prose prose-green max-w-none text-gray-700 leading-relaxed">
          <PortableText value={post.body} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
