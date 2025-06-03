"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Users, 
  Settings,
  BarChart3,
  VideoIcon,
  List
} from 'lucide-react'
import { cn } from '../util/util'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    title: 'Bài viết',
    href: '/admin/posts',
    icon: FileText
  },
  {
    title: 'Media',
    href: '/admin/media',
    icon: Image
  },
  {
    title: 'Danh mục',
    href: '/admin/category',
    icon: List
  },
  {
    title: 'Người dùng',
    href: '/admin/user',
    icon: Users
  },
  {
    title: 'Video & Reels',
    href: '/admin/video',
    icon: VideoIcon
  },
  {
    title: 'Cài đặt',
    href: '/admin/settings',
    icon: Settings
  }
  
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-bold">
            ADMIN
          </div>
          <span className="font-bold">News Term 2</span>
        </Link>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors",
                isActive && "bg-primary/10 text-primary border-r-2 border-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}