import PageHeader from "@/components/PageHeader";
import { BLOG_POSTS } from "@/lib/blog-data";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for static site generation
export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found - SkillBridge",
    };
  }

  return {
    title: `${post.title} - SkillBridge Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-16 transition-colors duration-200">
      <PageHeader
        title={post.title}
        description={`By ${post.author} • ${post.date} • ${post.readTime}`}
        breadcrumbs={[
          { label: "Blog", href: "/blog" },
          { label: post.title }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <Link
          href="/blog"
          className="text-brand-green hover:text-brand-green-hover font-semibold text-sm inline-flex items-center gap-2 mb-8 transition-colors"
        >
          &larr; Back to blog
        </Link>

        {/* Feature Image */}
        <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-md mb-10 bg-gray-200 dark:bg-slate-800">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover opacity-90 dark:opacity-85"
          />
        </div>

        {/* Blog Post Content */}
        <article className="prose dark:prose-invert prose-emerald max-w-none bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm transition-colors duration-200">
          <div 
            className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
}
