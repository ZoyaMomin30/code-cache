"use client"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { Header } from "@/app/components/header"
import { CodeEditor } from "@/app/components/code-editor"
import { SearchSection } from "@/app/components/search-section"
import { SnippetsGrid } from "@/app/components/snippets-grid"
import { useToast } from "@/hooks/use-toast"
import type { CodeSnippet } from "@/lib/db"
import { useRouter } from "next/navigation"

export default function HomePage() {
  redirect("/login")
    // const router = useRouter()

  // useEffect(() => {
  //   router.replace("/login")
  // }, [router])

  const [snippets, setSnippets] = useState<CodeSnippet[]>([])
  const [filteredSnippets, setFilteredSnippets] = useState<CodeSnippet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchSnippets = async () => {
    try {
      const response = await fetch("/api/snippets")
      if (response.ok) {
        const data = await response.json()
        setSnippets(data)
        setFilteredSnippets(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load snippets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSnippets()
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
      <Header />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Code Editor Section */}
        <CodeEditor onCodeSaved={fetchSnippets} folders={[]}/>

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
              <div className="text-2xl font-bold text-green-600">{new Set(snippets.map((s) => s.language)).size}</div>
              <div className="text-sm text-gray-600">Languages</div>
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

























// "use client"

// import { useEffect, useState } from "react"
// import { Header } from "@/app/components/header"
// import { CodeEditor } from "@/app/components/code-editor"
// import { SearchSection } from "@/app/components/search-section"
// import { SnippetsGrid } from "@/app/components/snippets-grid"
// import { useToast } from "@/hooks/use-toast"

// import type { CodeSnippet } from "@/lib/db"

// export default function HomePage() {
//   const [snippets, setSnippets] = useState<CodeSnippet[]>([])
//   const [filteredSnippets, setFilteredSnippets] = useState<CodeSnippet[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const { toast } = useToast()

//   const fetchSnippets = async () => {
//     try {
//       const response = await fetch("/api/snippets")
//       if (response.ok) {
//         const data = await response.json()
//         setSnippets(data)
//         setFilteredSnippets(data)
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load snippets",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchSnippets()
//   }, [])

//   const handleSearch = (query: string) => {
//     if (!query.trim()) {
//       setFilteredSnippets(snippets)
//       return
//     }

//     const filtered = snippets.filter(
//       (snippet) =>
//         snippet.title.toLowerCase().includes(query.toLowerCase()) ||
//         snippet.description?.toLowerCase().includes(query.toLowerCase()) ||
//         snippet.code?.toLowerCase().includes(query.toLowerCase()),
//     )
//     setFilteredSnippets(filtered)
//   }

//   const handleSnippetDeleted = (id: number) => {
//     const updated = snippets.filter((snippet) => snippet.id !== id)
//     setSnippets(updated)
//     setFilteredSnippets(updated)
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">

//       <div
//         className="mx-auto w-[500px] bg-gray-950 rounded-xl overflow-hidden drop-shadow-xl"
//       >
//         <div className="bg-[#333] flex items-center p-[5px] text-whitec relative">
//           <div className="flex absolute left-3">
//             <span className="h-3.5 w-3.5 bg-[#ff605c] rounded-xl mr-2"></span>
//             <span className="h-3.5 w-3.5 bg-[#ffbd44] rounded-xl mr-2"></span>
//             <span className="h-3.5 w-3.5 bg-[#00ca4e] rounded-xl"></span>
//           </div>
//           <div className="flex-1 text-center text-white">status</div>
//         </div>
//         <div className="p-2.5 text-[#0f0]">
//           <div>
//             <span className="mr-2">Loading</span>
//             <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite]">.</span>
//             <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite]">.</span>
//             <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite]">.</span>
//           </div>
//         </div>
//       </div>

//         </div>
//       </div>
//     )
//   }

//   return (

    
//     <div className="min-h-screen bg-gray-50">
//       <Header />

//       <div className="container mx-auto px-4 py-8 space-y-8">
//         {/* Code Editor Section */}
//         <CodeEditor onCodeSaved={fetchSnippets} folders={[]}/>

//         {/* Search Section */}
//         <SearchSection onSearch={handleSearch} />

//         {/* Statistics */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="bg-white border border-gray-200 rounded-lg p-4">
//             <div className="text-2xl font-bold text-blue-600">{snippets.length}</div>
//             <div className="text-sm text-gray-600">Total Snippets</div>
//           </div>
//           <div className="bg-white border border-gray-200 rounded-lg p-4">
//             <div className="text-2xl font-bold text-green-600">{new Set(snippets.map((s) => s.language)).size}</div>
//             <div className="text-sm text-gray-600">Languages</div>
//           </div>
//           <div className="bg-white border border-gray-200 rounded-lg p-4">
//             <div className="text-2xl font-bold text-purple-600">{filteredSnippets.length}</div>
//             <div className="text-sm text-gray-600">Showing</div>
//           </div>
//         </div>

//         {/* Snippets Grid */}
//         <SnippetsGrid snippets={filteredSnippets} onSnippetDeleted={handleSnippetDeleted} />
    //   </div>
    // </div>
//   )
// }
