import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

const mockTasks = [
  {
    id: 1,
    user_id: 1,
    title: "Setup project",
    description: "Initialize the project structure",
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    title: "Build authentication",
    description: "Create login and signup pages",
    completed: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    title: "Create dashboard",
    description: "Build task management dashboard",
    completed: false,
    created_at: new Date().toISOString(),
  },
]

export const PATCH: RequestHandler = async ({ request, params }) => {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "")

  if (!token) {
    return json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const taskId = Number.parseInt(params.id!)
  const task = mockTasks.find((t) => t.id === taskId)

  if (!task) {
    return json({ error: "Task not found" }, { status: 404 })
  }

  if (body.title !== undefined) task.title = body.title
  if (body.description !== undefined) task.description = body.description
  if (body.completed !== undefined) task.completed = body.completed

  return json(task)
}

export const DELETE: RequestHandler = async ({ request, params }) => {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "")

  if (!token) {
    return json({ error: "Unauthorized" }, { status: 401 })
  }

  const taskId = Number.parseInt(params.id!)
  const index = mockTasks.findIndex((t) => t.id === taskId)

  if (index === -1) {
    return json({ error: "Task not found" }, { status: 404 })
  }

  mockTasks.splice(index, 1)

  return json({ success: true })
}
