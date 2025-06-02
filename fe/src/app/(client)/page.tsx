import { NewsCard } from '../../component/NewsCard'
import { SidebarClient } from '../../component/SidebarClient'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Featured News */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b-2 border-primary pb-2">
              Tin nổi bật
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <NewsCard 
                  size="large"
                  post={{
                    id: '1',
                    title: 'Tin tức nổi bật hôm nay',
                    excerpt: 'Mô tả ngắn về tin tức...',
                    featuredImage: '/images/news-1.jpg',
                    category: { name: 'Thời sự', slug: 'thoi-su' },
                    publishedAt: new Date(),
                    author: { name: 'Nguyễn Văn A' }
                  }}
                />
              </div>
              <NewsCard post={{
                id: '2',
                title: 'Tin tức phụ 1',
                excerpt: 'Mô tả ngắn...',
                category: { name: 'Kinh tế', slug: 'kinh-te' },
                publishedAt: new Date(),
                author: { name: 'Trần Thị B' }
              }} />
              <NewsCard post={{
                id: '3',
                title: 'Tin tức phụ 2',
                excerpt: 'Mô tả ngắn...',
                category: { name: 'Thể thao', slug: 'the-thao' },
                publishedAt: new Date(),
                author: { name: 'Lê Văn C' }
              }} />
            </div>
          </section>

          {/* Latest News */}
          <section>
            <h2 className="text-2xl font-bold mb-6 border-b-2 border-primary pb-2">
              Tin mới nhất
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <NewsCard 
                  key={i}
                  post={{
                    id: i.toString(),
                    title: `Tin tức số ${i}`,
                    excerpt: 'Mô tả ngắn về tin tức...',
                    category: { name: 'Tổng hợp', slug: 'tong-hop' },
                    publishedAt: new Date(),
                    author: { name: 'Tác giả' }
                  }}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <SidebarClient />
        </aside>
      </div>
    </div>
  )
}