import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { users } from "../_data"

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json()
  const { token, new_password } = body

  if (!token || !new_password) {
    return json({ error: "Token and new_password are required" }, { status: 400 })
  }

  const user = users.find((u) => u.reset_token === token)
  if (!user) {
    return json({ error: "Invalid or expired token" }, { status: 400 })
  }

  if (!user.reset_expires || Date.now() > user.reset_expires) {
    return json({ error: "Invalid or expired token" }, { status: 400 })
  }

  // update password (demo only — plain text)
  user.password = new_password
  delete user.reset_token
  delete user.reset_expires

  return json({ message: "Password updated successfully" })
}
