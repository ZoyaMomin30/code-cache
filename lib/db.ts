import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Folder {
  id: number
  name: string
  description: string | null
  user_id: number
  created_at: string
  updated_at: string
}

export interface CodeSnippet {
  id: number
  title: string
  description: string | null
  code: string | null
  language: string
  screenshot_url: string | null
  folder_id: number | null
  user_id: number
  created_at: string
  updated_at: string
  folder_name?: string | null
}

export async function getFoldersByUserId(userId: number): Promise<Folder[]> {
  const folders = await sql`SELECT * FROM folders WHERE user_id = ${userId} ORDER BY name ASC`
  return folders as Folder[]
}

export async function getCodeSnippetsByUserId(userId: number): Promise<CodeSnippet[]> {
  const snippets = await sql`
    SELECT 
      cs.*,
      f.name as folder_name
    FROM code_snippets cs
    LEFT JOIN folders f ON cs.folder_id = f.id
    WHERE cs.user_id = ${userId}
    ORDER BY cs.created_at DESC
  `
  return snippets as CodeSnippet[]
}

export async function createFolder(name: string, description: string | null, userId: number): Promise<Folder> {
  const [folder] = await sql`
    INSERT INTO folders (name, description, user_id)
    VALUES (${name}, ${description}, ${userId})
    RETURNING *
  `
  return folder as Folder
}

export async function createCodeSnippet(
  title: string,
  description: string | null,
  code: string | null,
  language: string,
  userId: number,
  folderId: number | null = null,
  screenshotUrl?: string,
): Promise<CodeSnippet> {
  const [snippet] = await sql`
    INSERT INTO code_snippets (title, description, code, language, user_id, folder_id, screenshot_url)
    VALUES (${title}, ${description}, ${code}, ${language}, ${userId}, ${folderId}, ${screenshotUrl || null})
    RETURNING *
  `
  return snippet as CodeSnippet
}

export async function deleteCodeSnippet(id: number, userId: number): Promise<void> {
  await sql`DELETE FROM code_snippets WHERE id = ${id} AND user_id = ${userId}`
}

export async function deleteFolder(id: number, userId: number): Promise<void> {
  await sql`DELETE FROM folders WHERE id = ${id} AND user_id = ${userId}`
}

export async function getCodeSnippetById(id: number): Promise<CodeSnippet | null> {
  const [snippet] = await sql`
    SELECT 
      cs.*,
      f.name as folder_name
    FROM code_snippets cs
    LEFT JOIN folders f ON cs.folder_id = f.id
    WHERE cs.id = ${id}
  `
  return (snippet as CodeSnippet) || null
}
