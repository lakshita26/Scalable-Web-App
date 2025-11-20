import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { users } from "../_data"

// DEV ONLY: returns the in-memory users for debugging.
export const GET: RequestHandler = async () => {
  // Do not expose this in production. Returns passwords and tokens.
  return json({ users })
}
