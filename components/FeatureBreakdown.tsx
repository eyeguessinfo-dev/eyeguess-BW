'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'

const features = [
  {
    title: "Creative Partnership Frameworks",
    description: "Comprehensive methodologies for identifying, developing, and managing high-value partnerships that drive measurable outcomes.",
    details: "Includes partner identification matrices, relationship development playbooks, and performance tracking systems tailored to your creativity and goals."
  },
  {
    title: "Content Development Engine",
    description: "End-to-end content creation and distribution system designed specifically for creative marketing and co-branded initiatives.",
    details: "Covers content strategy, creation, optimization, and distribution across all relevant channels with performance analytics and ROI tracking."
  },
  {
    title: "Performance Analytics Suite",
    description: "Advanced tracking and reporting capabilities to measure partnership ROI and optimize your creative strategy.",
    details: "Real-time dashboards, custom reporting, predictive analytics, and strategic recommendations based on performance data and market trends."
  },
  {
    title: "Technical Implementation Support",
    description: "Hands-on assistance with tool setup, integration, and optimization for seamless partnership operations.",
    details: "Includes CRM configuration, API integrations, automation workflows, and custom tool development to support your partnership infrastructure."
  }
]

export default function FeatureBreakdown() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Comprehensive Feature Breakdown
          </h2>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm"
              >
                <motion.button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                >
                  <h3 className="text-xl font-semibold pr-4">{feature.title}</h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </motion.button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-white/10 pt-4">
                        <p className="text-gray-300 mb-4">{feature.description}</p>
                        <p className="text-gray-400 text-sm">{feature.details}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}