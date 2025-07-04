"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, User, Code } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { CodeEditor } from "@/app/components/code-editor"
import { SearchSection } from "@/app/components/search-section"
import { SnippetsGrid } from "@/app/components/snippets-grid"
import { CreateFolderDialog } from "@/app/components/create-folder-dialog"
import { SnippetModal } from "@/app/components/snippet-modal"
import { FolderView } from "@/app/components/folder-view"
import { useToast } from "@/hooks/use-toast"
import type { CodeSnippet, Folder } from "@/lib/db"


export default function DashboardPage() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [filteredSnippets, setFilteredSnippets] = useState<CodeSnippet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleSnippetClick = (snippet: CodeSnippet) => {
    setSelectedSnippet(snippet)
    setIsModalOpen(true)
  }

    const handleFolderDeleted = (id: number) => {
    const updatedFolders = folders.filter((folder) => folder.id !== id)
    setFolders(updatedFolders)
    // Also remove snippets from deleted folder
    const updatedSnippets = snippets.map((snippet) =>
      snippet.folder_id === id ? { ...snippet, folder_id: null, folder_name: null } : snippet,
    )
    setSnippets(updatedSnippets)
    setFilteredSnippets(updatedSnippets)
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
              <Code className="h-8 w-8 text-violet-900" />
              <div>
                <h1 className="text-2xl font-bold font-serif text-gray-900">CodeCache</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreateFolderDialog onFolderCreated={fetchData} />

              <Button onClick={handleLogout} variant="outline"
              className="relative cursor-pointer font-serif py-2 px-5 text-center font-barlow inline-flex justify-center text-base uppercase text-white rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4 focus:outline focus:outline-2 focus:outline-white focus:outline-offset-4 overflow-hidden">
            <span className="relative z-20 text-primary">Logout</span>
            <span className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/20 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out"></span>
            <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-primary absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0"></span>
            <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-primary absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0"></span>
            <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-primary absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0"></span>
            <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-primary absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0"></span>
          </Button>
              {/* <Button onClick={handleLogout} variant="outline" className="border-gray-300 bg-transparent">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Code Editor Section */}
        <CodeEditor folders={folders} onCodeSaved={fetchData} />

        {/* Search Section */}
        {/* <SearchSection onSearch={handleSearch} />  */}

        {/* Statistics */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-black rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-black">{snippets.length}</div>
              <div className="text-sm text-gray-600">Total Snippets</div>
            </div>
            <div className="bg-white border border-black rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-black">{folders.length}</div>
              <div className="text-sm text-gray-600">Folders</div>
            </div>
            <div className="bg-white border border-black rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-black">{filteredSnippets.length}</div>
              <div className="text-sm text-gray-600">Showing</div>
            </div>
          </div>
        </div>

        <h1 className="text-center font-bold text-5xl">Cached <span className="text-violet-800">Snippets</span> </h1>

        <FolderView
          folders={folders}
          snippets={filteredSnippets}
          onSnippetDeleted={handleSnippetDeleted}
          onFolderDeleted={handleFolderDeleted}
          onSnippetClick={handleSnippetClick}
        />
        <SnippetModal snippet={selectedSnippet} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        
      </div>
    </div>
  )
}
