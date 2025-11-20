import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { users, hashPassword, signTokenForUser, safeUser } from "../_data"

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json()
  const { email, username, password, full_name } = body

  // Validation
  if (!email || !username || !password) {
    return json({ error: "Missing required fields" }, { status: 400 })
  }

  // Password policy: 8-12 chars, at least one upper, one lower, one digit, one special
  const pwdLengthOk = password.length >= 8 && password.length <= 12
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasDigit = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  if (!(pwdLengthOk && hasUpper && hasLower && hasDigit && hasSpecial)) {
    return json(
      {
        error:
          'Password must be 8-12 characters and include at least one uppercase letter, one lowercase letter, one digit, and one special character',
      },
      { status: 400 },
    )
  }

  // Check if user already exists
  if (users.find((u) => u.email === email || u.username === username)) {
    return json({ error: "User already exists" }, { status: 400 })
  }

  const hashed = await hashPassword(password)

  const user = {
    id: users.length + 1,
    email,
    username,
    password: hashed,
    full_name: full_name || null,
    created_at: new Date().toISOString(),
  }

  users.push(user)

  const token = signTokenForUser(user)

  return json({
    user: safeUser(user),
    access_token: token,
  })
}
