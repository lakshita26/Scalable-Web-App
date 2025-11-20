import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

// Get users from memory (would come from database in production)
const users: any[] = [
  {
    id: 1,
    email: "test@example.com",
    username: "testuser",
    password: "password123",
    full_name: "Test User",
    created_at: new Date().toISOString(),
  },
]

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return json({ error: "Missing email or password" }, { status: 400 })
  }

  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    return json({ error: "Invalid credentials" }, { status: 401 })
  }

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
