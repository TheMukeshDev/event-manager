'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Link as LinkIcon, MessageCircle, FileText, Hash, Loader2 } from 'lucide-react'

interface AdminSettings {
  registration_link: string
  whatsapp_community_link: string
  is_whatsapp_join_mandatory: boolean
  certificate_rules_text: string
  certificate_id_prefix: string
  sponsor_cta_whatsapp_number: string
  sponsor_cta_default_message: string
  sponsor_cta_visible: boolean
  campus_ambassador_enabled: boolean
  referral_threshold: number
  reward_title: string
  reward_description: string
  use_external_proof_form: boolean
  external_proof_form_link: string
  leaderboard_visible: boolean
  ambassador_share_message: string
}

const defaultSettings: AdminSettings = {
  registration_link: '',
  whatsapp_community_link: 'https://chat.whatsapp.com/placeholder',
  is_whatsapp_join_mandatory: true,
  certificate_rules_text: 'Certificates are issued only to valid registered participants.',
  certificate_id_prefix: 'BBSCET-TQ-2026',
  sponsor_cta_whatsapp_number: '919771894062',
  sponsor_cta_default_message: 'Hello, I am interested in sponsoring your event.',
  sponsor_cta_visible: true,
  campus_ambassador_enabled: true,
  referral_threshold: 10,
  reward_title: 'Certificate of Appreciation',
  reward_description: 'Bring 10 valid referrals and unlock rewards.',
  use_external_proof_form: true,
  external_proof_form_link: '',
  leaderboard_visible: true,
  ambassador_share_message: 'Hi! Join the Tech Hub BBS challenge using my referral link:',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/admin/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings({ ...defaultSettings, ...data })
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

  const handleChange = (field: keyof AdminSettings, value: string | number | boolean) => {
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
        <p className="text-gray-400">Configure event settings and links</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="glass-dark rounded-lg p-4 sm:p-6 space-y-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <LinkIcon className="w-4 h-4" />
              Registration Link
            </label>
            <input
              type="url"
              value={settings.registration_link}
              onChange={(e) => handleChange('registration_link', e.target.value)}
              placeholder="https://example.com/register"
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <MessageCircle className="w-4 h-4" />
              WhatsApp Community Link
            </label>
            <input
              type="url"
              value={settings.whatsapp_community_link}
              onChange={(e) => handleChange('whatsapp_community_link', e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-green-500/30 text-white placeholder-gray-500 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-colors text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.is_whatsapp_join_mandatory}
                onChange={(e) => handleChange('is_whatsapp_join_mandatory', e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-cyan-500"
              />
              <span className="text-gray-300 text-sm">WhatsApp join is mandatory</span>
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FileText className="w-4 h-4" />
              Certificate Rules Text
            </label>
            <textarea
              value={settings.certificate_rules_text}
              onChange={(e) => handleChange('certificate_rules_text', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors resize-none text-sm"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Hash className="w-4 h-4" />
              Certificate ID Prefix
            </label>
            <input
              type="text"
              value={settings.certificate_id_prefix}
              onChange={(e) => handleChange('certificate_id_prefix', e.target.value)}
              placeholder="BBSCET-TQ-2026"
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              Referral Threshold
            </label>
            <input
              type="number"
              min={1}
              value={settings.referral_threshold}
              onChange={(e) => handleChange('referral_threshold', Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors text-sm"
            />
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6">
          <h2 className="text-lg font-semibold text-white mb-4">Sponsor CTA</h2>
          <div className="grid gap-4 sm:grid-cols-2">
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
            <div>
              <label className="flex items-center gap-3 cursor-pointer h-full pt-2">
                <input
                  type="checkbox"
                  checked={settings.sponsor_cta_visible}
                  onChange={(e) => handleChange('sponsor_cta_visible', e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-cyan-500"
                />
                <span className="text-gray-300 text-sm">Show sponsor CTA</span>
              </label>
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
              <label className="text-sm font-medium text-gray-300 mb-2 block">Reward Title</label>
              <input
                type="text"
                value={settings.reward_title}
                onChange={(e) => handleChange('reward_title', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Reward Description</label>
              <textarea
                value={settings.reward_description}
                onChange={(e) => handleChange('reward_description', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors resize-none text-sm"
              />
            </div>
          </div>
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
      </motion.form>
    </div>
  )
}
