"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Post {
  id: string
  title: string
  date: string
  excerpt: string
  content: string
  images: string[]
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    date: new Date().toISOString().split('T')[0],
    excerpt: "",
    content: "",
    images: [] as string[]
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchPosts()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "namibia2026") {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'true')
      fetchPosts()
    } else {
      alert("Incorrect password")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setPosts(data.posts)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingPost ? `/api/posts/${editingPost.id}` : '/api/posts'
      const method = editingPost ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchPosts()
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save post:', error)
    }
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setFormData({
      id: post.id,
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      content: post.content,
      images: post.images || []
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchPosts()
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  const resetForm = () => {
    setIsEditing(false)
    setEditingPost(null)
    setFormData({
      id: "",
      title: "",
      date: new Date().toISOString().split('T')[0],
      excerpt: "",
      content: "",
      images: []
    })
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const uploadFormData = new FormData()
          uploadFormData.append('file', file)
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData
          })
          const data = await response.json()
          return data.imageUrl
        })
      )

      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedImages.filter(Boolean)]
      })
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image(s)')
    } finally {
      setUploading(false)
    }
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
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-medium text-black dark:text-white mb-4">
              Admin Login
            </h1>
            <p className="text-lg text-black/70 dark:text-white/70 mb-8">
              Enter your password to access the admin dashboard
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit">
                Login
              </Button>
            </form>
          </div>
        ) : (
          <>
            <div className="mb-12 flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-medium text-black dark:text-white mb-4">
                  Admin Dashboard
                </h1>
                <p className="text-lg text-black/70 dark:text-white/70">
                  Manage your blog posts
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-black dark:text-white">
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </h2>
            {isEditing && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="id">Post ID (slug)</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="my-post-slug"
                disabled={isEditing}
                required
              />
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Post title"
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="images">Images</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-black/50 dark:text-white/50 mt-2">Uploading...</p>}
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={image} alt={`Preview ${index + 1}`} className="max-h-40 rounded object-contain" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary of the post"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Full post content"
                rows={10}
                required
              />
            </div>

            <Button type="submit">
              {isEditing ? 'Update Post' : 'Create Post'}
            </Button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-medium text-black dark:text-white mb-6">
            All Posts
          </h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border border-black/10 dark:border-white/10 p-4 rounded-lg flex justify-between items-start"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-black dark:text-white mb-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-black/50 dark:text-white/50 mb-2">
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-black/70 dark:text-white/70 line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(post)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  )
}
