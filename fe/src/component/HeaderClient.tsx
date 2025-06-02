import Link from 'next/link'
import { Search, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function HeaderClient() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-2 text-sm border-b">
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">
              {new Date().toLocaleDateString('vi-VN')}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/contact" className="hover:text-primary">
              Liên hệ
            </Link>
            <Link href="/about" className="hover:text-primary">
              Giới thiệu
            </Link>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded font-bold">
              NEWS
            </div>
            <span className="text-xl font-bold">Term 2</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm kiếm tin tức..." 
                className="pl-10"
              />
            </div>
            <Button>Tìm</Button>
          </div>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="py-3 border-t">
          <div className="flex items-center space-x-8 overflow-x-auto">
            <Link href="/" className="font-medium hover:text-primary whitespace-nowrap">
              Trang chủ
            </Link>
            <Link href="/the-thao" className="hover:text-primary whitespace-nowrap">
              Thể thao
            </Link>
            <Link href="/kinh-te" className="hover:text-primary whitespace-nowrap">
              Kinh tế
            </Link>
            <Link href="/giai-tri" className="hover:text-primary whitespace-nowrap">
              Giải trí
            </Link>
            <Link href="/cong-nghe" className="hover:text-primary whitespace-nowrap">
              Công nghệ
            </Link>
            <Link href="/the-gioi" className="hover:text-primary whitespace-nowrap">
              Thế giới
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}