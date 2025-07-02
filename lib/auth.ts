import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  id: number
  email: string
  name: string
  created_at: string
}

export interface AuthUser extends User {
  password_hash: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number }
  } catch {
    return null
  }
}

export async function createUser(email: string, password: string, name: string): Promise<User> {
  const passwordHash = await hashPassword(password)
  const [user] = await sql`
    INSERT INTO users (email, password_hash, name)
    VALUES (${email}, ${passwordHash}, ${name})
    RETURNING id, email, name, created_at
  `
  return user as User
}

export async function getUserByEmail(email: string): Promise<AuthUser | null> {
  const [user] = await sql`
    SELECT * FROM users WHERE email = ${email}
  `
  return (user as AuthUser) || null
}

export async function getUserById(id: number): Promise<User | null> {
  const [user] = await sql`
    SELECT id, email, name, created_at FROM users WHERE id = ${id}
  `
  return (user as User) || null
}
