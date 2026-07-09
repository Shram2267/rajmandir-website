import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

export const revalidate = 300; // refresh article pages every 5 min

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: `Post not found | ${SITE_NAME}` };

  const description = post.excerpt || `Read "${post.title}" on the ${SITE_NAME} blog.`;
  return {
    title: `${post.title} | ${SITE_NAME}`,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `${SITE_URL}/blog/${slug}`,
      type: "article",
      images: post.cover_url ? [post.cover_url] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.cover_url || undefined,
    datePublished: post.created_at,
    dateModified: post.created_at,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${slug}` },
    ],
  };

  return (
    <div>
      <JsonLd data={[articleJsonLd, breadcrumbJsonLd]} />

      <article className="mx-auto w-full max-w-[800px] px-5 lg:px-10 py-8 lg:py-12">
        <nav className="text-[12px] text-stone-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/blog" className="hover:text-brand">Blog</Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink font-semibold">{post.title}</span>
        </nav>

        <h1 className="text-[28px] lg:text-[42px] font-extrabold leading-[1.12] tracking-[-.5px] text-balance">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-[16px] lg:text-[18px] text-stone-600 mt-3 leading-[1.6]">{post.excerpt}</p>
        )}

        {post.cover_url && (
          <div className="relative mt-6 aspect-[16/9] rounded-[18px] overflow-hidden border border-line">
            <Image
              src={post.cover_url}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 800px) 100vw, 800px"
              className="object-cover"
            />
          </div>
        )}

        {post.body ? (
          <div
            className="doc-prose mt-8"
            // Body is authored by authenticated admins only (same trust model as
            // the rest of the admin-managed content on the site).
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        ) : (
          <p className="mt-8 text-stone-500">This post has no content yet.</p>
        )}

        <div className="mt-10 pt-6 border-t border-line">
          <Link href="/blog" className="text-brand font-bold text-[14px]">← Back to all posts</Link>
        </div>
      </article>
    </div>
  );
}
