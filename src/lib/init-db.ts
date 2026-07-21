import { query } from './db'

export async function initDatabase() {
  try {
    // Create posts table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        date TIMESTAMP NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        images JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create index on date for better query performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC)
    `)

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}

// Function to update the updated_at timestamp
export async function updateTimestamp(id: string) {
  await query(
    'UPDATE posts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
    [id]
  )
}
