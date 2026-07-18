import PageHeader from "@/components/PageHeader";
import { BLOG_POSTS } from "@/lib/blog-data";
import Link from "next/link";

export const metadata = {
  title: "Blog - SkillBridge",
  description: "Read resources, guides, and tips from the SkillBridge community.",
};

export default function BlogListingPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
      <PageHeader
        title="SkillBridge Blog"
        description="Learning resources, tutoring strategies, and industry trends."
        breadcrumbs={[{ label: "Blog" }]}
      />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full"
            >
              {/* Image Banner */}
              <div className="relative h-48 w-full bg-gray-200 dark:bg-slate-800">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover opacity-90 dark:opacity-80"
                />
                <span className="absolute top-4 left-4 bg-brand-green text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {post.tag}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1">
                <div className="text-xs text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-2">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-brand-green dark:hover:text-brand-green">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between border-t border-gray-50 dark:border-slate-800/60 pt-4 mt-auto">
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    By {post.author}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-brand-green hover:text-brand-green-hover font-semibold text-sm inline-flex items-center gap-1 transition-colors"
                  >
                    Read More &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
