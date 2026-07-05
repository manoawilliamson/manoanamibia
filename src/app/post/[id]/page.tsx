'use client'

import Link from "next/link"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import posts from "@/data/posts.json"
import { notFound, useParams } from "next/navigation"

export default function PostPage() {
  const params = useParams()
  const id = params.id as string
  const post = posts.posts.find(p => p.id === id)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="backdrop-blur-2xl bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl">
            <div className="px-6 sm:px-8 py-4 flex justify-between items-center">
              <Link href="/" className="text-lg sm:text-xl font-heading font-medium text-black dark:text-white">
                Mission in Namibia
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

      <main className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/" className="inline-block text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white mb-8">
          ← Back to all posts
        </Link>

        <article>
          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {post.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square flex items-center justify-center bg-black/5 dark:bg-white/5 rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`${post.title} image ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="text-sm text-black/50 dark:text-white/50 mb-4">
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="text-4xl font-medium text-black dark:text-white mb-8">
            {post.title}
          </h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-black/80 dark:text-white/80 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-light z-10"
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Full size image"
            className="max-w-full max-h-[90vh] object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
