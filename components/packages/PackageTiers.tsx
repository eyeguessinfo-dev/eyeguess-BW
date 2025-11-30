// components/packages/PackageTiers.tsx
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import PackageFlowManager from './PackageFlowManager'

const packages = [
  {
    name: "Value-Based Support",
    price: "$49",
    period: "/month",
    features: [
      "Unlimited email & messaging support for quick decisions",
      "Basic framework access",
      "Standard response time (24-48 hours)",
      "Resource library access",
      "Community Meetings",
      "Monthly Studio Photo Shoot *Limited Time Offer*"
    ],
    cta: "Select Value-Based Support",
    stripeLink: "https://buy.stripe.com/14A3cwbUg8xZ88b47D9IQ00"
  },
  {
    name: "Content Development", 
    price: "$1,799",
    period: "/month",
    features: [
      "Everything in Value-Based Support",
      "Full content development suite",
      "Setup & technical implementation assistance",
      "Priority response time (4-12 hours)",
      "Custom framework customization",
      "Monthly performance reviews"
    ],
    cta: "Select Content Development",
    stripeLink: "https://buy.stripe.com/aFa00kbUg29BfADcE99IQ01",
    featured: true
  },
  {
    name: "Full Advisory",
    price: "$3,999", 
    period: "/month",
    features: [
      "Everything in Content Development",
      "4 hours monthly 1:1 strategic consulting",
      "Quarterly partnership strategy reviews & performance audits",
      "Priority access to new partnership frameworks & tools",
      "Dedicated success manager",
      "Executive strategy sessions"
    ],
    cta: "Select Full Advisory", 
    stripeLink: "https://buy.stripe.com/3cI6oIbUg01t1JN1Zv9IQ02"
  }
]

export default function PackageTiers() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="packages" ref={ref} className="py-20 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your Partnership Level
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Select the service tier that aligns with your current needs and growth ambitions. 
            Each level builds upon the previous, creating a clear path for scaling your partnership success.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {packages.map((pkg, index) => (
            <PackageFlowManager key={pkg.name} pkg={pkg} index={index} />
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm">
            All plans include our 30-day satisfaction guarantee. Need help choosing? 
            <a href="#" className="text-white underline hover:no-underline ml-1">
              Contact us for a consultation
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}