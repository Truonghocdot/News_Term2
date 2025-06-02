export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded font-bold text-lg">
              NEWS
            </div>
            <span className="text-2xl font-bold text-gray-800">Term 2</span>
          </div>
          <p className="text-gray-600 mt-2">Quản trị hệ thống</p>
        </div>
        
        {children}
      </div>
    </div>
  )
}