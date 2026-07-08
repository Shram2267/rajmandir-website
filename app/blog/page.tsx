import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const revalidate = 300; // refresh the listing every 5 min

export const metadata: Metadata = {
  title: `Blog | ${SITE_NAME}`,
  description: "Recipes, savings tips, store news and more from Rajmandir Hypermarket.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description: "Recipes, savings tips, store news and more from Rajmandir Hypermarket.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <div>
      {/* hero */}
      <section className="rm-stripe border-b border-line text-center px-5 lg:px-[44px] py-9 lg:py-[56px]">
        <div className="font-hand text-[20px] lg:text-[24px] text-brand font-bold">From our blog</div>
        <h1 className="text-[27px] lg:text-[44px] font-extrabold leading-[1.1] max-w-[760px] mx-auto mt-2 tracking-[-.5px] text-balance">
          Recipes, savings & store news
        </h1>
        <p className="text-[14px] lg:text-[16px] text-stone-600 max-w-[560px] mx-auto mt-3 leading-[1.6]">
          Tips to shop smarter and make the most of every rupee at Rajmandir.
        </p>
      </section>

      {/* listing */}
      <section>
        <div className="mx-auto w-full max-w-[1180px] px-4 lg:px-6 py-9 lg:py-12">
          {posts.length === 0 ? (
            <div className="text-center text-stone-500 py-16">
              No posts yet — check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {posts.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col rounded-[18px] border border-line bg-white overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(33,27,23,.12)]"
                >
                  <div className="aspect-[16/10] bg-blush overflow-hidden">
                    {p.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.cover_url}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📝</div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-[17px] font-extrabold leading-snug text-ink">{p.title}</h2>
                    {p.excerpt && (
                      <p className="text-[13px] text-stone-600 mt-2 leading-[1.5] line-clamp-3">{p.excerpt}</p>
                    )}
                    <span className="text-brand font-bold text-[13px] mt-auto pt-3">Read more →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
