// 1. API Client (lib/api.ts)
import { getToken, refreshToken, logout } from '../util/auth'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  statusCode?: number
}

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.news-term-2.vn'
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const token = getToken()

   const headers = new Headers({
    'Content-Type': 'application/json',
    ...(options.headers || {})
    })

    if (token) {
        headers.set('Authorization', `Bearer ${token}`)
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // Handle different status codes
      if (response.status === 401) {
        // Try to refresh token
        const refreshResult = await refreshToken()
        if (refreshResult.success) {
          // Retry original request with new token
          headers.set('Authorization', `Bearer ${refreshResult.token}`)
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          })
          return this.handleResponse(retryResponse)
        } else {
          // Refresh failed, logout user
          logout()
          throw new Error('Phiên đăng nhập đã hết hạn')
        }
      }

      return this.handleResponse(response)
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Lỗi kết nối mạng',
        statusCode: 0
      }
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type')
    let data: any = null

    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }
    } catch (error) {
      // Response body is not valid JSON
    }

    if (!response.ok) {
      const errorMessage = this.getErrorMessage(response.status, data?.message)
      return {
        success: false,
        message: errorMessage,
        statusCode: response.status
      }
    }

    return {
      success: true,
      data: data,
      statusCode: response.status
    }
  }

  private getErrorMessage(statusCode: number, serverMessage?: string): string {
    if (serverMessage) return serverMessage;

    const errorMessages: Record<number, string> = {
      400: 'Yêu cầu không hợp lệ - Dữ liệu gửi lên không đúng định dạng',
      401: 'Không có quyền truy cập - Vui lòng đăng nhập lại',
      402: 'Cần thanh toán để tiếp tục sử dụng dịch vụ',
      403: 'Bị cấm truy cập - Bạn không có quyền thực hiện thao tác này',
      404: 'Không tìm thấy dữ liệu yêu cầu',
      405: 'Phương thức không được hỗ trợ',
      408: 'Yêu cầu hết thời gian chờ - Vui lòng thử lại',
      409: 'Xung đột dữ liệu - Dữ liệu đã tồn tại',
      410: 'Tài nguyên không còn tồn tại',
      422: 'Dữ liệu không hợp lệ - Vui lòng kiểm tra lại thông tin',
      429: 'Quá nhiều yêu cầu - Vui lòng thử lại sau ít phút',
      500: 'Lỗi máy chủ nội bộ - Vui lòng liên hệ hỗ trợ',
      501: 'Tính năng chưa được hỗ trợ',
      502: ''
    }
    return "";
  }
}