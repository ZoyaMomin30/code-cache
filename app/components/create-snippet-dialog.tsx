"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Upload } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { File } from "@/lib/db"

interface CreateSnippetDialogProps {
  files: File[]
  onSnippetCreated: () => void
}

export function CreateSnippetDialog({ files, onSnippetCreated }: CreateSnippetDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    language: "javascript",
    fileId: "",
  })
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const { toast } = useToast()

  const languages = [
    "javascript",
    "typescript",
    "python",
    "java",
    "cpp",
    "c",
    "csharp",
    "php",
    "ruby",
    "go",
    "rust",
    "swift",
    "kotlin",
    "html",
    "css",
    "sql",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.code.trim() && !screenshot) {
      toast({
        title: "Error",
        description: "Either code or screenshot is required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("code", formData.code)
      formDataToSend.append("language", formData.language)
      formDataToSend.append("fileId", formData.fileId)
      if (screenshot) {
        formDataToSend.append("screenshot", screenshot)
      }

      const response = await fetch("/api/snippets", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to create snippet")
      }

      toast({
        title: "Success",
        description: "Code snippet created successfully",
      })

      setFormData({
        title: "",
        description: "",
        code: "",
        language: "javascript",
        fileId: "",
      })
      setScreenshot(null)
      setOpen(false)
      onSnippetCreated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create snippet",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setScreenshot(file)
    } else {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Snippet
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Code Snippet</DialogTitle>
          <DialogDescription className="text-gray-400">Add a new code snippet to your collection</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-800 border-gray-700"
                placeholder="Enter snippet title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang} className="text-white">
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File (Optional)</Label>
            <Select value={formData.fileId} onValueChange={(value) => setFormData({ ...formData, fileId: value })}>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select a file" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {files.map((file) => (
                  <SelectItem key={file.id} value={file.id.toString()} className="text-white">
                    {file.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-800 border-gray-700"
              placeholder="Describe what this snippet does"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Textarea
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="bg-gray-800 border-gray-700 font-mono text-sm"
              placeholder="Paste your code here..."
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenshot">Screenshot (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-gray-800 border-gray-700"
              />
              <Button type="button" variant="outline" className="border-gray-700 bg-transparent">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {screenshot && <p className="text-sm text-gray-400">Selected: {screenshot.name}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-gray-700">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? "Creating..." : "Create Snippet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
