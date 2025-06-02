import Link from 'next/link'
import { TrendingUp, Eye } from 'lucide-react'

export function SidebarClient() {
  return (
    <div className="space-y-8">
      {/* Popular Posts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Tin phổ biến
        </h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <article key={i} className="flex space-x-3">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded"></div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium line-clamp-2 mb-1">
                  <Link href="#" className="hover:text-primary">
                    Tiêu đề tin tức phổ biến số {i}
                  </Link>
                </h4>
                <div className="flex items-center text-xs text-gray-500">
                  <Eye className="h-3 w-3 mr-1" />
                  <span>1.2k views</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Danh mục</h3>
        <div className="space-y-2">
          {[
            { name: 'Thời sự', count: 124 },
            { name: 'Thể thao', count: 89 },
            { name: 'Kinh tế', count: 67 },
            { name: 'Giải trí', count: 156 },
            { name: 'Công nghệ', count: 78 },
            { name: 'Thế giới', count: 234 }
          ].map((category) => (
            <Link
              key={category.name}
              href={`/${category.name.toLowerCase().replace(' ', '-')}`}
              className="flex justify-between items-center py-2 px-3 rounded hover:bg-gray-50 text-sm"
            >
              <span>{category.name}</span>
              <span className="text-gray-500">({category.count})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-primary text-primary-foreground rounded-lg p-6">
        <h3 className="text-lg font-bold mb-2">Đăng ký nhận tin</h3>
        <p className="text-sm opacity-90 mb-4">
          Nhận thông tin tin tức mới nhất qua email
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email của bạn"
            className="w-full px-3 py-2 rounded text-gray-900 text-sm"
          />
          <button className="w-full bg-white text-primary py-2 rounded text-sm font-medium hover:bg-gray-100">
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  )
}