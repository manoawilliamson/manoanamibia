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

export async function GET() {
  try {
    const posts = await getPosts()
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const posts = await getPosts()
    
    const newPost = {
      id: body.id,
      title: body.title,
      date: body.date,
      excerpt: body.excerpt,
      content: body.content,
      images: body.images || []
    }
    
    posts.posts.push(newPost)
    await savePosts(posts)
    
    return NextResponse.json(newPost)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
