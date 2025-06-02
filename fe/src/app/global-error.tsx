'use client'

import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Lỗi hệ thống nghiêm trọng
            </h1>
            
            <p className="text-gray-600 mb-6">
              Đã xảy ra lỗi nghiêm trọng. Vui lòng tải lại trang hoặc liên hệ hỗ trợ.
            </p>

            <button
              onClick={reset}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Tải lại trang
            </button>

            {error.digest && (
              <p className="text-xs text-gray-400 mt-4">
                Mã lỗi: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}