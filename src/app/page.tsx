import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import posts from "@/data/posts.json"

export default function Home() {
  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="backdrop-blur-2xl bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl">
            <div className="px-6 sm:px-8 py-4 flex justify-between items-center">
              <Link href="/" className="text-lg sm:text-xl font-heading font-medium text-black dark:text-white">
                MISSION - NAMIBIA
              </Link>
              <nav className="flex items-center gap-4 sm:gap-12">
                <Link href="/" className="text-xs sm:text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">
                  Home
                </Link>
                <ThemeToggle />
              </nav>
            </div>
          </div>
        </div>
      </header>
      <div className="h-[96px]" />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="aspect-[16/9] overflow-hidden rounded-xl shadow-md border border-black/10 dark:border-white/10">
            <img
              src="/images/rehobot.jpeg"
              alt="Rehoboth Namibia landscape"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-[16/9] overflow-hidden rounded-xl shadow-md border border-black/10 dark:border-white/10">
            <img
              src="/images/mission.jpeg"
              alt="Mission group meeting"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-base text-black/70 dark:text-white/70 leading-relaxed">
            This blog will be my way of sharing my journey; the small victories, the challenges, the people I meet, and the ways God shows up in the ordinary moments of daily life here in Namibia. Consider this the first page of a story still being written.

Thank you for walking alongside me; whether you're reading from Tana City Church back home, from Jlife Africa here in Namibia, or from anywhere else in the world. Your prayers and support mean more than you know.

 <br />
- Manoa Williamson
          </p>
        </div>

        <div className="space-y-12">
          {posts.posts.map((post) => (
            <div key={post.id} className="border-b border-black/10 dark:border-white/10 pb-12">
              <div className="text-sm text-black/50 dark:text-white/50 mb-2">
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <h2 className="text-2xl font-medium text-black dark:text-white mb-3">
                <Link href={`/post/${post.id}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-black/70 dark:text-white/70 leading-relaxed mb-4">
                {post.excerpt}
              </p>
              <Link
                href={`/post/${post.id}`}
                className="inline-flex items-center text-sm font-medium text-black dark:text-white hover:underline transition-colors"
              >
                Continue reading
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
