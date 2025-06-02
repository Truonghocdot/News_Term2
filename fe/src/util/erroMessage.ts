export function getErrorMessage(statusCode: number): string {
  const errorMessages: Record<number, string> = {
    400: 'Yêu cầu không hợp lệ',
    401: 'Không có quyền truy cập',
    402: 'Cần thanh toán để sử dụng dịch vụ',
    403: 'Bị cấm truy cập',
    404: 'Không tìm thấy trang',
    408: 'Yêu cầu hết thời gian chờ',
    409: 'Xung đột dữ liệu',
    429: 'Quá nhiều yêu cầu',
    500: 'Lỗi máy chủ nội bộ',
    502: 'Cổng kết nối không hợp lệ',
    503: 'Dịch vụ không khả dụng',
    504: 'Hết thời gian chờ cổng kết nối'
  }

  return errorMessages[statusCode] || 'Có lỗi xảy ra'
}