import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { users } from "../_data"

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json()
  const { email } = body

  if (!email) {
    return json({ error: "Email is required" }, { status: 400 })
  }

  // find user
  const user = users.find((u) => u.email === email)

  // For privacy don't reveal whether the email exists. Still, for demo we'll create a token if found.
  if (user) {
    const token = btoa(`${user.id}:${Date.now()}`)
    user.reset_token = token
    user.reset_expires = Date.now() + 1000 * 60 * 60 // 1 hour

    // In a real app you would send an email. For the demo return the reset link.
    return json({ message: "If an account exists, a reset link was sent.", reset_link: `/reset-password?token=${token}` })
  }

  return json({ message: "If an account exists, a reset link was sent." })
}
