'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, Plus, Search, Edit2, Trash2, Eye, EyeOff, 
  Loader2, Save, X, Link as LinkIcon, MessageCircle, 
  FileText, Hash, Users, MapPin, Mail, Clock, DollarSign,
  ExternalLink, ToggleLeft, ToggleRight, CheckCircle, Home
} from 'lucide-react'

interface Event {
  id: string
  name: string
  slug: string
  description?: string
  event_type?: string
  mode?: 'online' | 'offline' | 'hybrid'
  registration_type?: 'free' | 'paid'
  registration_fee?: number
  registration_start?: string
  registration_end?: string
  event_start?: string
  event_end?: string
  status?: 'draft' | 'published' | 'completed' | 'archived'
  registration_link?: string
  external_platform_link?: string
  whatsapp_community_link?: string
  is_whatsapp_mandatory?: boolean
  rules_text?: string
  certificate_rules_text?: string
  certificate_id_prefix?: string
  referral_threshold?: number
  venue_or_meeting_link?: string
  max_participants?: number
  contact_email?: string
  is_visible?: boolean
  is_home_event?: boolean
  created_at?: string
  updated_at?: string
}

const initialEvent: Partial<Event> = {
  name: '',
  slug: '',
  description: '',
  event_type: 'technical',
  mode: 'online',
  registration_type: 'free',
  registration_fee: 0,
  status: 'draft',
  registration_link: '',
  external_platform_link: '',
  whatsapp_community_link: '',
  is_whatsapp_mandatory: false,
  rules_text: '',
  certificate_rules_text: '',
  certificate_id_prefix: '',
  referral_threshold: 10,
  venue_or_meeting_link: '',
  max_participants: undefined,
  contact_email: '',
  is_visible: true,
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<Partial<Event>>(initialEvent)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/events')
      const data = await response.json()
      setEvents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name?.trim()) {
      setMessage({ type: 'error', text: 'Event name is required' })
      return
    }

    if (!formData.slug?.trim()) {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }

    setSaving(true)
    setMessage(null)

    try {
      const action = editingEvent ? 'update' : 'create'
      const payload = editingEvent 
        ? { action, ...formData }
        : { action, ...formData }

      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: editingEvent ? 'Event updated!' : 'Event created!' })
        setTimeout(() => {
          setShowForm(false)
          setEditingEvent(null)
          setFormData(initialEvent)
          fetchEvents()
        }, 1500)
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save event' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving event' })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData(event)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      })

      const result = await response.json()
      if (result.success) {
        fetchEvents()
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const handleToggleVisibility = async (event: Event) => {
    try {
      await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', id: event.id, is_visible: !event.is_visible })
      })
      fetchEvents()
    } catch (error) {
      console.error('Error toggling visibility:', error)
    }
  }

  const handleSetAsHome = async (event: Event) => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setHome', id: event.id })
      })
      const result = await response.json()
      if (result.success) {
        fetchEvents()
      }
    } catch (error) {
      console.error('Error setting home event:', error)
    }
  }

  const filteredEvents = events.filter(e => 
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.slug?.toLowerCase().includes(search.toLowerCase())
  )

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
            <h1 className="text-2xl sm:text-3xl font-bold gradient-cyan-green mb-2">Events</h1>
            <p className="text-gray-400">Create and manage your events</p>
          </div>
          <button
            onClick={() => { setEditingEvent(null); setFormData(initialEvent); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-400 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        </div>
      </motion.div>

      <div className="glass-dark rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none text-sm"
          />
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="glass-dark rounded-lg p-12 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
          <h3 className="text-xl font-semibold text-white mb-2">No events yet</h3>
          <p className="text-gray-400 mb-6">Create your first event to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-dark rounded-lg p-4 border border-cyan-500/20"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-white truncate">{event.name}</h3>
                  <p className="text-xs text-gray-400">{event.slug}</p>
                </div>
                <div className="flex items-center gap-1">
                  {event.is_home_event && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
                      <Home className="w-3 h-3" />
                      Home
                    </span>
                  )}
                  <button
                    onClick={() => handleToggleVisibility(event)}
                    className={`p-1.5 rounded-lg ${event.is_visible ? 'text-green-400' : 'text-gray-500'}`}
                  >
                    {event.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  event.status === 'published' ? 'bg-green-500/20 text-green-400' :
                  event.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                  event.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {event.status || 'draft'}
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-cyan-500/20 text-cyan-400">
                  {event.mode || 'online'}
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-400">
                  {event.registration_type || 'free'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleSetAsHome(event)}
                  className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs ${
                    event.is_home_event 
                      ? 'bg-yellow-500/20 text-yellow-300' 
                      : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/30'
                  }`}
                >
                  <Home className="w-3 h-3" />
                  {event.is_home_event ? 'Home' : 'Set Home'}
                </button>
                <button
                  onClick={() => handleEdit(event)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-dark rounded-xl p-6 w-full max-w-2xl border border-cyan-500/30 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingEvent ? 'Edit Event' : 'Create Event'}
                </h2>
                <button
                  onClick={() => { setShowForm(false); setEditingEvent(null); setFormData(initialEvent) }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Calendar className="w-4 h-4" />
                      Event Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Tech Hub BBS 2026"
                      required
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <LinkIcon className="w-4 h-4" />
                      Event Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                      placeholder="tech-hub-bbs-2026"
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      Event Type
                    </label>
                    <select
                      value={formData.event_type || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, event_type: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="technical">Technical</option>
                      <option value="management">Management</option>
                      <option value="cultural">Cultural</option>
                      <option value="sports">Sports</option>
                      <option value="workshop">Workshop</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <MapPin className="w-4 h-4" />
                      Mode
                    </label>
                    <select
                      value={formData.mode || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, mode: e.target.value as any }))}
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      Event Status
                    </label>
                    <select
                      value={formData.status || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <FileText className="w-4 h-4" />
                      Description
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      placeholder="Event description..."
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none resize-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Clock className="w-4 h-4" />
                      Registration Start
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.registration_start || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, registration_start: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Clock className="w-4 h-4" />
                      Registration End
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.registration_end || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, registration_end: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Calendar className="w-4 h-4" />
                      Event Start
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.event_start || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, event_start: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Calendar className="w-4 h-4" />
                      Event End
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.event_end || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, event_end: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <LinkIcon className="w-4 h-4" />
                      Registration Link
                    </label>
                    <input
                      type="url"
                      value={formData.registration_link || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, registration_link: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <ExternalLink className="w-4 h-4" />
                      External Platform
                    </label>
                    <input
                      type="url"
                      value={formData.external_platform_link || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, external_platform_link: e.target.value }))}
                      placeholder="https://unstop.com/..."
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp Community
                    </label>
                    <input
                      type="url"
                      value={formData.whatsapp_community_link || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_community_link: e.target.value }))}
                      placeholder="https://chat.whatsapp.com/..."
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-green-500/30 text-white placeholder-gray-500 focus:border-green-400 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Users className="w-4 h-4" />
                      Referral Threshold
                    </label>
                    <input
                      type="number"
                      value={formData.referral_threshold || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, referral_threshold: parseInt(e.target.value) || 0 }))}
                      placeholder="10"
                      min="1"
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <MapPin className="w-4 h-4" />
                      Venue / Meeting Link
                    </label>
                    <input
                      type="text"
                      value={formData.venue_or_meeting_link || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, venue_or_meeting_link: e.target.value }))}
                      placeholder="Google Meet link or venue address"
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Users className="w-4 h-4" />
                      Max Participants
                    </label>
                    <input
                      type="number"
                      value={formData.max_participants || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_participants: e.target.value ? parseInt(e.target.value) : undefined }))}
                      placeholder="Unlimited"
                      min="1"
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Mail className="w-4 h-4" />
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.contact_email || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                      placeholder="support@event.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <FileText className="w-4 h-4" />
                      Certificate Rules
                    </label>
                    <textarea
                      value={formData.certificate_rules_text || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, certificate_rules_text: e.target.value }))}
                      rows={3}
                      placeholder="Rules for certificate issuance..."
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none resize-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Hash className="w-4 h-4" />
                      Certificate Prefix
                    </label>
                    <input
                      type="text"
                      value={formData.certificate_id_prefix || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, certificate_id_prefix: e.target.value }))}
                      placeholder="BBSCET-TQ-2026"
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <FileText className="w-4 h-4" />
                      Event Rules
                    </label>
                    <textarea
                      value={formData.rules_text || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, rules_text: e.target.value }))}
                      rows={3}
                      placeholder="Event guidelines..."
                      className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none resize-none text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_whatsapp_mandatory || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_whatsapp_mandatory: e.target.checked }))}
                        className="w-4 h-4 cursor-pointer accent-cyan-500"
                      />
                      <span className="text-gray-300 text-sm">WhatsApp join is mandatory for registration</span>
                    </label>
                  </div>
                </div>

                {message && (
                  <div className={`p-3 rounded-lg text-sm ${
                    message.type === 'success' ? 'bg-green-500/10 text-green-300 border border-green-500/30' : 'bg-red-500/10 text-red-300 border border-red-500/30'
                  }`}>
                    {message.text}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditingEvent(null); setFormData(initialEvent) }}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-cyan-500 text-white hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}