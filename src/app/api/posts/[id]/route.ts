import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const postsPath = path.join(process.cwd(), 'src/data/posts.json')

async function getPosts() {
  const data = await fs.readFile(postsPath, 'utf-8')
  return JSON.parse(data)
}

async function savePosts(posts: any) {
  await fs.writeFile(postsPath, JSON.stringify(posts, null, 2))
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const posts = await getPosts()
    
    const postIndex = posts.posts.findIndex((p: any) => p.id === id)
    
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    posts.posts[postIndex] = {
      id: id,
      title: body.title,
      date: body.date,
      excerpt: body.excerpt,
      content: body.content,
      images: body.images || []
    }
    
    await savePosts(posts)
    
    return NextResponse.json(posts.posts[postIndex])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const posts = await getPosts()
    
    const postIndex = posts.posts.findIndex((p: any) => p.id === id)
    
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    posts.posts.splice(postIndex, 1)
    await savePosts(posts)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
