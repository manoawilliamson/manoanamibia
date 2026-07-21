import Link from "next/link"
import { notFound } from "next/navigation"
import PostClient from "./PostClient"
import { query } from "@/lib/db"
import { initDatabase } from "@/lib/init-db"

// Force dynamic rendering
export const dynamic = "force-dynamic"

async function getPost(id: string) {
  try {
    await initDatabase()
    const result = await query('SELECT * FROM posts WHERE id = $1', [id])
    return result.rows[0]
  } catch (error) {
    console.error('Failed to fetch post from database:', error)
    return null
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
