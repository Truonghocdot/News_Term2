import Cookies from "js-cookie"
import { getErrorMessage } from "./erroMessage"

import { BASE_URL } from "../../enviroment"
interface LoginResponse {
  success: boolean
  message?: string
  data?: {
    token: string
    refreshToken: string
    user: {
      id: string
      username: string
      gmail: string
      role: string
    }
  }
}

interface RegisterData {
  username: string
  gmail: string
  password: string
  roleName: string
}


export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || getErrorMessage(response.status))
    }

    // Store tokens
    // if (data.token) {
    //   localStorage.setItem('token', data.token)
    //   localStorage.setItem('refreshToken', data.refreshToken)
    //   localStorage.setItem('user', JSON.stringify(data.user))
    // }

    // Lưu token vào cookie
    Cookies.set("token", data.token, { expires: 1 }); // cookie hết hạn sau 1 ngày
    Cookies.set("refreshToken", data.refreshToken, { expires: 7 });
    Cookies.set("user", JSON.stringify(data.user));

    

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
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    let data = null;
try {
  data = await response.json();
} catch (err) {
  throw new Error('Server did not return valid JSON');
}

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
    const refreshToken = Cookies.get('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
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
    Cookies.remove('token');
    Cookies.set('token', data.token);
    
    return {
      success: true,
      token: data.token
    }
  } catch (error) {
    // Clear invalid tokens
    Cookies.get('token')
    Cookies.get('refreshToken')
    Cookies.get('user')
    
    return {
      success: false
    }
  }
}




export async function logout() {
  const token = Cookies.get("token");

  try {
    await fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Logout error:", error);
  }

  // Xoá dữ liệu frontend
  // localStorage.removeItem("token");
  // localStorage.removeItem("refreshToken");
  // localStorage.removeItem("user");

  // Xoá token ở cookie
  Cookies.remove("token");
  Cookies.remove("refreshToken");
  Cookies.remove("user");

  window.location.href = "/";
}


export function getUserFromCookie() {
  const user = Cookies.get("user");
  return user ? JSON.parse(user) : null;
}

export function getToken(): string | undefined {
  return Cookies.get('token')
}

export function getUser() {
  const userStr = Cookies.get('user')
  return userStr ? JSON.parse(userStr) : null
}
