import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { tasks, getUserFromToken } from "../_data"

export const GET: RequestHandler = async ({ request }) => {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "")
  const user = getUserFromToken(token)
  if (!user) {
    return json({ error: "Unauthorized" }, { status: 401 })
  }

  const userTasks = tasks.filter((t) => t.user_id === user.id)
  return json(userTasks)
}

export const POST: RequestHandler = async ({ request }) => {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "")
  const user = getUserFromToken(token)
  if (!user) {
    return json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { title, description } = body

  if (!title) {
    return json({ error: "Title is required" }, { status: 400 })
  }

  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
    user_id: user.id,
    title,
    description: description || "",
    completed: false,
    created_at: new Date().toISOString(),
  }

  tasks.push(newTask)

  return json(newTask, { status: 201 })
}
