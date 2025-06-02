import { Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PostPageProps {
  params: { 
    category: string
    slug: string 
  }
}

export default function PostPage({ params }: PostPageProps) {
  const post = {
    title: 'Tiêu đề bài viết chi tiết',
    content: `
      <p>Đây là nội dung chi tiết của bài viết. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
      
      <h3>Tiêu đề phụ</h3>
      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    `,
  }
}