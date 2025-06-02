'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Oops! Có lỗi xảy ra
        </h1>
        
        <p className="text-gray-600 mb-6">
          {error.message || 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.'}
        </p>

        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
          
          <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full">
            <Home className="h-4 w-4 mr-2" />
            Về trang chủ
          </Button>
        </div>

        {error.digest && (
          <p className="text-xs text-gray-400 mt-4">
            Mã lỗi: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}