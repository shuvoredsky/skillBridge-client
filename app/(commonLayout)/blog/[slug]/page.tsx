import PageHeader from "@/components/PageHeader";
import { BLOG_POSTS } from "@/lib/blog-data";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";

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
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 transition-colors duration-200">
      <PageHeader
        title={post.title}
        description={`Published in ${post.tag}`}
        breadcrumbs={[
          { label: "Blog", href: "/blog" },
          { label: post.title }
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-brand-green hover:text-brand-green-hover font-semibold text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to all articles</span>
        </Link>

        {/* Feature Header Card */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm mb-8">
          <div className="relative h-72 sm:h-96 w-full bg-gray-100 dark:bg-slate-800">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover opacity-95 dark:opacity-85"
            />
            <div className="absolute top-4 left-4 bg-brand-green/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {post.tag}
            </div>
          </div>

          <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                <User size={14} className="text-brand-green" />
                {post.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-brand-green" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-brand-green" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>

        {/* Blog Post Content with comfortable reading line-height & spacing */}
        <article className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm transition-colors duration-200">
          <div 
            className="prose prose-slate dark:prose-invert prose-emerald max-w-none text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-brand-green hover:prose-a:underline prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
}
