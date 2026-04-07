'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: 'Who can participate in the event?',
      answer:
        'The event is open to students, professionals, and enthusiasts from all backgrounds. You just need to register on our platform and select your preferred tracks.',
    },
    {
      question: 'What is the registration fee?',
      answer:
        'Registration is completely free! We want to make this event accessible to everyone. Just sign up on our platform and confirm your participation.',
    },
    {
      question: 'Can I change my tracks after registration?',
      answer:
        'Yes, you can update your track selection up to 48 hours before the event. After that, modifications can be made with special permission by contacting our support team.',
    },
    {
      question: 'Will the event be recorded?',
      answer:
        'Selected sessions and keynotes will be recorded and made available to registered participants within 7 days of the event.',
    },
    {
      question: 'How will I receive my certificate?',
      answer:
        'Your digital certificate will be issued immediately after the event concludes. You can download it from your dashboard or verify it on our online portal.',
    },
    {
      question: 'What should I bring to the event?',
      answer:
        'Please bring a valid ID and your registration confirmation. For technical workshops, bring a laptop if you plan to participate actively.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="section-spacing px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="heading-lg gradient-cyan-green mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-400">Everything you need to know about EventManager</p>
      </motion.div>

      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="glass-dark rounded-lg overflow-hidden border border-cyan-500/20 hover:border-cyan-500/40 transition-colors"
          >
            <motion.button
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-cyan-500/10 transition-colors"
            >
              <span className="text-left font-semibold text-white">{faq.question}</span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-cyan-500/20"
                >
                  <p className="px-6 py-4 text-gray-400 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      {/* Contact CTA */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <p className="text-gray-400 mb-4">Didn&apos;t find your answer?</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="neon-button"
        >
          Contact Support
        </motion.button>
      </motion.div>
    </section>
  )
}
