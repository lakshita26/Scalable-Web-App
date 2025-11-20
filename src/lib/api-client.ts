const API_BASE_URL = "/api"

interface ApiResponse<T> {
  data?: T
  error?: string
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {},
): Promise<ApiResponse<T>> {
  const { token, ...fetchOptions } = options
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    // Normalize endpoint so callers can pass either "/profile" or "/api/profile"
    const url = endpoint.startsWith("/api") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }))
      return { error: error.error || error.detail || "Request failed" }
    }

    const data = await response.json()
    return { data }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" }
  }
}
