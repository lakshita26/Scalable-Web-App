import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export interface UserRecord {
  id: number
  email: string
  username: string
  // store hashed password
  password: string
  full_name: string | null
  created_at: string
}

export const users: UserRecord[] = []

export interface TaskRecord {
  id: number
  user_id: number
  title: string
  description?: string
  completed: boolean
  created_at: string
}

export const tasks: TaskRecord[] = []

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret'
const JWT_EXPIRES_IN = '2h'

export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(plain, salt)
}

export async function verifyPassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed)
}

export function signTokenForUser(user: UserRecord) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function getUserFromToken(token?: string) {
  if (!token) return null
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub?: number }
    const id = payload.sub
    if (!id) return null
    return users.find((u) => u.id === id) || null
  } catch (e) {
    return null
  }
}

// Helper to return a safe user object (without password)
export function safeUser(user: UserRecord | null) {
  if (!user) return null
  const { password, ...rest } = user as any
  return rest
}
