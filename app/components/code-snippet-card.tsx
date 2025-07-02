"use client"

import { useState } from "react"
import { Copy, Trash2, ImageIcon, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { CodeSnippet } from "@/lib/db"

interface CodeSnippetCardProps {
  snippet: CodeSnippet
  onDelete: (id: number) => void
}

export function CodeSnippetCard({ snippet, onDelete }: CodeSnippetCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = async () => {
    if (snippet.code) {
      await navigator.clipboard.writeText(snippet.code)
      toast({
        title: "Copied!",
        description: "Code snippet copied to clipboard",
      })
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await fetch(`/api/snippets/${snippet.id}`, {
        method: "DELETE",
      })
      onDelete(snippet.id)
      toast({
        title: "Deleted",
        description: "Code snippet deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete snippet",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-white text-lg">{snippet.title}</CardTitle>
            {snippet.description && <CardDescription className="text-gray-400">{snippet.description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            {snippet.code && (
              <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-gray-400 hover:text-white">
                <Copy className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-gray-400 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-gray-800 text-gray-300">
            {snippet.language}
          </Badge>
          {snippet.file_name && (
            <Badge variant="outline" className="border-gray-700 text-gray-400">
              <FileText className="h-3 w-3 mr-1" />
              {snippet.file_name}
            </Badge>
          )}
          {snippet.screenshot_url && (
            <Badge variant="outline" className="border-gray-700 text-gray-400">
              <ImageIcon className="h-3 w-3 mr-1" />
              Screenshot
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {snippet.screenshot_url && (
          <div className="mb-4">
            <img
              src={snippet.screenshot_url || "/placeholder.svg"}
              alt="Code screenshot"
              className="w-full rounded-md border border-gray-700"
            />
          </div>
        )}
        {snippet.code && (
          <pre className="bg-gray-950 border border-gray-800 rounded-md p-4 overflow-x-auto">
            <code className="text-sm text-gray-300">{snippet.code}</code>
          </pre>
        )}
      </CardContent>
    </Card>
  )
}
