import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

// Simple in-memory database for demo
const users: any[] = []
const tasks: any[] = []
const taskIdCounter = 1

interface User {
  id: number
  email: string
  username: string
  password: string // In production, never store plain passwords
  full_name: string | null
  created_at: string
}

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json()
  const { email, username, password, full_name } = body

  // Validation
  if (!email || !username || !password) {
    return json({ error: "Missing required fields" }, { status: 400 })
  }

  if (password.length < 6) {
    return json({ error: "Password must be at least 6 characters" }, { status: 400 })
  }

  // Check if user already exists
  if (users.find((u) => u.email === email || u.username === username)) {
    return json({ error: "User already exists" }, { status: 400 })
  }

  // Create new user
  const user: User = {
    id: users.length + 1,
    email,
    username,
    password, // In production, hash this!
    full_name: full_name || null,
    created_at: new Date().toISOString(),
  }

  users.push(user)

  // Generate token (in production, use proper JWT)
  const token = btoa(`${user.id}:${Date.now()}`)

  return json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      created_at: user.created_at,
    },
    access_token: token,
  })
}
