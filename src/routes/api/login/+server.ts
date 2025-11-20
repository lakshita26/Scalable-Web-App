import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { users, verifyPassword, signTokenForUser, safeUser } from "../_data"

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return json({ error: "Missing required fields" }, { status: 400 })
  }

  const user = users.find((u) => u.email === email)
  if (!user || !(await verifyPassword(password, user.password))) {
    return json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = signTokenForUser(user)
  return json({ access_token: token, token_type: "bearer", user: safeUser(user) })
}
