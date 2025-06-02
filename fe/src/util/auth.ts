import { getErrorMessage } from "./erroMessage"

interface LoginResponse {
  success: boolean
  message?: string
  data?: {
    token: string
    refreshToken: string
    user: {
      id: string
      name: string
      email: string
      role: string
    }
  }
}

interface RegisterData {
  name: string
  email: string
  password: string
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.news-term-2.vn'

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || getErrorMessage(response.status))
    }

    // Store tokens
    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    return {
      success: true,
      data: data
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    }
  }
}

export async function register(userData: RegisterData): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || getErrorMessage(response.status))
    }

    return {
      success: true,
      data: data
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    }
  }
}

export async function refreshToken(): Promise<{ success: boolean; token?: string }> {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Token refresh failed')
    }

    // Update token
    localStorage.setItem('token', data.token)
    
    return {
      success: true,
      token: data.token
    }
  } catch (error) {
    // Clear invalid tokens
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    
    return {
      success: false
    }
  }
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function getUser() {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}
