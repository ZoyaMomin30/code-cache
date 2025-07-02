"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { CodeEditor } from "@/app/components/code-editor"
import { SearchSection } from "@/app/components/search-section"
import { SnippetsGrid } from "@/app/components/snippets-grid"
import { CreateFolderDialog } from "@/app/components/create-folder-dialog"
import { useToast } from "@/hooks/use-toast"
import type { CodeSnippet, Folder } from "@/lib/db"


export default function DashboardPage() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [filteredSnippets, setFilteredSnippets] = useState<CodeSnippet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const fetchData = async () => {
    try {
      const [snippetsRes, foldersRes] = await Promise.all([fetch("/api/snippets"), fetch("/api/folders")])

      if (snippetsRes.status === 401 || foldersRes.status === 401) {
        router.push("/login")
        return
      }

      if (snippetsRes.ok) {
        const snippetsData = await snippetsRes.json()
        setSnippets(snippetsData)
        setFilteredSnippets(snippetsData)
      }

      if (foldersRes.ok) {
        const foldersData = await foldersRes.json()
        setFolders(foldersData)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredSnippets(snippets)
      return
    }

    const filtered = snippets.filter(
      (snippet) =>
        snippet.title.toLowerCase().includes(query.toLowerCase()) ||
        snippet.description?.toLowerCase().includes(query.toLowerCase()) ||
        snippet.code?.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredSnippets(filtered)
  }

  const handleSnippetDeleted = (id: number) => {
    const updated = snippets.filter((snippet) => snippet.id !== id)
    setSnippets(updated)
    setFilteredSnippets(updated)
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">

      <div
        className="mx-auto w-[500px] bg-gray-950 rounded-xl overflow-hidden drop-shadow-xl"
      >
        <div className="bg-[#333] flex items-center p-[5px] text-whitec relative">
          <div className="flex absolute left-3">
            <span className="h-3.5 w-3.5 bg-[#ff605c] rounded-xl mr-2"></span>
            <span className="h-3.5 w-3.5 bg-[#ffbd44] rounded-xl mr-2"></span>
            <span className="h-3.5 w-3.5 bg-[#00ca4e] rounded-xl"></span>
          </div>
          <div className="flex-1 text-center text-white">status</div>
        </div>
        <div className="p-2.5 text-[#0f0]">
          <div>
            <span className="mr-2">Loading</span>
            <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite]">.</span>
            <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite]">.</span>
            <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite]">.</span>
          </div>
        </div>
      </div>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CodeCache</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreateFolderDialog onFolderCreated={fetchData} />
              <Button onClick={handleLogout} variant="outline" className="border-gray-300 bg-transparent">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Code Editor Section */}
        <CodeEditor folders={folders} onCodeSaved={fetchData} />

        {/* Search Section */}
        <SearchSection onSearch={handleSearch} />

        {/* Statistics */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{snippets.length}</div>
              <div className="text-sm text-gray-600">Total Snippets</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{folders.length}</div>
              <div className="text-sm text-gray-600">Folders</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{filteredSnippets.length}</div>
              <div className="text-sm text-gray-600">Showing</div>
            </div>
          </div>
        </div>

        {/* Snippets Grid */}
        <SnippetsGrid snippets={filteredSnippets} onSnippetDeleted={handleSnippetDeleted} />
      </div>
    </div>
  )
}
