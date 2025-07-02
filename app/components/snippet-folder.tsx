// "use client"

// import { Code2 } from "lucide-react"
// import { SnippetCard } from "./snippet-card"
// import type { CodeSnippet } from "@/lib/db"
// import type { Folder } from "@/lib/db"

// // // interface SnippetsGridProps {
// // //   snippets: CodeSnippet[]
// // //   onSnippetDeleted: (id: number) => void
// // // }

// // // interface SnippetsGridProps {
// // //   snippets: CodeSnippet[]
// // //   onSnippetDeleted: (id: number) => void
// // // }

// // // export function SnippetsFolder({ snippets, onSnippetDeleted }: SnippetsGridProps) {
// // //   if (snippets.length === 0) {
// // //     return (
// // //       <div className="max-w-4xl mx-auto">
// // //         <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
// // //           <Code2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
// // //           <h3 className="text-xl font-semibold mb-2 text-gray-600">No folders found</h3>
// // //           <p className="text-gray-500">Create your first code snippet above to get started</p>
// // //         </div>
// // //       </div>
// // //     )
// // //   }


// interface FoldersGridProps {
//   folders: Folder[]                    // ✅ make this an array of Folder
//   onSnippetDeleted: (id: number) => void
// }

// export function FoldersGrid({ folders, onSnippetDeleted }: FoldersGridProps) {
//   return (
//     <div className="space-y-8"> {/* adds vertical space between folders */}
//       {folders.map(folder => (
//         <div key={folder.id}>
//           <h2 className="text-xl font-semibold mb-4">{folder.name}</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {folder.snippets.map(snippet => (
//               <SnippetCard
//                 key={snippet.id}
//                 snippet={snippet}
//                 onDelete={onSnippetDeleted}
//               />
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

