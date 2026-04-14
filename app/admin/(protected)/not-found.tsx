'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, ArrowLeft, Settings, Users, FileText, Building2, BarChart3 } from 'lucide-react'

export default function ProtectedNotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 mx-auto rounded-full bg-cyan-500/10 flex items-center justify-center mb-6"
        >
          <span className="text-4xl font-bold gradient-cyan-green">404</span>
        </motion.div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          The admin page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/admin/dashboard"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-colors"
        >
          <Home className="w-5 h-5" />
          Go to Dashboard
        </Link>

        <div className="mt-12">
          <p className="text-sm text-gray-500 mb-4">Quick links:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-cyan-500/20 text-cyan-300 text-sm hover:bg-cyan-500/10 hover:border-cyan-400 transition-colors">
              <BarChart3 className="w-4 h-4" /> Dashboard
            </Link>
            <Link href="/admin/settings" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-cyan-500/20 text-cyan-300 text-sm hover:bg-cyan-500/10 hover:border-cyan-400 transition-colors">
              <Settings className="w-4 h-4" /> Settings
            </Link>
            <Link href="/admin/users" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-cyan-500/20 text-cyan-300 text-sm hover:bg-cyan-500/10 hover:border-cyan-400 transition-colors">
              <Users className="w-4 h-4" /> Users
            </Link>
            <Link href="/admin/sponsors" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-cyan-500/20 text-cyan-300 text-sm hover:bg-cyan-500/10 hover:border-cyan-400 transition-colors">
              <Building2 className="w-4 h-4" /> Sponsors
            </Link>
            <Link href="/admin/certificates" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-cyan-500/20 text-cyan-300 text-sm hover:bg-cyan-500/10 hover:border-cyan-400 transition-colors">
              <FileText className="w-4 h-4" /> Certificates
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-300 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to main website
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
