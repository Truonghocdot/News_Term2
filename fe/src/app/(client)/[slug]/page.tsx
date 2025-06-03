import { NewsCard } from "@/component/NewsCard"
import { SidebarClient } from "../../../component/SidebarClient"

interface CategoryPageProps {
  params: { category: string }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 capitalize">
              {params.category}
            </h1>
            <p className="text-gray-600">
              Tin tức mới nhất về {params.category}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <NewsCard 
                key={i}
                post={{
                  id: i.toString(),
                  title: `${params.category} tin tức số ${i}`,
                  excerpt: 'Mô tả ngắn về tin tức trong danh mục này...',
                  category: { name: params.category, slug: params.category },
                  publishedAt: new Date(),
                  author: { name: 'Tác giả' }
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <button className="px-3 py-2 border rounded hover:bg-gray-50">
                Trước
              </button>
              <button className="px-3 py-2 bg-primary text-primary-foreground rounded">
                1
              </button>
              <button className="px-3 py-2 border rounded hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 border rounded hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-2 border rounded hover:bg-gray-50">
                Sau
              </button>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <SidebarClient />
        </aside>
      </div>
    </div>
  )
}