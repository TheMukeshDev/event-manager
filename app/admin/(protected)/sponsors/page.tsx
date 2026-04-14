'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Eye, EyeOff, ExternalLink, Loader2, X } from 'lucide-react'

interface Sponsor {
  id: string
  name: string
  type: string
  logo_url?: string
  website?: string
  description?: string
  tier: 'platinum' | 'gold' | 'silver' | 'bronze'
  is_visible: boolean
  sort_order: number
}

const mockSponsors: Sponsor[] = []

const tierColors = {
  platinum: 'bg-gray-400/20 text-gray-300 border-gray-400/30',
  gold: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  silver: 'bg-gray-300/20 text-gray-200 border-gray-300/30',
  bronze: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    type: 'Partner',
    logo_url: '',
    website: '',
    description: '',
    tier: 'silver' as Sponsor['tier'],
    is_visible: true,
    sort_order: 0,
  })

  useEffect(() => {
    fetchSponsors()
  }, [])

  const fetchSponsors = async () => {
    try {
      const response = await fetch('/api/admin/sponsors')
      if (response.ok) {
        const data = await response.json()
        setSponsors(Array.isArray(data) ? data : [])
      } else {
        setSponsors(mockSponsors)
      }
    } catch {
      setSponsors(mockSponsors)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      const url = editingId ? `/api/admin/sponsors/${editingId}` : '/api/admin/sponsors'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage(`Sponsor ${editingId ? 'updated' : 'created'} successfully!`)
        resetForm()
        fetchSponsors()
      } else {
        setMessage('Failed to save sponsor')
      }
    } catch {
      setMessage('Error saving sponsor')
    }
  }

  const handleEdit = (sponsor: Sponsor) => {
    setEditingId(sponsor.id)
    setFormData({
      name: sponsor.name,
      type: sponsor.type,
      logo_url: sponsor.logo_url || '',
      website: sponsor.website || '',
      description: sponsor.description || '',
      tier: sponsor.tier,
      is_visible: sponsor.is_visible,
      sort_order: sponsor.sort_order,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this sponsor?')) return

    try {
      const response = await fetch(`/api/admin/sponsors/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setMessage('Sponsor deleted')
        fetchSponsors()
      }
    } catch {
      setMessage('Error deleting')
    }
  }

  const toggleVisibility = async (sponsor: Sponsor) => {
    try {
      await fetch(`/api/admin/sponsors/${sponsor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sponsor, is_visible: !sponsor.is_visible }),
      })
      fetchSponsors()
    } catch {
      setMessage('Error updating visibility')
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', type: 'Partner', logo_url: '', website: '', description: '', tier: 'silver', is_visible: true, sort_order: 0 })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-cyan-green mb-2">Sponsors</h1>
            <p className="text-gray-400 text-sm sm:text-base">Manage event sponsors and partners</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500 text-cyan-300 hover:bg-cyan-500/10 transition-colors text-sm font-medium w-fit"
          >
            <Plus className="w-4 h-4" />
            Add Sponsor
          </button>
        </div>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm"
        >
          {message}
        </motion.div>
      )}

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="glass-dark rounded-lg p-4 sm:p-6 mb-8 space-y-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Sponsor' : 'Add Sponsor'}</h3>
            <button type="button" onClick={resetForm} className="p-2 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
              <input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <input type="text" value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}
                placeholder="Partner, Sponsor..."
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
              <input type="url" value={formData.website} onChange={e => setFormData(p => ({ ...p, website: e.target.value }))}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tier</label>
              <select value={formData.tier} onChange={e => setFormData(p => ({ ...p, tier: e.target.value as Sponsor['tier'] }))}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors text-sm">
                <option value="platinum">Platinum</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
              <input type="url" value={formData.logo_url} onChange={e => setFormData(p => ({ ...p, logo_url: e.target.value }))}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                rows={2}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors resize-none text-sm" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" className="px-6 py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-colors text-sm">
              {editingId ? 'Update' : 'Add'} Sponsor
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:border-gray-500 transition-colors text-sm">
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {sponsors.length === 0 ? (
          <div className="glass-dark rounded-lg p-8 text-center">
            <p className="text-gray-400">No sponsors yet. Add your first sponsor above.</p>
          </div>
        ) : (
          sponsors.map((sponsor) => (
            <motion.div key={sponsor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass-dark rounded-lg p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  {sponsor.logo_url ? (
                    <img src={sponsor.logo_url} alt={sponsor.name} className="w-12 h-12 object-contain rounded-lg" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-cyan-300">{sponsor.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">{sponsor.name}</h3>
                    <p className="text-sm text-cyan-300">{sponsor.type}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs border ${tierColors[sponsor.tier]}`}>
                      {sponsor.tier}
                    </span>
                    {sponsor.website && (
                      <a href={sponsor.website} target="_blank" rel="noopener noreferrer"
                        className="ml-2 text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> Website
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button onClick={() => toggleVisibility(sponsor)}
                    className={`p-2 rounded-lg transition-colors ${sponsor.is_visible ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-500 hover:bg-gray-500/10'}`}>
                    {sponsor.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleEdit(sponsor)} className="p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(sponsor.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {sponsor.description && <p className="text-sm text-gray-400 mt-4">{sponsor.description}</p>}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
