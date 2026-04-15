'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, X, Move, RotateCcw, Scale, Trash2, Copy, 
  Eye, Save, Star, Image, Palette, Layout, ChevronLeft,
  ChevronRight, ChevronDown, UploadCloud, Check, AlertCircle,
  Grid, Type, AlignLeft, AlignCenter, AlignRight, RefreshCw
} from 'lucide-react'

interface Asset {
  id: string
  name: string
  type: string
  category: string
  file_url: string
  file_type: string
  is_favorite: boolean
}

interface LogoElement {
  id: string
  assetId: string
  fileUrl: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  zIndex: number
}

interface TextElement {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontWeight: string
  color: string
  fontFamily: string
  textAlign: 'left' | 'center' | 'right'
}

interface TemplateContent {
  backgroundUrl?: string
  backgroundColor?: string
  backgroundType?: 'image' | 'color' | 'gradient'
  logos: LogoElement[]
  texts: TextElement[]
  qrCodePosition?: { x: number, y: number, size: number }
}

interface Template {
  id: string
  name: string
  category: string
  description?: string
  background_url?: string
  background_type?: string
  background_color?: string
  content_json?: TemplateContent
  is_default: boolean
  is_published: boolean
}

interface UploadResult {
  success: boolean
  asset?: Asset
  error?: string
}

interface TemplateEditorProps {
  template?: Template | null
  category: string
  onSave: (template: Partial<Template>) => void
  onClose: () => void
  assets: Asset[]
  onUploadAsset: (file: File, category?: string) => Promise<UploadResult>
}

export function TemplateEditor({ template, category, onSave, onClose, assets, onUploadAsset }: TemplateEditorProps) {
  const [activeTab, setActiveTab] = useState<'elements' | 'assets' | 'settings'>('elements')
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const [uploadingAsset, setUploadingAsset] = useState(false)
  const [localAssets, setLocalAssets] = useState<Asset[]>(assets)

  useEffect(() => {
    setLocalAssets(assets)
  }, [assets])

  const [content, setContent] = useState<TemplateContent>(template?.content_json || {
    backgroundColor: '#0f0f0f',
    backgroundType: 'color',
    logos: [],
    texts: [
      {
        id: 'title',
        text: 'CERTIFICATE OF PARTICIPATION',
        x: 50,
        y: 15,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#00CED1',
        fontFamily: 'serif',
        textAlign: 'center'
      },
      {
        id: 'subtitle',
        text: 'This is to certify that',
        x: 50,
        y: 28,
        fontSize: 14,
        fontWeight: 'normal',
        color: '#888888',
        fontFamily: 'sans-serif',
        textAlign: 'center'
      },
      {
        id: 'name',
        text: '{{name}}',
        x: 50,
        y: 40,
        fontSize: 36,
        fontWeight: 'bold',
        color: '#ffffff',
        fontFamily: 'cursive',
        textAlign: 'center'
      },
      {
        id: 'body',
        text: 'has successfully participated in',
        x: 50,
        y: 52,
        fontSize: 12,
        fontWeight: 'normal',
        color: '#888888',
        fontFamily: 'sans-serif',
        textAlign: 'center'
      },
      {
        id: 'event',
        text: 'TECHQUIZ 2026',
        x: 50,
        y: 60,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00CED1',
        fontFamily: 'sans-serif',
        textAlign: 'center'
      },
      {
        id: 'date',
        text: 'Date: {{date}}',
        x: 30,
        y: 85,
        fontSize: 10,
        fontWeight: 'normal',
        color: '#666666',
        fontFamily: 'sans-serif',
        textAlign: 'left'
      },
      {
        id: 'certId',
        text: 'Certificate ID: {{certificateId}}',
        x: 70,
        y: 85,
        fontSize: 10,
        fontWeight: 'normal',
        color: '#666666',
        fontFamily: 'monospace',
        textAlign: 'right'
      }
    ],
    qrCodePosition: { x: 90, y: 85, size: 40 }
  })

  const [templateName, setTemplateName] = useState(template?.name || `New ${category} Template`)
  const [isPublished, setIsPublished] = useState(template?.is_published || false)
  const [isDefault, setIsDefault] = useState(template?.is_default || false)

  const logoAssets = localAssets.filter((a: Asset) => a.type === 'logo' || a.type === 'sponsor')
  const backgroundAssets = localAssets.filter((a: Asset) => a.type === 'background')

  const handleAddLogo = (asset: Asset) => {
    const newLogo: LogoElement = {
      id: `logo-${Date.now()}`,
      assetId: asset.id,
      fileUrl: asset.file_url,
      x: 30,
      y: 10,
      width: 100,
      height: 50,
      rotation: 0,
      opacity: 1,
      zIndex: content.logos.length + 1
    }
    setContent({ ...content, logos: [...content.logos, newLogo] })
    setSelectedElement(newLogo.id)
  }

  const handleAddText = () => {
    const newText: TextElement = {
      id: `text-${Date.now()}`,
      text: 'New Text',
      x: 50,
      y: 50,
      fontSize: 16,
      fontWeight: 'normal',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      textAlign: 'center'
    }
    setContent({ ...content, texts: [...content.texts, newText] })
    setSelectedElement(newText.id)
  }

  const handleElementDrag = (elementId: string, e: React.MouseEvent) => {
    e.preventDefault()
    setSelectedElement(elementId)
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !selectedElement || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    if (selectedElement.startsWith('logo-')) {
      setContent(prev => ({
        ...prev,
        logos: prev.logos.map(l => 
          l.id === selectedElement ? { ...l, x: Math.max(0, Math.min(95, x - l.width/2)), y: Math.max(0, Math.min(95, y - l.height/2)) } : l
        )
      }))
    } else if (selectedElement.startsWith('text-')) {
      setContent(prev => ({
        ...prev,
        texts: prev.texts.map(t => 
          t.id === selectedElement ? { ...t, x: Math.max(0, Math.min(95, x)), y: Math.max(0, Math.min(95, y)) } : t
        )
      }))
    }
  }, [isDragging, selectedElement])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  const updateSelectedElement = (updates: any) => {
    if (!selectedElement) return
    
    if (selectedElement.startsWith('logo-')) {
      setContent(prev => ({
        ...prev,
        logos: prev.logos.map(l => l.id === selectedElement ? { ...l, ...updates } : l)
      }))
    } else if (selectedElement.startsWith('text-')) {
      setContent(prev => ({
        ...prev,
        texts: prev.texts.map(t => t.id === selectedElement ? { ...t, ...updates } : t)
      }))
    }
  }

  const deleteSelectedElement = () => {
    if (!selectedElement) return

    if (selectedElement.startsWith('logo-')) {
      setContent(prev => ({
        ...prev,
        logos: prev.logos.filter(l => l.id !== selectedElement)
      }))
    } else if (selectedElement.startsWith('text-')) {
      setContent(prev => ({
        ...prev,
        texts: prev.texts.filter(t => t.id !== selectedElement)
      }))
    }
    setSelectedElement(null)
  }

  const duplicateSelectedElement = () => {
    if (!selectedElement) return

    if (selectedElement.startsWith('logo-')) {
      const logo = content.logos.find(l => l.id === selectedElement)
      if (logo) {
        const newLogo = { ...logo, id: `logo-${Date.now()}`, x: logo.x + 5, y: logo.y + 5 }
        setContent(prev => ({ ...prev, logos: [...prev.logos, newLogo] }))
        setSelectedElement(newLogo.id)
      }
    } else if (selectedElement.startsWith('text-')) {
      const text = content.texts.find(t => t.id === selectedElement)
      if (text) {
        const newText = { ...text, id: `text-${Date.now()}`, x: text.x + 5, y: text.y + 5 }
        setContent(prev => ({ ...prev, texts: [...prev.texts, newText] }))
        setSelectedElement(newText.id)
      }
    }
  }

  const handleSave = () => {
    onSave({
      name: templateName,
      category,
      content_json: content,
      is_published: isPublished,
      is_default: isDefault,
      background_type: content.backgroundType,
      background_color: content.backgroundColor,
      background_url: content.backgroundUrl
    })
  }

  const selectedLogo = content.logos.find(l => l.id === selectedElement)
  const selectedText = content.texts.find(t => t.id === selectedElement)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex"
    >
      {/* Left Sidebar - Elements & Assets */}
      <div className="w-72 border-r border-cyan-500/20 flex flex-col">
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
          <h3 className="text-white font-semibold">Template Editor</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-cyan-500/20 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-cyan-500/20">
          <button
            onClick={() => setActiveTab('elements')}
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'elements' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}
          >
            <Layout className="w-4 h-4 inline mr-1" /> Elements
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'assets' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}
          >
            <Image className="w-4 h-4 inline mr-1" /> Assets
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 text-sm font-medium ${activeTab === 'settings' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}
          >
            <Palette className="w-4 h-4 inline mr-1" /> Settings
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'elements' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">ADD ELEMENTS</p>
                <button
                  onClick={handleAddText}
                  className="w-full py-2 px-3 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm hover:bg-cyan-500/20 flex items-center gap-2"
                >
                  <Type className="w-4 h-4" /> Add Text
                </button>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">LOGO ASSETS (drag to canvas)</p>
                <div className="grid grid-cols-2 gap-2">
                  {logoAssets.map(asset => (
                    <div
                      key={asset.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('assetId', asset.id)
                      }}
                      className="p-2 rounded bg-gray-800/50 border border-cyan-500/20 hover:border-cyan-500/50 cursor-pointer"
                    >
                      <img src={asset.file_url} alt={asset.name} className="w-full h-12 object-contain mb-1" />
                      <p className="text-xs text-gray-400 truncate">{asset.name}</p>
                    </div>
                  ))}
                  {logoAssets.length === 0 && (
                    <p className="col-span-2 text-xs text-gray-500 text-center py-4">No logos uploaded</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">TEXT ELEMENTS</p>
                {content.texts.map(text => (
                  <div
                    key={text.id}
                    onClick={() => setSelectedElement(text.id)}
                    className={`p-2 rounded mb-1 cursor-pointer text-sm ${selectedElement === text.id ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-gray-800/30 border border-transparent'}`}
                  >
                    {text.text.substring(0, 20)}...
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">UPLOAD NEW</p>
                <div className="space-y-2">
                  <select
                    id="asset-category-select"
                    className="w-full px-2 py-1.5 rounded bg-black/50 border border-cyan-500/30 text-white text-xs"
                    defaultValue="logo"
                  >
                    <option value="logo">Logo</option>
                    <option value="sponsor">Sponsor Logo</option>
                    <option value="background">Background</option>
                    <option value="badge">Badge</option>
                    <option value="seal">Seal</option>
                  </select>
                  <div
                    className="w-full py-3 px-4 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm hover:bg-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    onClick={() => document.getElementById('asset-upload-input')?.click()}
                  >
                    {uploadingAsset ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <UploadCloud className="w-4 h-4" />
                    )} 
                    {uploadingAsset ? 'Uploading...' : 'Upload Logo/Image'}
                  </div>
                  <input
                    id="asset-upload-input"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      
                      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
                      if (!allowedTypes.includes(file.type)) {
                        alert('Invalid file type. Allowed: PNG, JPG, JPEG, WEBP, SVG')
                        return
                      }
                      
                      if (file.size > 5 * 1024 * 1024) {
                        alert('File too large. Max 5MB allowed.')
                        return
                      }
                      
                      const categorySelect = document.getElementById('asset-category-select') as HTMLSelectElement
                      const assetCategory = categorySelect?.value || 'logo'
                      
                      setUploadingAsset(true)
                      try {
                        const result = await onUploadAsset(file, assetCategory)
                        if (result.success && result.asset) {
                          setLocalAssets([result.asset, ...localAssets])
                          alert('Asset uploaded successfully!')
                        } else {
                          alert(result.error || 'Failed to upload')
                        }
                      } catch (err) {
                        alert('Upload failed')
                      } finally {
                        setUploadingAsset(false)
                        e.target.value = ''
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">LOGOS ({localAssets.length})</p>
                {localAssets.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">No logos or images uploaded yet</p>
                ) : (
                  <div className="space-y-2">
                    {localAssets.map(asset => (
                      <div
                        key={asset.id}
                        onClick={() => handleAddLogo(asset)}
                        className="flex items-center gap-2 p-2 rounded bg-gray-800/30 hover:bg-cyan-500/10 cursor-pointer border border-transparent hover:border-cyan-500/30"
                      >
                        <div className="w-10 h-10 rounded bg-black/30 flex items-center justify-center overflow-hidden">
                          <img src={asset.file_url} alt={asset.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{asset.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{asset.category}</p>
                        </div>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation()
                            if (confirm('Delete this asset?')) {
                              try {
                                await fetch(`/api/certificates/assets/${asset.id}`, { method: 'DELETE' })
                                setLocalAssets(localAssets.filter(a => a.id !== asset.id))
                              } catch (err) {
                                console.error('Delete failed')
                              }
                            }
                          }}
                          className="p-1 text-gray-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">TEMPLATE NAME</p>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/50 border border-cyan-500/30 text-white text-sm"
                />
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">BACKGROUND</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="radio"
                      name="bgType"
                      checked={content.backgroundType === 'color'}
                      onChange={() => setContent({ ...content, backgroundType: 'color' })}
                    />
                    Solid Color
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="radio"
                      name="bgType"
                      checked={content.backgroundType === 'gradient'}
                      onChange={() => setContent({ ...content, backgroundType: 'gradient' })}
                    />
                    Gradient
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="radio"
                      name="bgType"
                      checked={content.backgroundType === 'image'}
                      onChange={() => setContent({ ...content, backgroundType: 'image' })}
                    />
                    Background Image
                  </label>
                </div>

                {content.backgroundType === 'color' && (
                  <input
                    type="color"
                    value={content.backgroundColor || '#0f0f0f'}
                    onChange={(e) => setContent({ ...content, backgroundColor: e.target.value })}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                )}
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-300">Publish Template</span>
                <button
                  onClick={() => setIsPublished(!isPublished)}
                  className={`w-12 h-6 rounded-full transition-colors ${isPublished ? 'bg-cyan-500' : 'bg-gray-700'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${isPublished ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-300">Set as Default</span>
                <button
                  onClick={() => setIsDefault(!isDefault)}
                  className={`w-12 h-6 rounded-full transition-colors ${isDefault ? 'bg-yellow-500' : 'bg-gray-700'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${isDefault ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-8 flex items-center justify-center overflow-hidden">
          <div
            ref={canvasRef}
            className="relative w-[600px] h-[850px] bg-gray-900 border-2 border-cyan-500/30 rounded-lg shadow-2xl overflow-hidden"
            style={{
              background: content.backgroundType === 'color' 
                ? content.backgroundColor 
                : content.backgroundType === 'gradient'
                ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                : content.backgroundUrl 
                ? `url(${content.backgroundUrl}) center/cover` 
                : '#0f0f0f'
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const assetId = e.dataTransfer.getData('assetId')
              const asset = assets.find(a => a.id === assetId)
              if (asset) {
                const rect = canvasRef.current?.getBoundingClientRect()
                if (rect) {
                  const x = ((e.clientX - rect.left) / rect.width) * 100
                  const y = ((e.clientY - rect.top) / rect.height) * 100
                  const newLogo: LogoElement = {
                    id: `logo-${Date.now()}`,
                    assetId: asset.id,
                    fileUrl: asset.file_url,
                    x: x - 5,
                    y: y - 5,
                    width: 80,
                    height: 40,
                    rotation: 0,
                    opacity: 1,
                    zIndex: content.logos.length + 1
                  }
                  setContent({ ...content, logos: [...content.logos, newLogo] })
                  setSelectedElement(newLogo.id)
                }
              }
            }}
          >
            {/* Render Text Elements */}
            {content.texts.map(text => (
              <div
                key={text.id}
                onMouseDown={(e) => handleElementDrag(text.id, e)}
                className={`absolute cursor-move ${selectedElement === text.id ? 'ring-2 ring-cyan-400' : ''}`}
                style={{
                  left: `${text.x}%`,
                  top: `${text.y}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: `${text.fontSize}px`,
                  fontWeight: text.fontWeight,
                  color: text.color,
                  fontFamily: text.fontFamily,
                  textAlign: text.textAlign
                }}
                onClick={() => setSelectedElement(text.id)}
              >
                {text.text}
              </div>
            ))}

            {/* Render Logo Elements */}
            {content.logos.map(logo => (
              <img
                key={logo.id}
                src={logo.fileUrl}
                alt="Logo"
                onMouseDown={(e) => handleElementDrag(logo.id, e)}
                className={`absolute cursor-move ${selectedElement === logo.id ? 'ring-2 ring-cyan-400' : ''}`}
                style={{
                  left: `${logo.x}%`,
                  top: `${logo.y}%`,
                  width: `${logo.width}%`,
                  height: `${logo.height}%`,
                  transform: `translate(-50%, -50%) rotate(${logo.rotation}deg)`,
                  opacity: logo.opacity,
                  zIndex: logo.zIndex
                }}
                onClick={() => setSelectedElement(logo.id)}
              />
            ))}

            {/* QR Code Placeholder */}
            {content.qrCodePosition && (
              <div
                className={`absolute flex items-center justify-center bg-gray-800 border-2 border-dashed border-gray-600 ${selectedElement === 'qr' ? 'ring-2 ring-cyan-400' : ''}`}
                style={{
                  left: `${content.qrCodePosition.x}%`,
                  top: `${content.qrCodePosition.y}%`,
                  width: `${content.qrCodePosition.size}%`,
                  height: `${content.qrCodePosition.size}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedElement('qr')}
              >
                <span className="text-xs text-gray-500">QR</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-cyan-500/20 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-400 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Template
          </button>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-72 border-l border-cyan-500/20 p-4">
        <h4 className="text-white font-medium mb-4">Properties</h4>

        {selectedElement?.startsWith('logo-') && selectedLogo && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Width (%)</p>
              <input
                type="range"
                min="5"
                max="50"
                value={selectedLogo.width}
                onChange={(e) => updateSelectedElement({ width: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Height (%)</p>
              <input
                type="range"
                min="5"
                max="50"
                value={selectedLogo.height}
                onChange={(e) => updateSelectedElement({ height: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Opacity</p>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedLogo.opacity}
                onChange={(e) => updateSelectedElement({ opacity: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={duplicateSelectedElement}
                className="flex-1 py-2 rounded bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 flex items-center justify-center gap-1"
              >
                <Copy className="w-4 h-4" /> Duplicate
              </button>
              <button
                onClick={deleteSelectedElement}
                className="flex-1 py-2 rounded bg-red-500/20 text-red-300 text-sm hover:bg-red-500/30 flex items-center justify-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        )}

        {selectedElement?.startsWith('text-') && selectedText && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Text Content</p>
              <textarea
                value={selectedText.text}
                onChange={(e) => updateSelectedElement({ text: e.target.value })}
                className="w-full px-3 py-2 rounded bg-black/50 border border-cyan-500/30 text-white text-sm"
                rows={2}
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Font Size</p>
              <input
                type="range"
                min="8"
                max="72"
                value={selectedText.fontSize}
                onChange={(e) => updateSelectedElement({ fontSize: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Text Color</p>
              <input
                type="color"
                value={selectedText.color}
                onChange={(e) => updateSelectedElement({ color: e.target.value })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Font Weight</p>
              <select
                value={selectedText.fontWeight}
                onChange={(e) => updateSelectedElement({ fontWeight: e.target.value })}
                className="w-full px-3 py-2 rounded bg-black/50 border border-cyan-500/30 text-white text-sm"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="lighter">Light</option>
              </select>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Text Align</p>
              <div className="flex gap-1">
                <button onClick={() => updateSelectedElement({ textAlign: 'left' })} className={`p-2 rounded ${selectedText.textAlign === 'left' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-400'}`}>
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button onClick={() => updateSelectedElement({ textAlign: 'center' })} className={`p-2 rounded ${selectedText.textAlign === 'center' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-400'}`}>
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button onClick={() => updateSelectedElement({ textAlign: 'right' })} className={`p-2 rounded ${selectedText.textAlign === 'right' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-400'}`}>
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={duplicateSelectedElement}
                className="flex-1 py-2 rounded bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 flex items-center justify-center gap-1"
              >
                <Copy className="w-4 h-4" /> Duplicate
              </button>
              <button
                onClick={deleteSelectedElement}
                className="flex-1 py-2 rounded bg-red-500/20 text-red-300 text-sm hover:bg-red-500/30 flex items-center justify-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        )}

        {!selectedElement && (
          <p className="text-gray-500 text-sm">Select an element to edit its properties</p>
        )}
      </div>
    </motion.div>
  )
}