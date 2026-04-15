'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileImage, FileText, X, CheckCircle, AlertCircle, Loader2, Trash2, Eye, Star } from 'lucide-react'

interface Template {
  id: string
  name: string
  category: string
  file_url: string
  file_type: string
  is_default: boolean
  uploaded_at: string
}

interface TemplateImportCardProps {
  onClose: () => void
  onComplete: () => void
}

export function TemplateImportCard({ onClose, onComplete }: TemplateImportCardProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('participation')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      await handleFileSelect(files[0])
    }
  }, [])

  const handleFileSelect = async (file: File) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf', 'text/html']
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Allowed: PNG, JPG, JPEG, WEBP, PDF, HTML')
      return
    }

    setSelectedFile(file)
    setError(null)
    
    // Create preview URL for images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
    
    // Auto-fill name from filename
    const baseName = file.name.replace(/\.[^/.]+$/, '')
    setName(baseName)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      await handleFileSelect(files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('name', name || selectedFile.name)
      formData.append('category', category)

      const response = await fetch('/api/certificates/templates', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()

      if (data.success) {
        onComplete()
      } else {
        setError(data.error || 'Failed to upload template')
      }
    } catch (err) {
      setError('Failed to upload template')
    } finally {
      setUploading(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setName('')
    setCategory('participation')
    setError(null)
  }

  const getFileIcon = () => {
    if (!selectedFile) return <FileImage className="w-12 h-12 text-cyan-400" />
    if (selectedFile.type === 'application/pdf') return <FileText className="w-12 h-12 text-red-400" />
    if (selectedFile.type === 'text/html') return <FileText className="w-12 h-12 text-orange-400" />
    return <FileImage className="w-12 h-12 text-cyan-400" />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-dark rounded-xl p-6 w-full max-w-lg border border-cyan-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Import Certificate Template</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-cyan-500/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/30 flex items-center gap-2 text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-8 transition-colors ${
              dragActive 
                ? 'border-cyan-400 bg-cyan-500/10' 
                : 'border-cyan-500/30 hover:border-cyan-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-cyan-400 mb-4" />
            <p className="text-gray-300 text-center mb-2">Drag and drop template file here</p>
            <p className="text-gray-500 text-sm text-center mb-4">or click to browse</p>
            <label className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-400 cursor-pointer transition-colors">
              <span className="text-sm font-medium">Select File</span>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.pdf,.html"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-gray-500 text-xs mt-4 text-center">
              Supported: PNG, JPG, JPEG, WEBP, PDF, HTML
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {previewUrl && (
              <div className="aspect-video bg-gray-900/50 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
              {getFileIcon()}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-gray-400 text-xs">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={handleReset} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-cyan-500/20">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Template Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter template name"
                className="w-full px-3 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:border-cyan-400 focus:outline-none text-sm"
              >
                <option value="excellence">Certificate of Excellence</option>
                <option value="appreciation">Certificate of Appreciation</option>
                <option value="participation">Certificate of Participation</option>
              </select>
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Import Template
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export function TemplateGallery({ onRefresh }: { onRefresh?: () => void }) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useState(() => {
    async function fetchTemplates() {
      try {
        const response = await fetch('/api/certificates/templates')
        const data = await response.json()
        setTemplates(data.templates || [])
      } catch (err) {
        setError('Failed to load templates')
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return
    
    try {
      await fetch(`/api/certificates/templates/${id}`, { method: 'DELETE' })
      setTemplates(templates.filter(t => t.id !== id))
    } catch (err) {
      console.error('Failed to delete template')
    }
  }

  const handleSetDefault = async (id: string, category: string) => {
    try {
      await fetch(`/api/certificates/templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_default: true, category })
      })
      setTemplates(templates.map(t => ({
        ...t,
        is_default: t.id === id
      })))
    } catch (err) {
      console.error('Failed to set default')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="text-center p-8 text-gray-400">
        <FileImage className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No certificate templates imported yet</p>
        <p className="text-sm mt-1">Upload a template from your device to start generating certificates</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {templates.map((template) => (
        <div key={template.id} className="glass-dark rounded-lg p-3 border border-cyan-500/20">
          <div className="aspect-[3/2] bg-gray-900/50 rounded mb-2 flex items-center justify-center overflow-hidden">
            {template.file_type === 'pdf' ? (
              <FileText className="w-8 h-8 text-red-400" />
            ) : template.file_type === 'html' ? (
              <FileText className="w-8 h-8 text-orange-400" />
            ) : (
              <img 
                src={template.file_url} 
                alt={template.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <p className="text-white text-sm font-medium truncate">{template.name}</p>
          <p className="text-gray-400 text-xs capitalize">{template.category}</p>
          <div className="flex items-center gap-2 mt-2">
            {template.is_default && (
              <span className="flex items-center gap-1 text-xs text-yellow-400">
                <Star className="w-3 h-3 fill-yellow-400" /> Default
              </span>
            )}
            {!template.is_default && (
              <button
                onClick={() => handleSetDefault(template.id, template.category)}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Set Default
              </button>
            )}
            <button
              onClick={() => handleDelete(template.id)}
              className="ml-auto text-xs text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}