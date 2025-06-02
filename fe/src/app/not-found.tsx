import Link from 'next/link'
import { Search, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl font-bold text-primary mb-4">404</div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Không tìm thấy trang
        </h1>
        
        <p className="text-gray-600 mb-6">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Về trang chủ
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/search">
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}