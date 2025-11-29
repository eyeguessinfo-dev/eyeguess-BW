'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'

export default function Hero() {
  const containerRef = useRef(null)

  const scrollToPackages = () => {
    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden flex items-center justify-center pt-16 px-4 sm:px-6"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 animate-gradient" />
      
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6"
          >
            Partnership,
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mt-2 sm:mt-4"
            >
              Not Just Creativity.
            </motion.span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Strategic advisory and content development services designed to scale your creative ecosystem with precision and vision.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToPackages}
            className="bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Explore Services
          </motion.button>
        </motion.div>
        
        {/* Package Preview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 md:mt-20 max-w-4xl mx-auto"
        >
          {[
            { name: "Value-Based Support", price: "" },
            { name: "Content Development", price: "" },
            { name: "Full Advisory", price: "" }
          ].map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 text-center hover:bg-white/10 transition-all duration-300"
            >
              <h3 className="font-semibold text-base sm:text-lg mb-2">{pkg.name}</h3>
              <div className="text-xl sm:text-2xl font-bold text-white">
                {pkg.price}
                <span className="text-xs sm:text-sm text-gray-400 font-normal ml-1">Monthly</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Upside Down Pyramid Eye Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          className="relative"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg 
            width="40" 
            height="30" 
            viewBox="0 0 60 40"
            className="text-white transform rotate-180 sm:w-[60px] sm:h-[40px]"
          >
            <path
              d="M30 5 L55 35 L5 35 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <motion.circle
              cx="30"
              cy="20"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.circle
              cx="30"
              cy="20"
              r="3"
              fill="currentColor"
              animate={{
                cy: ["22", "18", "22"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}