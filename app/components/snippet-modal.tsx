"use client"
import { X, Copy, Share2, ExternalLink } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Dialog, DialogContent } from "@/app/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import type { CodeSnippet } from "@/lib/db"

interface SnippetModalProps {
  snippet: CodeSnippet | null
  isOpen: boolean
  onClose: () => void
}

export function SnippetModal({ snippet, isOpen, onClose }: SnippetModalProps) {
  const { toast } = useToast()

  if (!snippet) return null

  const copyToClipboard = async () => {
    if (snippet.code) {
      await navigator.clipboard.writeText(snippet.code)
      toast({
        title: "Copied!",
        description: "Code snippet copied to clipboard",
      })
    }
  }

  const shareSnippet = async () => {
    const shareUrl = `${window.location.origin}/snippet/${snippet.id}`
    await navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Link Copied!",
      description: "Share link copied to clipboard",
    })
  }

  const openScreenshot = () => {
    if (snippet.screenshot_url) {
      window.open(snippet.screenshot_url, "_blank")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{snippet.title}</h2>
              {snippet.description && <p className="text-gray-600 mt-1">{snippet.description}</p>}
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{snippet.language}</span>
                {snippet.folder_name && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{snippet.folder_name}</span>
                )}
                <span className="text-xs text-gray-500">{new Date(snippet.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {snippet.code && (
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={shareSnippet}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              {/* <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button> */}
            </div>
          </div>

          {/* Screenshot */}
          {snippet.screenshot_url && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Screenshot</h3>
                <Button variant="outline" size="sm" onClick={openScreenshot}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Full Size
                </Button>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={snippet.screenshot_url || "/placeholder.svg"}
                  alt="Code screenshot"
                  className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={openScreenshot}
                />
              </div>
            </div>
          )}

          {/* Code */}
          {snippet.code && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Code</h3>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                {/* macOS window controls */}
                <div className="flex items-center px-4 py-2 bg-gray-800">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-gray-400 text-sm">{snippet.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="text-gray-400 hover:text-white h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                {/* Code content */}
                <div className="p-6">
                  <pre className="text-sm text-gray-100 overflow-x-auto whitespace-pre-wrap">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
