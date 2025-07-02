import { type NextRequest, NextResponse } from "next/server"
import { deleteCodeSnippet } from "@/lib/db"
import { getAuthUser } from "@/lib/middleware"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    await deleteCodeSnippet(id, user.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting snippet:", error)
    return NextResponse.json({ error: "Failed to delete snippet" }, { status: 500 })
  }
}
