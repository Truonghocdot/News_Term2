import Link from 'next/link'
import Image from 'next/image'
import { Clock, User } from 'lucide-react'
import { formatDate } from '../util/util'

interface NewsCardProps {
  post: {
    id: string
    title: string
    excerpt: string
    featuredImage?: string
    category: { name: string; slug: string }
    author: { name: string }
    publishedAt: Date
  }
  size?: 'small' | 'medium' | 'large'
}

export function NewsCard({ post, size = 'medium' }: NewsCardProps) {
  const imageHeight = size === 'large' ? 'h-64' : size === 'medium' ? 'h-48' : 'h-32'
  
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.featuredImage && (
        <div className={`relative ${imageHeight} overflow-hidden`}>
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <Link 
              href={`/${post.category.slug}`}
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold hover:bg-primary/90"
            >
              {post.category.name}
            </Link>
          </div>
        </div>
      )}
      
      <div className="p-4">
        <h3 className={`font-bold mb-2 line-clamp-2 hover:text-primary ${
          size === 'large' ? 'text-xl' : 'text-lg'
        }`}>
          <Link href={`/${post.category.slug}/${post.id}`}>
            {post.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <User className="h-3 w-3" />
            <span>{post.author.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}