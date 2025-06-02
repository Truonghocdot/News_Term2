import { HeaderClient } from '../../component/HeaderClient'
import { FooterClient } from '../../component/FooterClient'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderClient />
      <main className="flex-1">
        {children}
      </main>
      <FooterClient />
    </div>
  )
}