import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { initDatabase, updateTimestamp } from '@/lib/init-db'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase()
    const { id } = await params
    const body = await request.json()
    
    const result = await query(
      `UPDATE posts 
       SET title = $1, date = $2, excerpt = $3, content = $4, images = $5
       WHERE id = $6
       RETURNING *`,
      [body.title, body.date, body.excerpt, body.content, JSON.stringify(body.images || []), id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    await updateTimestamp(id)
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Failed to update post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase()
    const { id } = await params
    
    const result = await query(
      'DELETE FROM posts WHERE id = $1 RETURNING *',
      [id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
