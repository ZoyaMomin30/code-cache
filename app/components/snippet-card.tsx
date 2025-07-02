"use client"

import { useState } from "react"
import { Copy, Share2, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { CodeSnippet } from "@/lib/db"

interface SnippetCardProps {
  snippet: CodeSnippet
  onDelete: (id: number) => void
}

export function SnippetCard({ snippet, onDelete }: SnippetCardProps) {
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

  const shareSnippet = async () => {
    const shareUrl = `${window.location.origin}/snippet/${snippet.id}`
    await navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Link Copied!",
      description: "Share link copied to clipboard",
    })
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
    <div className="card w-full">
      <div className="mac-header">
        <div className="w-[100px]">
          <span className="red"></span>
          <span className="yellow"></span>
          <span className="green"></span>
        </div>
        <div className="card-actions">
          <button onClick={copyToClipboard} className="action-btn" title="Copy code">
            <Copy size={14} />
          </button>
          <button onClick={shareSnippet} className="action-btn" title="Share snippet">
            <Share2 size={14} />
          </button>
          <button onClick={handleDelete} disabled={isDeleting} className="action-btn delete-btn" title="Delete snippet">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <span className="card-title">{snippet.title}</span>
      <p className="card-description">{snippet.description || "A code snippet ready to use"}</p>
      <div className="card-tags">
        <span className="card-tag">{snippet.language.toUpperCase()}</span>
        <span className="card-tag">{new Date(snippet.created_at).toLocaleDateString()}</span>
      </div>
      <div className="code-editor">
        <pre>
          <code>{snippet.code}</code>
        </pre>

      </div>

      <div>
        <a href="snippet.screenshot_url" className="card-tag text-lg ">{snippet.title }</a>
      </div>

      <style jsx>{`
        .card {
          width: 100%;
          padding: 20px;
          border: 1px solid #0d1117;
          border-radius: 10px;
          background-color: #000;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .mac-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
          justify-content: space-between;
        }

        .mac-header span {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .mac-header .red {
          background-color: #ff5f57;
        }

        .mac-header .yellow {
          background-color: #ffbd2e;
        }

        .mac-header .green {
          background-color: #28c941;
        }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          background: transparent;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s;
        }

        .action-btn:hover {
          color: #e6e6ef;
        }

        .delete-btn:hover {
          color: #ff5f57;
        }

        .card-title {
          font-size: 18px;
          font-weight: bold;
          margin: 0 0 10px;
          color: #e6e6ef;
          display: block;
        }

        .card-description {
          font-size: 14px;
          color: #666;
          margin-bottom: 15px;
        }

        .card-tags {
          margin-bottom: 12px;
        }

        .card .card-tag {
          display: inline-block;
          font-size: 10px;
          border-radius: 5px;
          background-color: #0d1117;
          padding: 4px 8px;
          margin-right: 8px;
          color: #dcdcdc;
        }

        .code-editor {
          background-color: #0d1117;
          color: #dcdcdc;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", monospace;
          font-size: 14px;
          line-height: 1.5;
          border-radius: 5px;
          padding: 15px;
          overflow: auto;
          height: 150px;
          border: 1px solid #333;
        }

        .code-editor::-webkit-scrollbar {
          width: 8px;
        }

        .code-editor::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 4px;
        }

        .code-editor pre code {
          white-space: pre-wrap;
          display: block;
        }
      `}</style>
    </div>
  )
}
