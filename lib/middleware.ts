import type { NextRequest } from "next/server"
import { verifyToken, getUserById } from "./auth"

export async function getAuthUser(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return null
  }

  const payload = verifyToken(token)
  if (!payload) {
    return null
  }

  const user = await getUserById(payload.userId)
  return user
}
