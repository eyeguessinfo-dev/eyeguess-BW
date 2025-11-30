'use client'

import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import TermsAcceptanceFlow from './TermsAcceptanceFlow'

interface Package {
  name: string
  price: string
  period: string
  features: string[]
  cta: string
  stripeLink: string
  featured?: boolean
}

interface EnhancedPackageCardProps {
  pkg: Package
  index: number
  onSelect?: () => void  
}

export default function EnhancedPackageCard({ pkg, index }: EnhancedPackageCardProps) {
  const [showTerms, setShowTerms] = useState(false)
  const [flowStep, setFlowStep] = useState<'service-agreement' | 'terms-acceptance'>('service-agreement')
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const termsContainerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollCheckRef = useRef<NodeJS.Timeout>()

  const handlePackageSelect = () => {
    setShowTerms(true)
    setFlowStep('service-agreement')
    setHasScrolledToBottom(false)
  }

  const handleServiceAgreementAccept = () => {
    if (hasScrolledToBottom) {
      setFlowStep('terms-acceptance')
    }
  }

  const handleTermsAccept = (acceptanceId: string) => {
    console.log('Terms accepted with ID:', acceptanceId)
    // TermsAcceptanceFlow will handle the Stripe redirect automatically
    setShowTerms(false)
    setFlowStep('service-agreement')
  }

  const handleBackToServiceAgreement = () => {
    setFlowStep('service-agreement')
  }

  // Improved scroll detection with better mobile support
  useEffect(() => {
    const container = termsContainerRef.current
    if (!container) return

    const checkScrollPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      
      // More generous threshold for mobile devices
      const threshold = 100 // Increased from 50px to be more forgiving
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold
      
      if (isAtBottom && !hasScrolledToBottom) {
        setHasScrolledToBottom(true)
      }
      
      setIsScrolling(false)
    }

    const handleScroll = () => {
      setIsScrolling(true)
      
      // Debounce scroll checking for better performance
      if (scrollCheckRef.current) {
        clearTimeout(scrollCheckRef.current)
      }
      
      scrollCheckRef.current = setTimeout(checkScrollPosition, 100)
    }

    // Also use Intersection Observer as a backup for mobile
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasScrolledToBottom(true)
          }
        })
      },
      {
        root: container,
        threshold: 0.8, // Trigger when 80% of the bottom element is visible
      }
    )

    if (bottomRef.current) {
      observer.observe(bottomRef.current)
    }

    container.addEventListener('scroll', handleScroll)
    
    // Initial check
    checkScrollPosition()

    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (scrollCheckRef.current) {
        clearTimeout(scrollCheckRef.current)
      }
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current)
      }
    }
  }, [hasScrolledToBottom, showTerms])

  // Reset scroll state when modal opens
  useEffect(() => {
    if (showTerms && flowStep === 'service-agreement') {
      setHasScrolledToBottom(false)
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        if (termsContainerRef.current) {
          termsContainerRef.current.scrollTop = 0
        }
      }, 100)
    }
  }, [showTerms, flowStep])

  // Force enable after a reasonable time as fallback
  useEffect(() => {
    if (showTerms && flowStep === 'service-agreement' && !hasScrolledToBottom) {
      const fallbackTimer = setTimeout(() => {
        setHasScrolledToBottom(true)
      }, 30000) // 30 second fallback

      return () => clearTimeout(fallbackTimer)
    }
  }, [showTerms, hasScrolledToBottom, flowStep])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 ${
          pkg.featured ? 'ring-2 ring-blue-500 shadow-2xl shadow-blue-500/20 scale-105' : 'shadow-xl shadow-black/50'
        }`}
      >
        {pkg.featured && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-500/25">
              ⭐ Most Popular
            </span>
          </div>
        )}

        {/* Limited Time Badge for Value-Based Support */}
{pkg.name === "Value-Based Support" && !pkg.featured && (
  <motion.div
    initial={{ opacity: 0, scale: 0, rotateY: 180 }}
    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
    transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
    className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
  >
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      {/* Shadow for depth */}
      <div className="absolute inset-0 bg-gray-800 rounded-full blur-md transform translate-y-1 -z-10" />
      
      {/* Main metallic badge */}
      <div className="relative bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 text-gray-900 px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap border-2 border-gray-100 shadow-2xl">
        {/* Inner shine */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-white/40 to-transparent rounded-l-full" />
        
        {/* Reflective spots */}
        <div className="absolute top-1 right-4 w-2 h-2 bg-white/90 rounded-full blur-[1px]" />
        <div className="absolute bottom-1 left-4 w-1 h-1 bg-white/70 rounded-full" />
        
        <span className="relative z-10 drop-shadow-sm flex items-center gap-1">
          <motion.span
            animate={{ rotate: [0, 15, 0, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            ✨
          </motion.span>
          Limited Time Only
        </span>
      </div>
    </motion.div>
  </motion.div>
)}
        
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            {pkg.name}
          </h3>
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-4xl font-bold text-white">{pkg.price}</span>
            <span className="text-gray-400">{pkg.period}</span>
          </div>
          <p className="text-gray-400 text-sm">Billed monthly • Cancel anytime</p>
        </div>

        <ul className="space-y-4 mb-8">
          {pkg.features.map((feature, idx) => (
            <li key={idx} className="flex items-start text-gray-300 group">
              <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="group-hover:text-white transition-colors">{feature}</span>
            </li>
          ))}
        </ul>

        <button 
          onClick={handlePackageSelect}
          className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
            pkg.featured 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25' 
              : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-gray-600'
          }`}
        >
          {pkg.cta}
        </button>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          🔒 Secure payment • 30-day guarantee
        </p>
      </motion.div>

      {/* Combined Modal for Service Agreement & Terms Acceptance */}
      {showTerms && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowTerms(false)
            setFlowStep('service-agreement')
          }}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Service Agreement Content */}
            {flowStep === 'service-agreement' && (
              <>
                {/* Header */}
                <div className="border-b border-gray-800 p-6 bg-gradient-to-r from-gray-900 to-black sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Service Agreement</h2>
                      <p className="text-gray-400 text-sm mt-1">Please read through all terms carefully</p>
                    </div>
                    <button 
                      onClick={() => {
                        setShowTerms(false)
                        setFlowStep('service-agreement')
                      }}
                      className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Scroll Progress Indicator */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">
                        {hasScrolledToBottom ? 'All terms reviewed' : 'Scroll to review all terms'}
                      </span>
                      <span className={`text-sm font-medium ${
                        hasScrolledToBottom ? 'text-green-400' : 'text-blue-400'
                      }`}>
                        {hasScrolledToBottom ? '✓ Ready to Accept' : 'Scroll to Continue'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          hasScrolledToBottom 
                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-600'
                        }`}
                        style={{ 
                          width: hasScrolledToBottom ? '100%' : '0%' 
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Terms Content */}
                <div 
                  ref={termsContainerRef}
                  className="p-6 overflow-y-auto max-h-[60vh] space-y-6"
                  style={{
                    WebkitOverflowScrolling: 'touch', // Better scrolling on iOS
                  }}
                >
                  {/* Selected Plan */}
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-2">📦 Selected Plan</h3>
                    <p className="text-blue-400 font-medium">{pkg.name} • {pkg.price}{pkg.period}</p>
                  </div>

                  {/* NEW: Photography Services Section */}
                  <div className="border-2 border-purple-700 rounded-xl p-5 bg-purple-900/20">
                    <h4 className="text-white font-semibold text-lg mb-4">📸 Photography Services</h4>
                    
                    <div className="space-y-4 text-gray-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                          <h5 className="text-purple-400 font-semibold mb-2">🎯 Session Details</h5>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span><strong>One Studio Photo Shoot:</strong> Single session as described</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span><strong>Session Length:</strong> 1 hour of shooting time</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span><strong>Professional Lighting:</strong> All lighting equipment provided</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span><strong>Multiple Looks:</strong> As many as can fit in allotted time</span>
                            </li>
                            <li className="flex items-start gap-2">
  <span className="text-purple-400 mt-1">•</span>
  <span><strong>Monthly Frequency:</strong> One shoot per month (for subscription packages)</span>
</li>
                          </ul>
                        </div>
                        
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                          <h5 className="text-purple-400 font-semibold mb-2">📦 Deliverables</h5>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span><strong>Digital Gallery:</strong> Professionally edited high-resolution images</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span><strong>Image Selection:</strong> Photographer selects best shots</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span><strong>Online Delivery:</strong> Secure digital gallery access</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span><strong>Number of Images:</strong> Final count at photographer's discretion</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                        <h5 className="text-amber-400 font-semibold mb-2">👤 Client Responsibilities</h5>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span><strong>Outfits & Styling:</strong> Client provides all outfits, hair, and makeup</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span><strong>Punctuality:</strong> Session end time fixed, no extensions for late arrivals</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span><strong>Location:</strong> Sessions at designated studio unless otherwise agreed</span>
                          </li>
                          <li className="flex items-start gap-2">
  <span className="text-purple-400 mt-1">•</span>
  <span><strong>Travel Fees:</strong> Additional locations may incur travel expenses</span>
</li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span><strong>Travel Fees:</strong> Additional locations may incur travel fees</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h5 className="text-blue-400 font-semibold mb-2">📅 Scheduling & Availability</h5>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong>Mutual Scheduling:</strong> Sessions scheduled based on mutual availability</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong>Photographer's Discretion:</strong> Final scheduling subject to photographer's availability</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong>Advance Booking:</strong> Recommended to schedule well in advance</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* NEW: Photography Intellectual Property Section */}
                  <div className="border-2 border-purple-700 rounded-xl p-5 bg-purple-900/20">
                    <h4 className="text-white font-semibold text-lg mb-4">📷 Photography Intellectual Property</h4>
                    
                    <div className="space-y-4 text-gray-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                          <h5 className="text-purple-400 font-semibold mb-2">© Photographer's Rights</h5>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span><strong>Copyright Ownership:</strong> Photographer retains full copyright to all images</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span><strong>Portfolio Usage:</strong> Right to use images for self-promotion</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span><strong>Reproduction Rights:</strong> Can display on website, social media, portfolio</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span><strong>Model Release:</strong> Client agrees to portfolio usage</span>
                            </li>
                            <li className="flex items-start gap-2">
  <span className="text-green-400 mt-1">•</span>
  <span><strong>Credit Appreciation:</strong> While not required, photo credit is appreciated when sharing online</span>
</li>
                          </ul>
                        </div>
                        
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                          <h5 className="text-green-400 font-semibold mb-2">✅ Client's Rights</h5>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span><strong>Print Release:</strong> Can print and share images personally</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span><strong>Social Media:</strong> Can share on personal social media</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span><strong>Personal Use:</strong> For personal, non-commercial purposes</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span><strong>Commercial Licensing:</strong> Available separately if needed</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                        <h5 className="text-amber-400 font-semibold mb-2">🚫 Usage Restrictions</h5>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span><strong>No Commercial Use:</strong> Cannot use for business advertising</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span><strong>No Resale:</strong> Cannot sell images to third parties</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span><strong>No Alterations:</strong> Cannot significantly edit or modify images</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span><strong>Brand Endorsement:</strong> Cannot imply photographer endorsement</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Commercial Licensing Terms */}
<div className="border-2 border-green-700 rounded-xl p-5 bg-green-900/20">
  <h4 className="text-white font-semibold text-lg mb-4">💼 Commercial Licensing</h4>
  
  <div className="space-y-4 text-gray-300">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
        <h5 className="text-amber-400 font-semibold mb-2">🚫 Personal Use Only</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span><strong>No Business Use:</strong> Cannot use for company website, ads, or marketing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span><strong>No Product Promotion:</strong> Cannot use to sell products or services</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span><strong>No Stock Sales:</strong> Cannot sell images to stock agencies or third parties</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <h5 className="text-green-400 font-semibold mb-2">💳 Commercial Licenses Available</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Business Social Media:</strong> $150 additional</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Website & Marketing:</strong> $300 additional</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Full Commercial Buyout:</strong> Starting at $500</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
      <h5 className="text-blue-400 font-semibold mb-2">📞 How to License</h5>
      <p className="text-sm">
        If you need images for business purposes, <strong>contact us before your session</strong> to discuss commercial licensing options. 
        Licensing fees are determined by usage scope, audience size, and duration. Retroactive licensing fees are 2x the standard rate.
      </p>
    </div>
  </div>
</div>

{/* Model Release Section */}
<div className="border-2 border-purple-700 rounded-xl p-5 bg-purple-900/20">
  <h4 className="text-white font-semibold text-lg mb-4">📸 Model Release & Portfolio Usage</h4>
  
  <div className="space-y-4 text-gray-300">
    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
      <h5 className="text-purple-400 font-semibold mb-2">🎭 Grant of Permission</h5>
      <p className="text-sm mb-3">
        By accepting this agreement, you grant the Photographer irrevocable permission to use your likeness in images created during this session for business promotion purposes.
      </p>
      <ul className="text-sm space-y-2">
        <li className="flex items-start gap-2">
          <span className="text-purple-400 mt-1">•</span>
          <span><strong>Portfolio Display:</strong> Website, printed portfolio, studio displays</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-purple-400 mt-1">•</span>
          <span><strong>Social Media:</strong> Instagram, Facebook, Pinterest, other platforms</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-purple-400 mt-1">•</span>
          <span><strong>Advertising:</strong> Online ads, marketing materials, brochures</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-purple-400 mt-1">•</span>
          <span><strong>Educational:</strong> Workshops, tutorials, photography education</span>
        </li>
      </ul>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <h5 className="text-green-400 font-semibold mb-2">✅ What This Allows</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Showcasing our work to potential clients</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Building our photography portfolio</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span>Demonstrating our style and quality</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h5 className="text-blue-400 font-semibold mb-2">🔒 Privacy Considerations</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span><strong>No Personal Information:</strong> We never share your name or contact details</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span><strong>Professional Use Only:</strong> Images used tastefully and professionally</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span><strong>Opt-Out Available:</strong> Contact us if you have specific concerns</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
      <h5 className="text-amber-400 font-semibold mb-2">⚠️ Important Note</h5>
      <p className="text-sm">
        This model release is <strong>essential for our business</strong> and allows us to continue creating amazing work for our clients. 
        If you have specific concerns about certain images being used, please discuss them with us before your session.
      </p>
    </div>
  </div>
</div>

                  {/* NEW: Photography Limitation of Liability */}
                  <div className="border-2 border-red-700 rounded-xl p-5 bg-red-900/20">
                    <h4 className="text-white font-semibold text-lg mb-4">⚖️ Photography Service Limitations</h4>
                    
                    <div className="space-y-4 text-gray-300">
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <h5 className="text-red-400 font-semibold mb-2">🛡️ Service Guarantees</h5>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>
                            <span><strong>Rescheduling:</strong> If photographer cannot perform, session will be rescheduled</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>
                            <span><strong>Refund Limit:</strong> Maximum liability is session fee refund</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>
                            <span><strong>Equipment Failure:</strong> Not liable for equipment issues beyond control</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>
                            <span><strong>Illness/Emergency:</strong> Reschedule option for photographer emergencies</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                        <h5 className="text-amber-400 font-semibold mb-2">📝 Important Disclaimers</h5>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span><strong>Image Count:</strong> Number of final images not guaranteed</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span><strong>Creative Control:</strong> Photographer has final selection of images</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span><strong>Style & Editing:</strong> Editing style at photographer's discretion</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span><strong>Client Satisfaction:</strong> While we aim for excellence, specific outcomes not guaranteed</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Rescheduling & Cancellation Policy*/}
<div className="border-2 border-orange-700 rounded-xl p-5 bg-orange-900/20">
  <h4 className="text-white font-semibold text-lg mb-4">🔄 Rescheduling & Cancellation</h4>

  <div className="space-y-4 text-gray-300">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <h5 className="text-green-400 font-semibold mb-2">✅ Rescheduling</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>48-Hour Notice:</strong> Free rescheduling with 48+ hours notice</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>One-Time Change:</strong> One free reschedule per booking</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Availability:</strong> Subject to photographer's calendar</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <h5 className="text-red-400 font-semibold mb-2">❌ Late Cancellations</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1">•</span>
            <span><strong>Less than 48 hours:</strong> 50% rescheduling fee</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1">•</span>
            <span><strong>No-Show:</strong> Session fee forfeited</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 mt-1">•</span>
            <span><strong>Emergency:</strong> Case-by-case consideration</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
      <h5 className="text-blue-400 font-semibold mb-2">🌦️ Weather & Emergencies</h5>
      <ul className="text-sm space-y-2">
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span><strong>Weather Cancellations:</strong> Free reschedule for outdoor sessions</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span><strong>Photographer Emergencies:</strong> Full refund or priority reschedule</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span><strong>Force Majeure:</strong> Not liable for events beyond our control</span>
        </li>
      </ul>
    </div>
  </div>
</div>

            {/* Image Delivery & Timeline */}
<div className="border-2 border-blue-700 rounded-xl p-5 bg-blue-900/20">
  <h4 className="text-white font-semibold text-lg mb-4">⏱️ Image Delivery & Timeline</h4>
  
  <div className="space-y-4 text-gray-300">
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
      <h5 className="text-blue-400 font-semibold mb-2">📦 Delivery Process</h5>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">1</div>
          <div>
            <strong className="text-white">Proof Gallery (3-5 days):</strong> Initial selection of unedited images for review
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">2</div>
          <div>
            <strong className="text-white">Client Selection (2 days):</strong> You choose your preferred images for editing
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">3</div>
          <div>
            <strong className="text-white">Final Editing (5-7 days):</strong> Professional editing of selected images
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">4</div>
          <div>
            <strong className="text-white">Gallery Delivery (10-14 days total):</strong> Final high-resolution images delivered via online gallery
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
        <h5 className="text-amber-400 font-semibold mb-2">⚠️ Timeline Notes</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span><strong>Peak Seasons:</strong> Delivery may extend to 21 days during busy periods</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span><strong>Rush Service:</strong> Available for additional fee (50% extra)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span><strong>Client Delays:</strong> Timeline extends if client takes longer than 2 days to select images</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <h5 className="text-green-400 font-semibold mb-2">✅ Gallery Access</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Download Period:</strong> 30 days from delivery</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Extended Access:</strong> Available for $25/month after 30 days</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Backup Responsibility:</strong> Client responsible for downloading and backing up images</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>   

{/* Videography Services Section */}
<div className="border-2 border-orange-700 rounded-xl p-5 bg-orange-900/20">
  <h4 className="text-white font-semibold text-lg mb-4">🎥 Videography Services</h4>
  
  <div className="space-y-4 text-gray-300">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
        <h5 className="text-orange-400 font-semibold mb-2">🎬 Session Details</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">•</span>
            <span><strong>One Video Session:</strong> Single videography session as described</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">•</span>
            <span><strong>Session Length:</strong> 1 to 2 hours of filming time</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">•</span>
            <span><strong>Professional Equipment:</strong> 4K cameras, lighting, and audio provided</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">•</span>
            <span><strong>Multiple Setups:</strong> Various angles and scenes within allotted time</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
        <h5 className="text-orange-400 font-semibold mb-2">📦 Deliverables</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">•</span>
            <span><strong>Final Video:</strong> 1-3 minute professionally edited video</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">•</span>
            <span><strong>Resolution:</strong> 4K UHD or 1080p Full HD delivery</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">•</span>
            <span><strong>Format:</strong> MP4 with H.264 compression</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">•</span>
            <span><strong>Online Delivery:</strong> Secure digital download link</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
      <h5 className="text-amber-400 font-semibold mb-2">👤 Client Responsibilities</h5>
      <ul className="text-sm space-y-2">
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>Content Preparation:</strong> Client provides script, talking points, or creative direction</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>Wardrobe & Styling:</strong> Client responsible for outfits and appearance</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>Location Access:</strong> Client secures necessary permits or permissions</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>Talent Release:</strong> Client ensures all participants sign release forms</span>
        </li>
      </ul>
    </div>

    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
      <h5 className="text-blue-400 font-semibold mb-2">⏱️ Production Timeline</h5>
      <ul className="text-sm space-y-2">
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span><strong>Pre-Production:</strong> 1-2 weeks for planning and preparation</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span><strong>Filming:</strong> Scheduled session date</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span><strong>Post-Production:</strong> 2-3 weeks for editing and revisions</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span><strong>Final Delivery:</strong> 3-4 weeks total from filming date</span>
        </li>
      </ul>
    </div>
  </div>
</div>

{/* Videography Intellectual Property Section */}
<div className="border-2 border-orange-700 rounded-xl p-5 bg-orange-900/20">
  <h4 className="text-white font-semibold text-lg mb-4">🎬 Videography Intellectual Property</h4>
  
  <div className="space-y-4 text-gray-300">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
        <h5 className="text-orange-400 font-semibold mb-2">© Videographer's Rights</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">•</span>
            <span><strong>Copyright Ownership:</strong> Videographer retains full copyright to all footage</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">•</span>
            <span><strong>Portfolio Usage:</strong> Right to use clips for self-promotion</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">•</span>
            <span><strong>B-Roll Rights:</strong> Can use unused footage for other projects</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">•</span>
            <span><strong>Behind-the-Scenes:</strong> May film/document the production process</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <h5 className="text-green-400 font-semibold mb-2">✅ Client's Rights</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Usage License:</strong> Can use final video for intended purpose</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Distribution:</strong> Can share on websites, social media, presentations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Archive Rights:</strong> Can store and backup final video files</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Raw Footage:</strong> Available for purchase (additional fee)</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
      <h5 className="text-amber-400 font-semibold mb-2">🚫 Usage Restrictions</h5>
      <ul className="text-sm space-y-2">
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>No Resale:</strong> Cannot sell video to third parties</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>No Alterations:</strong> Cannot significantly edit final delivered video</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>No Stock Footage:</strong> Cannot license as stock footage</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>Credit Required:</strong> Must credit videographer when used publicly</span>
        </li>
      </ul>
    </div>
  </div>
</div>
      
      {/* Videography Revisions & Approval Section */}
<div className="border-2 border-blue-700 rounded-xl p-5 bg-blue-900/20">
  <h4 className="text-white font-semibold text-lg mb-4">🔄 Video Revisions & Approval Process</h4>
  
  <div className="space-y-4 text-gray-300">
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
      <h5 className="text-blue-400 font-semibold mb-2">📋 Revision Process</h5>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">1</div>
          <div>
            <strong className="text-white">First Cut (14 days):</strong> Initial edit with basic structure and timing
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">2</div>
          <div>
            <strong className="text-white">Client Feedback (5 days):</strong> You provide detailed revision requests
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">3</div>
          <div>
            <strong className="text-white">Second Cut (7 days):</strong> Revised version incorporating feedback
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">4</div>
          <div>
            <strong className="text-white">Final Approval (3 days):</strong> You approve final version for delivery
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <h5 className="text-green-400 font-semibold mb-2">✅ Included Revisions</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Two Rounds:</strong> Two comprehensive revision rounds included</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Minor Changes:</strong> Color correction, timing, text adjustments</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Music Changes:</strong> One soundtrack change per round</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
        <h5 className="text-amber-400 font-semibold mb-2">🚫 Additional Revisions</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span><strong>Extra Rounds:</strong> $150 per additional revision round</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span><strong>Major Changes:</strong> Restructuring or refilming requires new quote</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span><strong>Rush Fees:</strong> 50% extra for expedited revisions</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

{/* Audio Services section */}
<div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
  <h5 className="text-orange-400 font-semibold mb-2">🎵 Audio & Music Licensing</h5>
  <ul className="text-sm space-y-2">
    <li className="flex items-start gap-2">
      <span className="text-orange-400 mt-1">•</span>
      <span><strong>Royalty-Free Music:</strong> We provide licensed background music</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-orange-400 mt-1">•</span>
      <span><strong>Client Music:</strong> You responsible for licensing if specific music requested</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-orange-400 mt-1">•</span>
      <span><strong>Voiceover:</strong> Additional fee for professional voiceover services</span>
    </li>
  </ul>
</div>

{/* Graphic Design Services Section */}
<div className="border-2 border-teal-700 rounded-xl p-5 bg-teal-900/20">
  <h4 className="text-white font-semibold text-lg mb-4">🎨 Graphic Design Services</h4>
  
  <div className="space-y-4 text-gray-300">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4">
        <h5 className="text-teal-400 font-semibold mb-2">✨ Design Scope</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-teal-400 mt-1">•</span>
            <span><strong>Project-Based:</strong> Single design project as specified</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-400 mt-1">•</span>
            <span><strong>Deliverables:</strong> Logo, branding, marketing materials, etc.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-400 mt-1">•</span>
            <span><strong>File Formats:</strong> Source files + common formats (AI, PSD, PDF, PNG, JPG)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-400 mt-1">•</span>
            <span><strong>Resolution:</strong> Print-ready (300dpi) and web-optimized versions</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4">
        <h5 className="text-teal-400 font-semibold mb-2">📦 Design Process</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-teal-400 mt-1">•</span>
            <span><strong>Discovery Phase:</strong> Initial consultation and creative brief</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-400 mt-1">•</span>
            <span><strong>Concept Development:</strong> 2-3 initial design concepts</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-400 mt-1">•</span>
            <span><strong>Revisions:</strong> Refinement of selected concept</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-400 mt-1">•</span>
            <span><strong>Final Delivery:</strong> All file formats and usage guidelines</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
      <h5 className="text-amber-400 font-semibold mb-2">👤 Client Responsibilities</h5>
      <ul className="text-sm space-y-2">
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>Creative Brief:</strong> Provide clear direction, examples, and requirements</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>Brand Assets:</strong> Supply logos, fonts, colors, and style guides</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>Content:</strong> Provide all text, images, and other content needed</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>Timely Feedback:</strong> Respond within agreed timeframes</span>
        </li>
      </ul>
    </div>

    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
      <h5 className="text-blue-400 font-semibold mb-2">⏱️ Project Timeline</h5>
      <ul className="text-sm space-y-2">
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span><strong>Initial Concepts:</strong> 5-7 business days from project start</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span><strong>Revision Rounds:</strong> 2-3 days per round after client feedback</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span><strong>Final Delivery:</strong> 10-14 business days total project duration</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span><strong>Complex Projects:</strong> Timeline may extend for multi-component projects</span>
        </li>
      </ul>
    </div>
  </div>
</div>

{/* Graphic Design Intellectual Property Section */}
<div className="border-2 border-teal-700 rounded-xl p-5 bg-teal-900/20">
  <h4 className="text-white font-semibold text-lg mb-4">💎 Design Intellectual Property</h4>
  
  <div className="space-y-4 text-gray-300">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4">
        <h5 className="text-teal-400 font-semibold mb-2">© Designer's Rights</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-teal-400 mt-1">•</span>
            <span><strong>Portfolio Rights:</strong> Can display completed work in portfolio</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-400 mt-1">•</span>
            <span><strong>Case Studies:</strong> May use project for case studies and awards</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-400 mt-1">•</span>
            <span><strong>Process Documentation:</strong> Can document design process for educational purposes</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <h5 className="text-green-400 font-semibold mb-2">✅ Client's Rights</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Full Copyright Transfer:</strong> Upon final payment, client receives copyright</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Unlimited Usage:</strong> Can use designs for any business purpose</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Modification Rights:</strong> Can modify and adapt designs as needed</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Source Files:</strong> Receive all original design files</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
      <h5 className="text-amber-400 font-semibold mb-2">🚫 Usage Restrictions</h5>
      <ul className="text-sm space-y-2">
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>No Resale:</strong> Cannot resell designs as templates or products</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>Attribution:</strong> Credit appreciated but not required</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>Third-Party Elements:</strong> Client responsible for licensed fonts/images</span>
        </li>
      </ul>
    </div>
  </div>
</div>
{/* Graphic Design Revisions Section */}
<div className="border-2 border-purple-700 rounded-xl p-5 bg-purple-900/20">
  <h4 className="text-white font-semibold text-lg mb-4">🔄 Design Revisions & Approval</h4>
  
  <div className="space-y-4 text-gray-300">
    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
      <h5 className="text-purple-400 font-semibold mb-2">📋 Revision Structure</h5>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">1</div>
          <div>
            <strong className="text-white">Initial Concepts (2-3 options):</strong> We present different design directions
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">2</div>
          <div>
            <strong className="text-white">Client Selection:</strong> You choose one concept to develop further
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">3</div>
          <div>
            <strong className="text-white">Revision Rounds (2 included):</strong> Refine selected concept
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">4</div>
          <div>
            <strong className="text-white">Final Approval:</strong> You approve final design for delivery
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <h5 className="text-green-400 font-semibold mb-2">✅ Included Revisions</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Two Rounds:</strong> Two comprehensive revision rounds included</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Color Changes:</strong> Adjustments to color palette</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Text Adjustments:</strong> Typography and copy changes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Layout Tweaks:</strong> Minor positioning and spacing changes</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
        <h5 className="text-amber-400 font-semibold mb-2">🚫 Additional Revisions</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span><strong>Extra Rounds:</strong> $75 per additional revision round</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span><strong>Concept Changes:</strong> Switching to different concept requires new quote</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">•</span>
            <span><strong>Scope Expansion:</strong> Additional deliverables require separate agreement</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
      <h5 className="text-blue-400 font-semibold mb-2">💡 Revision Guidelines</h5>
      <ul className="text-sm space-y-2">
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span><strong>Consolidated Feedback:</strong> Provide all feedback in single document/email</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span><strong>Specific Requests:</strong> Clear, actionable revision requests work best</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span><strong>Timely Responses:</strong> 3-business day response time keeps project on track</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span><strong>Stakeholder Approval:</strong> Ensure all decision-makers review before feedback</span>
        </li>
      </ul>
    </div>
  </div>
</div>

{/* Content & Asset Requirements */}
<div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4">
  <h5 className="text-teal-400 font-semibold mb-2">🖋️ Content & Asset Requirements</h5>
  <ul className="text-sm space-y-2">
    <li className="flex items-start gap-2">
      <span className="text-teal-400 mt-1">•</span>
      <span><strong>Client Content:</strong> You must provide all text content and brand assets</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-teal-400 mt-1">•</span>
      <span><strong>Image Rights:</strong> You responsible for image licensing and permissions</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-teal-400 mt-1">•</span>
      <span><strong>Font Licensing:</strong> Commercial font licenses not included</span>
    </li>
  </ul>
</div>

                  {/* Comprehensive Legal Sections */}
                  <div className="space-y-6">
                    {/* 1. Advisory Nature Section */}
                    <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
                      <h4 className="text-white font-semibold text-lg mb-4">🎯 Advisory Nature of Services</h4>
                      
                      <div className="space-y-4 text-gray-300">
                        <p className="leading-relaxed">
                          Our partnership and creative consulting services are strictly <strong>advisory in nature</strong>. We provide strategic guidance, frameworks, and recommendations based on our expertise and industry knowledge. However, we cannot and do not guarantee specific business outcomes, revenue increases, partnership successes, or any other specific results.
                        </p>
                        
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                          <h5 className="text-amber-400 font-semibold mb-2">📊 What This Means For You:</h5>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>Your Success Depends on Your Execution:</strong> The value you receive depends on your team's ability to implement our recommendations within your specific business context</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>Market Factors Matter:</strong> External market conditions, competition, timing, and economic factors significantly impact outcomes</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>No Financial Guarantees:</strong> We do not guarantee ROI, revenue increases, cost savings, or any specific financial metrics</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>Partnership Outcomes Vary:</strong> Success in forming and maintaining partnerships depends on many factors beyond our control</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>Creative Outcomes Vary:</strong> Success in forming and maintaining creative ecosystems depends on many factors beyond our control</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                          <h5 className="text-blue-400 font-semibold mb-2">💡 Our Commitment:</h5>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>We provide our best professional advice based on proven frameworks and industry experience</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>We're transparent about the advisory nature of our services from the beginning</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>We focus on providing actionable strategies and measurable improvements to your creative approach</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 2. Subscription & Billing Terms */}
                    <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
                      <h4 className="text-white font-semibold text-lg mb-4">💰 Subscription & Billing Terms</h4>
                      
                      <div className="space-y-4 text-gray-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                            <h5 className="text-green-400 font-semibold mb-2">✅ 30-Day Satisfaction Guarantee</h5>
                            <ul className="text-sm space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span><strong>Full Refund:</strong> Get 100% refund within first 30 days if not satisfied</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span><strong>Written Request:</strong> Submit detailed explanation of dissatisfaction</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span><strong>No Questions Asked:</strong> We respect your decision and process promptly</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <h5 className="text-blue-400 font-semibold mb-2">🔄 Billing Cycle</h5>
                            <ul className="text-sm space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span><strong>Monthly Billing:</strong> Charged in advance each month</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span><strong>Auto-Renewal:</strong> Continues until you cancel</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span><strong>Cancel Anytime:</strong> 30-day notice for cancellation</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                          <h5 className="text-red-400 font-semibold mb-2">🚫 Refund Policy Limitations</h5>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              <span><strong>No Refunds After 30 Days:</strong> The satisfaction guarantee applies only to the first 30 days of service</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              <span><strong>Custom Work Exclusion:</strong> No refunds for custom framework development or implementation work</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              <span><strong>Services Rendered:</strong> No refunds for services already provided or consultations already conducted</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-400 mt-1">•</span>
                              <span><strong>Third-Party Costs:</strong> No refunds for third-party tool subscriptions or external costs incurred</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                          <h5 className="text-amber-400 font-semibold mb-2">📝 Important Billing Details</h5>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>Price Changes:</strong> We provide 30-day notice for any price increases</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>Service Continuity:</strong> Services continue during cancellation notice period</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>No Prorated Refunds:</strong> We don't provide partial refunds for mid-month cancellations</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>Payment Methods:</strong> Keep your payment information current to avoid service interruption</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                          <h5 className="text-blue-400 font-semibold mb-2">💡 Transparent Pricing</h5>
                          <p className="text-sm">
                            We believe in clear, straightforward pricing. There are no hidden fees, setup charges, or unexpected costs. 
                            The price you see is the price you pay, and we'll always notify you well in advance of any changes.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 3. Intellectual Property Rights */}
                    <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
                      <h4 className="text-white font-semibold text-lg mb-4">🔒 Intellectual Property Rights</h4>
                      
                      <div className="space-y-4 text-gray-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <h5 className="text-blue-400 font-semibold mb-2">🛡️ Our IP Protection</h5>
                            <ul className="text-sm space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span><strong>Frameworks & Methodologies:</strong> We retain all rights to our partnership and creative frameworks, tools, and methodologies</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span><strong>License Grant:</strong> You receive a limited license to use our frameworks during active subscription</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span><strong>No Transfer of Ownership:</strong> Services provided do not transfer IP ownership</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                            <h5 className="text-green-400 font-semibold mb-2">✅ Your IP Protection</h5>
                            <ul className="text-sm space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span><strong>Your Business Data:</strong> You retain all rights to your confidential business information</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span><strong>Pre-existing IP:</strong> Your existing intellectual property remains yours</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span><strong>Mutual Confidentiality:</strong> Both parties agree to protect each other's confidential information</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                          <h5 className="text-amber-400 font-semibold mb-2">⚠️ IP Usage Restrictions</h5>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>No Reselling:</strong> You may not resell, license, or distribute our frameworks to third parties</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>No Reverse Engineering:</strong> You may not reverse engineer or copy our methodologies</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>License Termination:</strong> Your license to use our frameworks terminates when your subscription ends</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 4. Data Protection & Privacy */}
                    <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
                      <h4 className="text-white font-semibold text-lg mb-4">🛡️ Data Protection & Privacy</h4>
                      
                      <div className="space-y-4 text-gray-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <h5 className="text-blue-400 font-semibold mb-2">🛡️ Your Data Rights</h5>
                            <ul className="text-sm space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span><strong>Data Ownership:</strong> You retain all rights to your business data</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span><strong>Access & Portability:</strong> You can request your data at any time</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span><strong>Data Deletion:</strong> Request deletion of your data upon termination</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <h5 className="text-blue-400 font-semibold mb-2">🔐 Our Security Commitments</h5>
                            <ul className="text-sm space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span><strong>Reasonable Security:</strong> We implement industry-standard protections</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span><strong>Data Encryption:</strong> Sensitive data is encrypted in transit and at rest</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span><strong>Access Controls:</strong> Strict internal access controls to your data</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                          <h5 className="text-amber-400 font-semibold mb-2">⚠️ Important Limitations</h5>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>No Absolute Security:</strong> We cannot guarantee 100% data security against sophisticated attacks</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>Your Backup Responsibility:</strong> You are responsible for maintaining your own data backups</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>Third-Party Services:</strong> We're not liable for data breaches in third-party tools we recommend</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>Force Majeure:</strong> Not liable for data loss due to events beyond our reasonable control</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                          <h5 className="text-green-400 font-semibold mb-2">📋 Data Usage & Analytics</h5>
                          <p className="text-sm">
                            We may use <strong>anonymized, aggregated data</strong> for improving our services, creating industry insights, 
                            and developing new frameworks. This data cannot be traced back to your specific business.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 5. Limitation of Liability */}
                    <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
                      <h4 className="text-white font-semibold text-lg mb-4">⚖️ Limitation of Liability</h4>
                      
                      <div className="space-y-4 text-gray-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                            <h5 className="text-red-400 font-semibold mb-2">🚫 Liability Cap</h5>
                            <p className="text-sm">
                              <strong>Our total liability for any claims</strong> related to these services is limited to the <strong>total fees you've paid us in the 6 months immediately preceding the claim</strong>.
                            </p>
                          </div>
                          
                          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                            <h5 className="text-red-400 font-semibold mb-2">🚫 No Consequential Damages</h5>
                            <p className="text-sm">
                              We are <strong>not liable for any indirect, special, incidental, or consequential damages</strong>, including lost profits, lost revenue, or business interruption.
                            </p>
                          </div>
                        </div>

                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                          <h5 className="text-purple-400 font-semibold mb-2">🌪️ Force Majeure Protection</h5>
                          <p className="text-sm">
                            We are <strong>not liable for any failure or delay in performance</strong> due to circumstances beyond our reasonable control, 
                            including but not limited to: acts of God, war, terrorism, government restrictions, pandemics, internet outages, 
                            power failures, or any other events that could not be prevented with reasonable care.
                          </p>
                        </div>
                        <div className="border-2 border-blue-700 rounded-xl p-5 bg-blue-900/20">
  <h4 className="text-white font-semibold text-lg mb-4">🌪️ Force Majeure</h4>
  
  <div className="space-y-4 text-gray-300">
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
      <h5 className="text-blue-400 font-semibold mb-2">🛡️ Unforeseen Circumstances</h5>
      <p className="text-sm mb-3">
        Neither party shall be liable for any failure or delay in performing obligations due to circumstances beyond reasonable control, including but not limited to:
      </p>
      <ul className="text-sm space-y-2">
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span>Natural disasters, severe weather conditions, or acts of God</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span>Government restrictions, pandemics, or health emergencies</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span>Utility failures, internet outages, or power disruptions</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span>Civil unrest, terrorism, or war</span>
        </li>
      </ul>
    </div>

    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
      <h5 className="text-amber-400 font-semibold mb-2">🔄 Rescheduling for Force Majeure</h5>
      <p className="text-sm">
        In such events, affected sessions will be rescheduled at the earliest mutual availability. No refunds will be provided, but session credits will be honored for future rescheduling.
      </p>
    </div>
  </div>
</div>


                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                          <h5 className="text-blue-400 font-semibold mb-2">✅ Fair Protection:</h5>
                          <p className="text-sm">
                            This limitation represents a fair balance - it protects us from catastrophic claims while ensuring you have recourse for genuine service failures. The cap is based on recent fees paid, making it proportional to the services received.
                          </p>
                        </div>
                        <div className="border-2 border-red-700 rounded-xl p-5 bg-red-900/20">
  <h4 className="text-white font-semibold text-lg mb-4">🛡️ Indemnification</h4>
  
  <div className="space-y-4 text-gray-300">
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
      <h5 className="text-red-400 font-semibold mb-2">📜 Client Indemnification</h5>
      <p className="text-sm mb-3">
        You agree to indemnify and hold harmless the Service Provider from any claims, damages, or expenses arising from:
      </p>
      <ul className="text-sm space-y-2">
        <li className="flex items-start gap-2">
          <span className="text-red-400 mt-1">•</span>
          <span>Your use of delivered work in violation of third-party rights</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-400 mt-1">•</span>
          <span>Your breach of this agreement or any warranties</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-400 mt-1">•</span>
          <span>Any content or materials you provided for the project</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-400 mt-1">•</span>
          <span>Your failure to obtain necessary permissions or releases</span>
        </li>
      </ul>
    </div>
  </div>
</div>

{/* Contact & Communication Policy */}
<div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
  <h4 className="text-white font-semibold text-lg mb-4">📞 Communication & Support</h4>
  
  <div className="space-y-4 text-gray-300">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h5 className="text-blue-400 font-semibold mb-2">💬 Communication Channels</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span><strong>Primary:</strong> Email for all formal communications</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span><strong>Response Time:</strong> 24-48 business hours for emails</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span><strong>Urgent:</strong> Phone for session-day emergencies only</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <h5 className="text-green-400 font-semibold mb-2">🕒 Business Hours</h5>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Monday-Friday:</strong> 9:00 AM - 6:00 PM EST</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Weekends:</strong> Emergency sessions only</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>Holidays:</strong> Observe standard US holidays</span>
          </li>
          {/* File Storage & Archive Policy */}
<div className="border-2 border-amber-700 rounded-xl p-5 bg-amber-900/20">
  <h4 className="text-white font-semibold text-lg mb-4">💾 File Storage & Archiving</h4>
  
  <div className="space-y-4 text-gray-300">
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
      <h5 className="text-amber-400 font-semibold mb-2">📦 File Retention Policy</h5>
      <ul className="text-sm space-y-2">
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>Final Deliverables:</strong> Stored for 6 months after delivery</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>Raw Files:</strong> Stored for 3 months (photography/videography)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>Source Files:</strong> Stored for 1 year (graphic design)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 mt-1">•</span>
          <span><strong>Extended Storage:</strong> Available for additional fee</span>
        </li>
      </ul>
    </div>

    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
      <h5 className="text-red-400 font-semibold mb-2">⚠️ Client Backup Responsibility</h5>
      <p className="text-sm">
        You are solely responsible for downloading, backing up, and archiving all delivered files. 
        We are not liable for any data loss after the delivery period expires.
      </p>
    </div>
  </div>
</div>
        </ul>
      </div>
    </div>
  </div>
</div>

                      </div>
                    </div>

                    {/* 6. Dispute Resolution & Arbitration */}
                    <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
                      <h4 className="text-white font-semibold text-lg mb-4">⚖️ Dispute Resolution & Arbitration</h4>
                      
                      <div className="space-y-4 text-gray-300">
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                          <h5 className="text-purple-400 font-semibold mb-2">🔄 Step-by-Step Resolution Process</h5>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                              <div>
                                <strong className="text-white">Direct Negotiation (30 days):</strong> Both parties agree to attempt to resolve disputes through good-faith negotiation
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                              <div>
                                <strong className="text-white">Mediation (Optional):</strong> If negotiation fails, we may pursue mediation with a neutral third party
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                              <div>
                                <strong className="text-white">Binding Arbitration:</strong> If resolution isn't reached, disputes will be settled by binding arbitration
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                            <h5 className="text-amber-400 font-semibold mb-2">🎯 Arbitration Details</h5>
                            <ul className="text-sm space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-amber-400 mt-1">•</span>
                                <span><strong>Binding & Final:</strong> Arbitration decisions are final and enforceable in court</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-amber-400 mt-1">•</span>
                                <span><strong>Efficient:</strong> Typically faster and less expensive than court proceedings</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-amber-400 mt-1">•</span>
                                <span><strong>Expert Arbitrators:</strong> Cases are heard by professionals with relevant expertise</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                            <h5 className="text-amber-400 font-semibold mb-2">🚫 What You're Waiving</h5>
                            <ul className="text-sm space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-amber-400 mt-1">•</span>
                                <span><strong>Jury Trials:</strong> You waive your right to a jury trial</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-amber-400 mt-1">•</span>
                                <span><strong>Class Actions:</strong> You waive your right to participate in class actions</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-amber-400 mt-1">•</span>
                                <span><strong>Court Proceedings:</strong> You waive your right to sue in court</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                          <h5 className="text-blue-400 font-semibold mb-2">💡 Why This Benefits You:</h5>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span><strong>Lower Costs:</strong> Arbitration is typically more affordable than court cases</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span><strong>Faster Resolution:</strong> Disputes are resolved in months rather than years</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span><strong>Expert Decisions:</strong> Arbitrators understand business and service disputes</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span><strong>Confidentiality:</strong> Proceedings are private, protecting your business information</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Complete Legal Agreement Section */}
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <h4 className="text-white font-semibold mb-3">📄 Complete Legal Agreement</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                        <div>
                          <h5 className="text-blue-400 font-semibold mb-2">✅ Entire Agreement</h5>
                          <p>
                            This document constitutes the <strong>complete and exclusive understanding</strong> between us regarding the services. 
                            It supersedes all prior discussions, agreements, and understandings of any kind.
                          </p>
                        </div>
                        <div>
                          <h5 className="text-green-400 font-semibold mb-2">⚖️ Severability</h5>
                          <p>
                            If any part of this agreement is found unenforceable, the <strong>remainder continues in full force</strong>. 
                            We'll replace invalid provisions with valid ones that achieve similar economic effect.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Scroll to bottom indicator */}
                    <div ref={bottomRef} className="text-center py-8">
                      {!hasScrolledToBottom ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6"
                        >
                          <div className="flex items-center justify-center gap-3 mb-3">
                            <svg className="w-6 h-6 text-blue-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            <span className="text-blue-400 font-semibold">Keep scrolling to review all terms</span>
                            <svg className="w-6 h-6 text-blue-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                          <p className="text-gray-400 text-sm">
                            Please read through all sections above before proceeding
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-green-500/10 border border-green-500/20 rounded-xl p-6"
                        >
                          <div className="flex items-center justify-center gap-3 mb-3">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-green-400 font-semibold text-lg">All Terms Reviewed</span>
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-gray-300 text-sm">
                            You may now proceed to accept the agreement and continue to client information
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-800 p-6 bg-gray-900/50 sticky bottom-0">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => {
                        setShowTerms(false)
                        setFlowStep('service-agreement')
                      }}
                      className="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium flex-1"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleServiceAgreementAccept}
                      disabled={!hasScrolledToBottom}
                      className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 transform ${
                        hasScrolledToBottom
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 hover:scale-105 shadow-lg shadow-blue-500/25'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      } flex-1`}
                    >
                      {hasScrolledToBottom ? (
                        '✅ Accept Agreement & Continue'
                      ) : (
                        'Scroll to Review All Terms'
                      )}
                    </button>
                  </div>
                  <p className="text-center text-gray-500 text-xs mt-3">
                    {hasScrolledToBottom 
                      ? 'By clicking "Accept", you acknowledge reading and understanding all terms and agree to be legally bound'
                      : 'Please scroll through all terms before accepting'
                    }
                  </p>
                  
                  {/* Mobile helper text */}
                  <div className="block sm:hidden mt-2">
                    <p className="text-center text-blue-400 text-xs">
                      {!hasScrolledToBottom && '💡 Tip: Swipe up to scroll through all terms'}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Terms Acceptance Flow */}
            {flowStep === 'terms-acceptance' && (
              <div className="h-full">
                <div className="border-b border-gray-800 p-6 bg-gradient-to-r from-gray-900 to-black sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Client Information & Terms</h2>
                      <p className="text-gray-400 text-sm mt-1">Complete your details to proceed</p>
                    </div>
                    <button 
                      onClick={handleBackToServiceAgreement}
                      className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="h-[calc(95vh-200px)] overflow-hidden">
                  <TermsAcceptanceFlow 
                    package={pkg.name}
                    onAccept={handleTermsAccept}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  )
}