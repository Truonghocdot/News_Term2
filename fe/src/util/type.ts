export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage?: string
  category: Category
  author: User
  publishedAt: Date
  updatedAt: Date
  status: 'draft' | 'published'
  tags: string[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'author'
  avatar?: string
}