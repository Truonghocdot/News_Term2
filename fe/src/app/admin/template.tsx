import { AdminHeader } from "@/component/HeaderAdmin"
import { Inter } from 'next/font/google'
import { AdminSidebar } from "@/component/SidebarAdmin"
import { Metadata } from "next"
const inter = Inter({ subsets: ['latin'] })
export const metadata : Metadata = {
    title: "News Term 2 - Báo Điện tử",
    description: 'Website tin tức RSS với Next.js',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head>
        <link rel='icon' href='../favicon.png' />
      </head>
      <body className={inter.className} >
        <div className="flex h-screen bg-gray-50">
          <AdminSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}