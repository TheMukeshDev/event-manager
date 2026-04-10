'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, ExternalLink } from 'lucide-react'

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

export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    type: 'Partner',
    logo_url: '',
    website: '',
    description: '',
    tier: 'silver' as 'platinum' | 'gold' | 'silver' | 'bronze',
    is_visible: true,
    sort_order: 0
  })

  useEffect(() => {
    fetchSponsors()
  }, [])

  const fetchSponsors = async () => {
    try {
      const response = await fetch('/api/admin/sponsors')
      if (response.ok) {
        const data = await response.json()
        setSponsors(data)
      }
    } catch (error) {
      console.error('Error fetching sponsors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      const url = editingSponsor ? `/api/admin/sponsors/${editingSponsor.id}` : '/api/admin/sponsors'
      const method = editingSponsor ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setMessage(`Sponsor ${editingSponsor ? 'updated' : 'created'} successfully!`)
        setFormData({
          name: '',
          type: 'Partner',
          logo_url: '',
          website: '',
          description: '',
          tier: 'silver',
          is_visible: true,
          sort_order: 0
        })
        setEditingSponsor(null)
        setShowForm(false)
        fetchSponsors()
      } else {
        setMessage('Failed to save sponsor')
      }
    } catch (error) {
      setMessage('Error saving sponsor')
    }
  }

  const handleEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor)
    setFormData({
      name: sponsor.name,
      type: sponsor.type,
      logo_url: sponsor.logo_url || '',
      website: sponsor.website || '',
      description: sponsor.description || '',
      tier: sponsor.tier,
      is_visible: sponsor.is_visible,
      sort_order: sponsor.sort_order
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) return

    try {
      const response = await fetch(`/api/admin/sponsors/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMessage('Sponsor deleted successfully!')
        fetchSponsors()
      } else {
        setMessage('Failed to delete sponsor')
      }
    } catch (error) {
      setMessage('Error deleting sponsor')
    }
  }

  const toggleVisibility = async (sponsor: Sponsor) => {
    try {
      const response = await fetch(`/api/admin/sponsors/${sponsor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sponsor, is_visible: !sponsor.is_visible })
      })

      if (response.ok) {
        setMessage('Sponsor visibility updated!')
        fetchSponsors()
      }
    } catch (error) {
      setMessage('Error updating visibility')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-cyan-400">Loading sponsors...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-cyan-green mb-2">Sponsor Management</h1>
            <p className="text-gray-400">Manage event sponsors and partners</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg border border-cyan-500 text-cyan-300 hover:bg-cyan-500/10 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Sponsor
          </motion.button>
        </div>
      </motion.div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-500/10 border border-green-500/30 text-green-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
          {message}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="glass-dark rounded-lg p-6 mb-8 space-y-4"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            {editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                placeholder="Partner, Sponsor, etc."
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData(prev => ({ ...prev, tier: e.target.value as any }))}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
              >
                <option value="platinum">Platinum</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL <span className="text-gray-500 text-xs">(Recommended: 256x256px PNG/SVG)</span></label>
              <input
                type="url"
                value={formData.logo_url}
                onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                placeholder="https://example.com/logo.png or upload to /public/sponsors/"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">If no logo provided, initials from sponsor name will be displayed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_visible}
                onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-gray-300">Visible on public website</span>
            </label>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-colors"
            >
              {editingSponsor ? 'Update Sponsor' : 'Add Sponsor'}
            </motion.button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingSponsor(null)
                setFormData({
                  name: '',
                  type: 'Partner',
                  logo_url: '',
                  website: '',
                  description: '',
                  tier: 'silver',
                  is_visible: true,
                  sort_order: 0
                })
              }}
              className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:border-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {/* Sponsors List */}
      <div className="space-y-4">
        {sponsors.length === 0 ? (
          <div className="glass-dark rounded-lg p-8 text-center">
            <p className="text-gray-400">No sponsors added yet. Add your first sponsor above.</p>
          </div>
        ) : (
          sponsors.map((sponsor) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-dark rounded-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {sponsor.logo_url ? (
                    <img
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      className="w-12 h-12 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-linear-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-cyan-300">
                        {sponsor.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-white">{sponsor.name}</h3>
                    <p className="text-sm text-cyan-300">{sponsor.type} • {sponsor.tier}</p>
                    {sponsor.website && (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Website
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleVisibility(sponsor)}
                    className={`p-2 rounded-lg transition-colors ${sponsor.is_visible ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-500 hover:bg-gray-500/10'}`}
                  >
                    {sponsor.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleEdit(sponsor)}
                    className="p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(sponsor.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {sponsor.description && (
                <p className="text-sm text-gray-400 mt-4">{sponsor.description}</p>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}