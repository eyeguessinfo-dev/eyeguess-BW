'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function ValueProposition() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            Value-Based Support That Scales With You
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-300 leading-relaxed mb-12"
          >
            We move beyond traditional support models to become true partners in your growth. 
            Our frameworks and advisory services are designed to deliver measurable impact, 
            helping you build sustainable creative ecosystems that drive revenue and innovation.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
          >
            {[
              {
                title: "Strategic Framework",
                description: "Proven methodologies for creative development and management"
              },
              {
                title: "Content Excellence",
                description: "High-impact content that drives engagement and conversion"
              },
              {
                title: "Performance Analytics",
                description: "Data-driven insights to optimize your partnership strategy"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}