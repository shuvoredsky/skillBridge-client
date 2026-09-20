import PageHeader from "@/components/PageHeader";
import { BLOG_POSTS } from "@/lib/blog-data";
import Link from "next/link";
import EmptyState from "@/components/shared/EmptyState";
import { ArrowRight, BookOpen, Clock, Calendar } from "lucide-react";

export const metadata = {
  title: "Blog - SkillBridge",
  description: "Read resources, guides, and tips from the SkillBridge community.",
};

export default function BlogListingPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200 pb-16">
      <PageHeader
        title="SkillBridge Blog"
        description="Learning resources, tutoring strategies, and industry trends to elevate your education."
        breadcrumbs={[{ label: "Blog" }]}
      />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {BLOG_POSTS.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={28} className="text-brand-green" />}
            title="No Blog Posts Available"
            description="We are preparing helpful educational articles and guides. Check back soon!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="group bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-400/50 dark:hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Banner */}
                <div className="relative h-52 w-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 dark:opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-4 left-4 bg-brand-green/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {post.tag}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-brand-green" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-brand-green" />
                      {post.readTime}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-green dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-800/80 pt-4 mt-auto">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      By <span className="font-semibold text-gray-800 dark:text-gray-200">{post.author}</span>
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-brand-green hover:text-brand-green-hover font-semibold text-sm inline-flex items-center gap-1.5 transition-all group-hover:translate-x-1"
                    >
                      <span>Read More</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
