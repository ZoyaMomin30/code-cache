"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/app/components/ui/input"

interface SearchSectionProps {
  onSearch: (query: string) => void
}

export function SearchSection({ onSearch }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Code Snippets</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by title, description, or code content..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>
    </div>
  )
}
