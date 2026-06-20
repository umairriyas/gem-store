import { client } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 60;

// SEO metadata
export const metadata = {
  title: "Blog | Riya's Gems",
  description:
    "Learn about gemstones, jewelry, and the latest news from Riya's Gems.",
};

async function getPosts() {
  return await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      tags,
      "coverImageUrl": coverImage.asset->url
    }
  `);
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gems & Jewelry Blog
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Explore articles about gemstones, their origins, and how to care for
            your gems.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-400 mt-20">
            No posts published yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link href={`/blog/${post.slug.current}`} key={post._id}>
                <div className="group border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                  {/* Cover Image */}
                  {post.coverImageUrl ? (
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      <Image
                        src={post.coverImageUrl}
                        alt={post.title}
                        width={600}
                        height={340}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-300 text-sm">
                      No image
                    </div>
                  )}

                  <div className="p-5">
                    {/* Tags */}
                    {post.tags?.length > 0 && (
                      <div className="flex gap-2 flex-wrap mb-3">
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
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition mb-2 line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Date */}
                    {post.publishedAt && (
                      <p className="text-xs text-gray-400">
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
