import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { initDatabase } from '@/lib/init-db'

export async function GET() {
  try {
    await initDatabase()
    const result = await query('SELECT * FROM posts ORDER BY date DESC')
    return NextResponse.json({ posts: result.rows })
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await initDatabase()
    const body = await request.json()
    
    const result = await query(
      `INSERT INTO posts (id, title, date, excerpt, content, images)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [body.id, body.title, body.date, body.excerpt, body.content, JSON.stringify(body.images || [])]
    )
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Failed to create post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
