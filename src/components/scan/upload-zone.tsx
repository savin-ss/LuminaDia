"use client"

import { useCallback, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, Eye, Image as ImageIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
}

export function UploadZone({ onFileSelected }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true)
    else if (e.type === "dragleave") setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) onFileSelected(file)
    }
  }, [onFileSelected])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0])
    }
  }, [onFileSelected])

  return (
    <Card 
      className={`relative overflow-hidden border-2 border-dashed transition-all duration-300 ${
        isDragging 
          ? "border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(37,99,235,0.2)]" 
          : "border-muted-foreground/25 hover:border-blue-500/50 hover:bg-muted/50"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <motion.div
          animate={{ 
            scale: isDragging ? 1.1 : 1,
            y: isDragging ? -10 : 0
          }}
          className="mb-6 rounded-full bg-blue-500/10 p-6 text-blue-500"
        >
          {isDragging ? <UploadCloud className="h-10 w-10" /> : <Eye className="h-10 w-10" />}
        </motion.div>
        
        <h3 className="mb-2 text-2xl font-semibold">
          Drag & Drop Iris Image
        </h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          Supported formats: JPEG, PNG. Max file size: 10MB. High resolution images yield better analysis.
        </p>
        
        <div className="flex items-center gap-2 text-sm font-medium text-blue-500 bg-blue-500/10 px-4 py-2 rounded-full pointer-events-none">
          <ImageIcon className="h-4 w-4" />
          Click to browse files
        </div>
      </div>
    </Card>
  )
}
