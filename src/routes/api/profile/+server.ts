import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { getUserFromToken } from "../_data"

export const GET: RequestHandler = async ({ request }) => {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "")

  const user = getUserFromToken(token)
  if (!user) {
    return json({ error: "Unauthorized" }, { status: 401 })
  }

  return json({
    id: user.id,
    email: user.email,
    username: user.username,
    full_name: user.full_name,
    created_at: user.created_at,
  })
}
