'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, User, Users, Trophy, Link as LinkIcon, Loader2, ExternalLink } from 'lucide-react'

interface PlatformSettings {
  campus_ambassador_enabled: boolean
  leaderboard_visible: boolean
  reward_title: string
  reward_description: string
  use_external_proof_form: boolean
  external_proof_form_link: string
  sponsor_cta_visible: boolean
  sponsor_cta_whatsapp_number: string
  sponsor_cta_default_message: string
  ambassador_share_message: string
}

const defaultPlatformSettings: PlatformSettings = {
  campus_ambassador_enabled: true,
  leaderboard_visible: true,
  reward_title: 'Certificate of Appreciation + Google Swag',
  reward_description: 'Bring 10 valid referrals and unlock rewards and recognition.',
  use_external_proof_form: true,
  external_proof_form_link: '',
  sponsor_cta_visible: true,
  sponsor_cta_whatsapp_number: '919771894062',
  sponsor_cta_default_message: 'Hello, I am interested in sponsoring your event. Please share details.',
  ambassador_share_message: 'Hi! Join the Tech Hub BBS challenge using my referral link:',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(defaultPlatformSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/admin/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings({ ...defaultPlatformSettings, ...data })
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage('Settings saved successfully!')
      } else {
        setMessage('Failed to save settings')
      }
    } catch {
      setMessage('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof PlatformSettings, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold gradient-cyan-green mb-2">Settings</h1>
        <p className="text-gray-400">Configure platform-level settings</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="glass-dark rounded-lg p-4 sm:p-6 space-y-6"
      >
        <div className="border-t border-slate-800 pt-6">
          <h2 className="text-lg font-semibold text-white mb-4">Ambassador Program</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.campus_ambassador_enabled}
                  onChange={(e) => handleChange('campus_ambassador_enabled', e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-cyan-500"
                />
                <span className="text-gray-300 text-sm">Enable ambassador program</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.leaderboard_visible}
                  onChange={(e) => handleChange('leaderboard_visible', e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-cyan-500"
                />
                <span className="text-gray-300 text-sm">Show leaderboard</span>
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                <Users className="w-4 h-4 inline mr-2" />
                Reward Title
              </label>
              <input
                type="text"
                value={settings.reward_title}
                onChange={(e) => handleChange('reward_title', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                <Trophy className="w-4 h-4 inline mr-2" />
                Reward Description
              </label>
              <textarea
                value={settings.reward_description}
                onChange={(e) => handleChange('reward_description', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors resize-none text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                <LinkIcon className="w-4 h-4 inline mr-2" />
                Ambassador Share Message
              </label>
              <textarea
                value={settings.ambassador_share_message}
                onChange={(e) => handleChange('ambassador_share_message', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors resize-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6">
          <h2 className="text-lg font-semibold text-white mb-4">External Proof Form</h2>
          <div className="grid gap-4">
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.use_external_proof_form}
                  onChange={(e) => handleChange('use_external_proof_form', e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-cyan-500"
                />
                <span className="text-gray-300 text-sm">Use external proof form link</span>
              </label>
            </div>
            {settings.use_external_proof_form && (
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  <ExternalLink className="w-4 h-4 inline mr-2" />
                  Form Link
                </label>
                <input
                  type="url"
                  value={settings.external_proof_form_link}
                  onChange={(e) => handleChange('external_proof_form_link', e.target.value)}
                  placeholder="https://forms.gle/your-proof-form"
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors text-sm"
                />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6">
          <h2 className="text-lg font-semibold text-white mb-4">Sponsor CTA</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.sponsor_cta_visible}
                  onChange={(e) => handleChange('sponsor_cta_visible', e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-cyan-500"
                />
                <span className="text-gray-300 text-sm">Show sponsor CTA</span>
              </label>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">WhatsApp Number</label>
              <input
                type="text"
                value={settings.sponsor_cta_whatsapp_number}
                onChange={(e) => handleChange('sponsor_cta_whatsapp_number', e.target.value)}
                placeholder="919771894062"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-green-500/30 text-white placeholder-gray-500 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-colors text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Default Message</label>
              <textarea
                value={settings.sponsor_cta_default_message}
                onChange={(e) => handleChange('sponsor_cta_default_message', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-green-500/30 text-white placeholder-gray-500 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-colors resize-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6">
          <p className="text-xs text-gray-500">
            Note: Event-specific settings (registration link, WhatsApp group, certificate rules, etc.) are now managed in the <a href="/admin/events" className="text-cyan-400 hover:underline">Events</a> page.
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-500/10 border border-green-500/30 text-green-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'} text-sm`}>
            {message}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={saving}
          type="submit"
          className="w-full neon-button justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </span>
        </motion.button>
      </motion.div>
    </div>
  )
}