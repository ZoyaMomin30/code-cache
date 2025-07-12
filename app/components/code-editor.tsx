"use client"

import type React from "react"

import { useState } from "react"
import { Copy, Save, Share2, Upload } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Folder } from "@/lib/db"
import './../code-editor.css'

interface CodeEditorProps {
  folders: Folder[]
  onCodeSaved: () => void
}

export function CodeEditor({ folders, onCodeSaved }: CodeEditorProps) {
  const [code, setCode] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [folderId, setFolderId] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    if (!code.trim() || !title.trim()) {
      toast({
        title: "Error",
        description: "Please provide both title and code",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          code,
          language,
          description: description || `${language} code snippet`,
          folderId: folderId || null,
        }),
      })

      if (!response.ok) throw new Error("Failed to save")

      toast({
        title: "Success",
        description: "Code snippet saved successfully",
      })

      setCode("")
      setTitle("")
      setDescription("")
      setFolderId("")
      onCodeSaved()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save code snippet",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code)
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("text/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCode(content)
        setTitle(file.name.split(".")[0])
      }
      reader.readAsText(file)
    } else if (file && file.type.startsWith("image/")) {
      toast({
        title: "Image Upload",
        description: "Image uploaded successfully. Add your code below.",
      })
    }
  }

  return (

    <div className="max-w-3xl mx-auto ">
      <div className=" rounded-lg shadow-sm border border-[2px] border-purple-600 ">

        {/* Code Editor with macOS style */}
        <div className="bg-black border border-gray-800 rounded-lg m-6 hover:shadow-md transition">
          {/* macOS window controls */}
          <div className="flex items-center bg-black px-4 py-3 rounded-t-lg">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-gray-400 text-sm">{title || "untitled"}</span>
            </div>
            

            
            <div className="flex space-x-2">

            </div>
            
            
          </div>
          <p className="text-gray-300 p-3 boder-t border-b boder-white bg-black w-full text-sm mb-2">{description || "Add a description for your snippet"}</p>
        
          {/* Code area */}
          <div className="p-4">
            
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full h-64 bg-gray-900 border-none text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-0"

            />
          </div>
        </div>
        <div className="p-6 ">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Code Snippet</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="title" className="text-gray-700">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter snippet title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="language" className="text-gray-700">
                Language
              </Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="sql">SQL</option>
                <option value="sql">Other</option>

              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="folder" className="text-gray-700">
                Folder (Optional)
              </Label>
              <Select value={folderId} onValueChange={setFolderId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id.toString()}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>


            <div>
              <Label htmlFor="file-upload" className="text-gray-700">
                Upload File (Optional)
              </Label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  accept=".txt,.js,.ts,.py,.java,.cpp,.html,.css,.sql,image/*,.png,.jpg"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

          </div>

          <div className="mb-4">
            <Label htmlFor="description" className="text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this code does..."
              className="mt-1"
              rows={2}
            />
          </div>
        </div>

        {/* <div className="p-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <div className="flex justify-end space-x-2 ">
            <Button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="group relative inline-flex items-center justify-center text-base rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Snippet"}
            </Button>
          </div>
        </div> */}

          <div className="px-6 pb-4 flex justify-end">
        <div className="relative inline-flex items-center justify-center gap-4 group">
          <div className=" absolute inset-0 duration-1000 opacity-60 transitiona-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="group relative inline-flex items-center justify-center text-base rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Snippet"}
          </Button>
          </div>
          </div>

      </div>
    </div>






















//      <div className="max-w-2xl mx-auto">
//   <div className="p-6 ">
//     <h2 className="text-xl text-center font-semibold text-gray-900 mb-4">Create Code Snippet</h2>

//       {/* Mac-Style Preview Card */}
//   <div className="bg-black border border-gray-800 rounded-lg m-6 hover:shadow-md transition">
//     <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700">
//       <span className="w-3 h-3 bg-red-500 rounded-full"></span>
//       <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
//       <span className="w-3 h-3 bg-green-500 rounded-full"></span>
//       <div className="flex-1 text-center">
//         <span className="text-gray-400 text-sm">{title || "untitled"}</span>
//       </div>
//     </div>
//     <div className="p-4">
//       <p className="text-gray-300 text-sm mb-2">{description || "Add a description for your snippet"}</p>
//         <Textarea
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//           placeholder="// Paste your code here..."
//           className="w-full h-60 bg-gray-900 text-gray-100 font-mono text-xs rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//           style={{
//             whiteSpace: "pre-wrap",
//           }}
//         />

//     </div>
//   </div>



//     <div className="grid grid-cols-2 gap-4 mb-4">
//       <div>
//         <Label htmlFor="title" className="text-gray-700">
//           Title
//         </Label>
//         <Input
//           id="title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Enter Title"
//           className="mt-1"
//         />
//       </div>

//       <div>
//         <Label htmlFor="description" className="text-gray-700">
//           Description
//         </Label>
//         <Textarea
//           id="description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Brief description of your snippet"
//           className="mt-1"
//         />
//       </div>
//     </div>

//     {/* <div className="mb-4">
//       <Label htmlFor="file-upload" className="text-gray-700">
//         Upload Screenshot (Optional, max 2MB)
//       </Label>
//         <input
//           id="file-upload"
//           type="file"
//           accept="image/*"
//           onChange={(e) => {
//             const file = e.target.files?.[0];
//             if (file) {
//               if (file.size > 2 * 1024 * 1024) {
//                 alert('File size exceeds 2MB limit.');
//                 e.target.value = ""; // clear the input
//               } else {
//                 handleFileUpload(e);
//               }
//             }
//           }}
//   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// />

//     </div> */}

//   </div>



//   <div className="px-6 pb-4 flex justify-end">
//     {/* <Button
//       onClick={handleSave}
//       disabled={isSaving}
//       className="bg-blue-600 hover:bg-blue-700 text-white"
//     >
//       <Save className="h-4 w-4 mr-2" />
//       {isSaving ? "Saving..." : "Save Snippet"}
//     </Button> */}

//     <div className="relative inline-flex items-center justify-center gap-4 group">
//   <div
//     className="absolute inset-0 duration-1000 opacity-60 transitiona-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"
//   ></div>
//   <button 
//     onClick={handleSave}
//     disabled={isSaving}
//     className="group relative inline-flex items-center justify-center text-base rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
//     >
//       <Save className="h-4 w-4 mr-2" />
//       {isSaving ? "Saving..." : "Save Snippet"}
//   </button>
// </div>

//   </div>
// </div>






  )
}
