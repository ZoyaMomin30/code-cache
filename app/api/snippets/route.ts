import { type NextRequest, NextResponse } from "next/server"
import { getCodeSnippetsByUserId, createCodeSnippet } from "@/lib/db"
import { getAuthUser } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const snippets = await getCodeSnippetsByUserId(user.id)
    return NextResponse.json(snippets)
  } catch (error) {
    console.error("Error fetching snippets:", error)
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, code, language, folderId } = await request.json()

    if (!title || !code) {
      return NextResponse.json({ error: "Title and code are required" }, { status: 400 })
    }

    const snippet = await createCodeSnippet(
      title,
      description || null,
      code,
      language || "javascript",
      user.id,
      folderId ? Number.parseInt(folderId) : null,
    )

    return NextResponse.json(snippet)
  } catch (error) {
    console.error("Error creating snippet:", error)
    return NextResponse.json({ error: "Failed to create snippet" }, { status: 500 })
  }
}
