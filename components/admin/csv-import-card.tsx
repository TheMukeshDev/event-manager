'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle, Loader2, ChevronDown } from 'lucide-react'

interface ParsedRecord {
  name: string
  email: string
  rank: number | null
  rawScore: string | null
  normalizedScore: number | null
  event: string
  certificateType: string
}

interface ImportPreview {
  total: number
  valid: number
  invalid: number
  records: ParsedRecord[]
  errors: string[]
  existingCount?: number
}

export function CsvImportCard({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<ImportPreview | null>(null)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updateMode, setUpdateMode] = useState(true) // Default: update existing records

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
      if (!files[0].name.toLowerCase().endsWith('.csv')) {
        setError('Only CSV files are allowed')
        return
      }
      await processFile(files[0])
    }
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      await processFile(files[0])
    }
  }

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile)
    setError(null)
    setUploading(true)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch('/api/admin/certificates/import', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()

      if (data.success) {
        setPreview(data.preview)
      } else {
        setError(data.error || 'Failed to parse CSV')
      }
    } catch (err) {
      setError('Failed to process file')
    } finally {
      setUploading(false)
    }
  }

  const handleConfirmImport = async () => {
    if (!preview || preview.valid === 0) return

    setImporting(true)
    try {
      const response = await fetch('/api/admin/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'import', data: { records: preview.records, mode: updateMode ? 'upsert' : 'skip' } })
      })
      const data = await response.json()

      if (data.success) {
        onComplete()
      } else {
        setError(data.error || 'Failed to import')
      }
    } catch (err) {
      setError('Failed to import records')
    } finally {
      setImporting(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setError(null)
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
        className="glass-dark rounded-xl p-6 w-full max-w-2xl border border-cyan-500/30 max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Import Participants from CSV</h3>
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
            <button onClick={() => setError(null)} className="ml-auto hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {!preview ? (
          <div
            className={`flex-1 min-h-[200px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-8 transition-colors ${
              dragActive 
                ? 'border-cyan-400 bg-cyan-500/10' 
                : 'border-cyan-500/30 hover:border-cyan-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploading ? (
              <>
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                <p className="text-gray-300 text-center">Processing CSV...</p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-cyan-400 mb-4" />
                <p className="text-gray-300 text-center mb-2">Drag and drop your CSV file here</p>
                <p className="text-gray-500 text-sm text-center mb-4">or click to browse</p>
                <label className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-400 cursor-pointer transition-colors">
                  <span className="text-sm font-medium">Select File</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-gray-500 text-xs mt-4 text-center">
                  From Unstop CSV, extracts: Candidate's Name, Candidate's Email, Rank, Effective Score
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 mb-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
              <FileSpreadsheet className="w-8 h-8 text-cyan-400" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{file?.name}</p>
                <p className="text-gray-400 text-xs">{preview.records.length} records ready to import</p>
              </div>
              <button onClick={handleReset} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-cyan-500/20">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={updateMode}
                  onChange={(e) => setUpdateMode(e.target.checked)}
                  className="w-4 h-4 rounded bg-cyan-500/20 border-cyan-500/50"
                />
                <span className="text-sm text-cyan-300">Update existing</span>
              </label>
              <span className="text-xs text-gray-400">
                {preview.existingCount || 0} existing records will be updated
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-white">{preview.total}</p>
                <p className="text-xs text-gray-400">Total Rows</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
                <p className="text-2xl font-bold text-green-400">{preview.valid}</p>
                <p className="text-xs text-green-300">New</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30 text-center">
                <p className="text-2xl font-bold text-red-400">{preview.invalid}</p>
                <p className="text-xs text-red-300">Invalid</p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30 text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {preview.records.filter((r: ParsedRecord) => 
                    preview.records.filter((x: ParsedRecord) => x.email === r.email).length > 1
                  ).length}
                </p>
                <p className="text-xs text-yellow-300">Duplicates</p>
              </div>
            </div>

            {preview.errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/30 max-h-32 overflow-y-auto">
                <p className="text-xs text-red-300 font-medium mb-2">Errors:</p>
                {preview.errors.slice(0, 10).map((err, i) => (
                  <p key={i} className="text-xs text-red-400">{err}</p>
                ))}
                {preview.errors.length > 10 && (
                  <p className="text-xs text-red-400">...and {preview.errors.length - 10} more</p>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto mb-4 border border-cyan-500/20 rounded-lg">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-900/90 backdrop-blur">
                  <tr className="border-b border-cyan-500/20">
                    <th className="text-left p-2 text-gray-400 font-medium">Name</th>
                    <th className="text-left p-2 text-gray-400 font-medium">Email</th>
                    <th className="text-left p-2 text-gray-400 font-medium">Rank</th>
                    <th className="text-left p-2 text-gray-400 font-medium">Score (Raw → Norm.)</th>
                    <th className="text-left p-2 text-gray-400 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.records.slice(0, 20).map((record, i) => (
                    <tr key={i} className="border-b border-cyan-500/10 hover:bg-cyan-500/5">
                      <td className="p-2 text-white truncate max-w-[150px]">{record.name}</td>
                      <td className="p-2 text-gray-300 truncate max-w-[200px]">{record.email}</td>
                      <td className="p-2 text-gray-300">{record.rank || '-'}</td>
                      <td className="p-2 text-gray-300">
                        {record.rawScore ? `${record.rawScore} → ${record.normalizedScore ?? 'N/A'}` : '-'}
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          record.certificateType === 'winner' ? 'bg-yellow-500/20 text-yellow-300' :
                          record.certificateType === 'runner-up' ? 'bg-purple-500/20 text-purple-300' :
                          record.certificateType === 'second-runner-up' ? 'bg-orange-500/20 text-orange-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {record.certificateType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.records.length > 20 && (
                <p className="p-2 text-center text-gray-500 text-xs">
                  Showing first 20 of {preview.records.length} records
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Choose Different File
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={importing || preview.valid === 0}
                className="flex-1 px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirm Import ({preview.valid} records)
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}