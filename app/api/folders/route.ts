import { type NextRequest, NextResponse } from "next/server"
import { getFoldersByUserId, createFolder } from "@/lib/db"
import { getAuthUser } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const folders = await getFoldersByUserId(user.id)
    return NextResponse.json(folders)
  } catch (error) {
    console.error("Error fetching folders:", error)
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 })
    }

    const folder = await createFolder(name, description || null, user.id)
    return NextResponse.json(folder)
  } catch (error) {
    console.error("Error creating folder:", error)
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 })
  }
}
