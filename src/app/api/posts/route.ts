import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { initDatabase } from '@/lib/init-db'

export async function GET() {
  try {
    console.log('Fetching posts from database...')
    await initDatabase()
    console.log('Database initialized')
    const result = await query('SELECT * FROM posts ORDER BY date DESC')
    console.log('Query executed, rows:', result.rows.length)
    return NextResponse.json(
      { posts: result.rows },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    )
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
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

    return NextResponse.json(
      result.rows[0],
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    )
  } catch (error) {
    console.error('Failed to create post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
