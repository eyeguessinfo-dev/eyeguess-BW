'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Package {
  name: string
  price: string
  period: string
  features: string[]
  cta: string
  stripeLink: string
  featured?: boolean
}

interface PackageCardProps {
  pkg: Package
  index: number
}

export default function PackageCard({ pkg, index }: PackageCardProps) {
  const AnimatedCheckmark = () => (
    <motion.svg
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 200 }}
      className="w-5 h-5 text-white flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: index * 0.1 + 0.7, duration: 0.5 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </motion.svg>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      className={cn(
        "relative bg-white/5 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl",
        pkg.featured 
          ? "border-white/30 scale-105 hover:scale-110 shadow-2xl" 
          : "border-white/10 hover:border-white/30"
      )}
    >
      {/* Featured Badge */}
      {pkg.featured && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="absolute -top-3 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-gradient-to-r from-white to-gray-300 text-black px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
            Most Popular
          </div>
        </motion.div>
      )}
      
      {/* Animated Border for Featured Card */}
      {pkg.featured && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-white/10 opacity-50 animate-glow -z-10" />
      )}
      
      <div className="text-center mb-8">
        <h3 className={cn(
          "text-2xl font-bold mb-4",
          pkg.featured ? "text-white" : "text-gray-200"
        )}>
          {pkg.name}
        </h3>
        
        <div className="flex items-baseline justify-center gap-2 mb-2">
          <span className="text-5xl font-bold tracking-tight">{pkg.price}</span>
          <span className="text-gray-400 font-light">{pkg.period}</span>
        </div>
      </div>
      
      <ul className="space-y-4 mb-8">
        {pkg.features.map((feature, featureIndex) => (
          <motion.li
            key={feature}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + featureIndex * 0.1 + 0.3 }}
            className="flex items-start gap-3"
          >
            <AnimatedCheckmark />
            <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
          </motion.li>
        ))}
      </ul>
      
      <motion.a
        href={pkg.stripeLink}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "w-full block text-center py-4 px-6 rounded-lg font-semibold transition-all duration-200 border",
          pkg.featured
            ? "bg-white text-black border-white hover:bg-gray-100 hover:border-gray-100"
            : "bg-transparent text-white border-white/30 hover:bg-white hover:text-black"
        )}
      >
        {pkg.cta}
      </motion.a>
    </motion.div>
  )
}