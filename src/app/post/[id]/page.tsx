import Link from "next/link"
import { notFound } from "next/navigation"
import PostClient from "./PostClient"

// Force dynamic rendering
export const dynamic = "force-dynamic"

async function getPost(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/posts`, {
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    return data.posts.find((p: any) => p.id === id)
  } catch (error) {
    // Fallback to static data if API fails
    const posts = require('@/data/posts.json')
    return posts.posts.find((p: any) => p.id === id)
  }
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  return <PostClient post={post} />
}
