"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, FolderIcon, FolderOpen, Trash2 } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { SnippetCard } from "./snippet-card"
import { useToast } from "@/hooks/use-toast"
import type { Folder, CodeSnippet } from "@/lib/db"

interface FolderViewProps {
  folders: Folder[]
  snippets: CodeSnippet[]
  onSnippetDeleted: (id: number) => void
  onFolderDeleted: (id: number) => void
  onSnippetClick: (snippet: CodeSnippet) => void
}

export function FolderView({ folders, snippets, onSnippetDeleted, onFolderDeleted, onSnippetClick }: FolderViewProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set())
  const { toast } = useToast()

  const toggleFolder = (folderId: number) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const handleDeleteFolder = async (folderId: number) => {
    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onFolderDeleted(folderId)
        toast({
          title: "Success",
          description: "Folder deleted successfully",
        })
      } else {
        throw new Error("Failed to delete folder")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete folder",
        variant: "destructive",
      })
    }
  }

  // Group snippets by folder
  const snippetsByFolder = snippets.reduce(
    (acc, snippet) => {
      const folderId = snippet.folder_id || 0 // 0 for uncategorized
      if (!acc[folderId]) {
        acc[folderId] = []
      }
      acc[folderId].push(snippet)
      return acc
    },
    {} as Record<number, CodeSnippet[]>,
  )

  // Get uncategorized snippets
  const uncategorizedSnippets = snippetsByFolder[0] || []

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Uncategorized Snippets */}
      {uncategorizedSnippets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FolderIcon className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-700">Uncategorized</h3>
            <span className="text-sm text-gray-500">({uncategorizedSnippets.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-6">
            {uncategorizedSnippets.map((snippet) => (
              <div key={snippet.id} onClick={() => onSnippetClick(snippet)}>
                <SnippetCard snippet={snippet} onDelete={onSnippetDeleted} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Folders with Snippets */}
      {folders.map((folder) => {
        const folderSnippets = snippetsByFolder[folder.id] || []
        const isExpanded = expandedFolders.has(folder.id)

        return (
          <div key={folder.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleFolder(folder.id)}>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-violet-900" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-violet-900" />
                  )}
                  {isExpanded ? (
                    <FolderOpen className="h-5 w-5 text-violet-900" />
                  ) : (
                    <FolderIcon className="h-5 w-5 text-violet-900" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{folder.name}</h3>
                    {folder.description && <p className="text-sm text-gray-600">{folder.description}</p>}
                  </div>
                  <span className="text-sm text-gray-500 ml-auto mr-4">({folderSnippets.length} snippets)</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteFolder(folder.id)
                  }}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isExpanded && (
              <div className="p-4">
                {folderSnippets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {folderSnippets.map((snippet) => (
                      <div key={snippet.id} onClick={() => onSnippetClick(snippet)}>
                        <SnippetCard snippet={snippet} onDelete={onSnippetDeleted} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FolderIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No snippets in this folder yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {folders.length === 0 && uncategorizedSnippets.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <FolderIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2 text-gray-600">No folders or snippets yet</h3>
          <p className="text-gray-500">Create your first folder and snippet to get started</p>
        </div>
      )}
    </div>
  )
}
