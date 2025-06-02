import Link from 'next/link'
import {  Mail, Facebook, Twitter , Youtube} from 'lucide-react'

export function FooterClient() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded font-bold">
                NEWS
              </div>
              <span className="text-xl font-bold">Term 2</span>
            </div>
            <p className="text-slate-300 mb-4">
              Website tin tức hàng đầu Việt Nam, cập nhật thông tin nhanh và chính xác 24/7.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 hover:text-blue-400 cursor-pointer" />
              <Twitter className="h-5 w-5 hover:text-blue-400 cursor-pointer" />
              <Youtube className="h-5 w-5 hover:text-red-400 cursor-pointer" />
              <Mail className="h-5 w-5 hover:text-green-400 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Danh mục</h3>
            <div className="space-y-2">
              <Link href="/the-thao" className="block text-slate-300 hover:text-white">
                Thể thao
              </Link>
              <Link href="/kinh-te" className="block text-slate-300 hover:text-white">
                Kinh tế
              </Link>
              <Link href="/giai-tri" className="block text-slate-300 hover:text-white">
                Giải trí
              </Link>
              <Link href="/cong-nghe" className="block text-slate-300 hover:text-white">
                Công nghệ
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <div className="space-y-2 text-slate-300">
              <p>Email: contact@news-term-2.vn</p>
              <p>Hotline: 1900 1234</p>
              <p>Địa chỉ: Hà Nội, Việt Nam</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2024 News Term 2. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}