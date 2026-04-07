'use client'

import { motion } from 'framer-motion'
import { FileCheck, Download } from 'lucide-react'

export function CertificateSection() {
  return (
    <section className="section-spacing px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Certificate graphic */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center"
        >
          <motion.div
            whileHover={{ rotateY: 5 }}
            className="glass-dark rounded-lg p-8 glow-cyan-lg border-2 border-cyan-500/30 max-w-sm"
            style={{ perspective: '1000px' }}
          >
            <div className="bg-gradient-to-br from-yellow-100 to-amber-50 rounded-lg p-8 text-center shadow-2xl">
              <FileCheck className="w-12 h-12 text-amber-700 mx-auto mb-4" />
              <p className="text-sm text-gray-600 font-serif mb-2">This is to certify that</p>
              <p className="text-xl font-bold text-gray-800 mb-2">Your Name</p>
              <p className="text-sm text-gray-600 mb-4">has successfully completed and participated in</p>
              <p className="text-lg font-bold text-gray-800 mb-4">EventManager 2024</p>
              <div className="flex justify-between px-4 pt-4 border-t border-gray-300 text-xs text-gray-600">
                <span>Date: April 2024</span>
                <span>Signature</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right side - Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-lg gradient-cyan-blue mb-6">Earn Your Certificate</h2>

          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Every participant who completes the event will receive a digitally verified certificate
            recognizing their participation and achievements in the selected tracks.
          </p>

          <div className="space-y-4 mb-8">
            {[
              'Digital Certificate of Participation',
              'Verified on blockchain',
              'Shareable on LinkedIn and social media',
              'Track-specific skill badges',
              'Official credentials for your resume',
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 text-gray-300"
              >
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>

          <div className="glass-dark rounded-lg p-6 glow-green mb-8">
            <p className="text-sm text-gray-300 mb-4">
              Verify your certificate with our online portal using your unique certificate ID.
            </p>
            <input
              type="text"
              placeholder="Enter your certificate ID"
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-green-500/30 text-white placeholder-gray-500 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-colors mb-4"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-green-500 text-green-300 font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.5)]"
            >
              <Download className="w-4 h-4" />
              Verify & Download
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
