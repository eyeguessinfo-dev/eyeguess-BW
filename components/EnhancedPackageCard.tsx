'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

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
}

export default function EnhancedPackageCard({ pkg, index }: EnhancedPackageCardProps) {
  const [showTerms, setShowTerms] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const termsContainerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollCheckRef = useRef<NodeJS.Timeout>()

  const handlePackageSelect = () => {
    setShowTerms(true)
  }

  const handleAccept = () => {
    if (hasScrolledToBottom) {
      window.location.href = pkg.stripeLink
    }
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
    if (showTerms) {
      setHasScrolledToBottom(false)
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        if (termsContainerRef.current) {
          termsContainerRef.current.scrollTop = 0
        }
      }, 100)
    }
  }, [showTerms])

  // Force enable after a reasonable time as fallback
  useEffect(() => {
    if (showTerms && !hasScrolledToBottom) {
      const fallbackTimer = setTimeout(() => {
        setHasScrolledToBottom(true)
      }, 30000) // 30 second fallback

      return () => clearTimeout(fallbackTimer)
    }
  }, [showTerms, hasScrolledToBottom])

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

      {/* Detailed Legal Terms Modal */}
      {showTerms && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowTerms(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-gray-800 p-6 bg-gradient-to-r from-gray-900 to-black sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Service Agreement</h2>
                  <p className="text-gray-400 text-sm mt-1">Please read through all terms carefully</p>
                </div>
                <button 
                  onClick={() => setShowTerms(false)}
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

              {/* Legal Sections */}
              <div className="space-y-6">
                {/* 1. Advisory Nature Section */}
                <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
                  <h4 className="text-white font-semibold text-lg mb-4">🎯 Advisory Nature of Services</h4>
                  
                  <div className="space-y-4 text-gray-300">
                    <p className="leading-relaxed">
                      Our partnership consulting services are strictly <strong>advisory in nature</strong>. We provide strategic guidance, frameworks, and recommendations based on our expertise and industry knowledge. However, we cannot and do not guarantee specific business outcomes, revenue increases, partnership successes, or any other specific results.
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
                          <span>We focus on providing actionable strategies and measurable improvements to your partnership approach</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 2. Liability Limitation Section */}
                <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
                  <h4 className="text-white font-semibold text-lg mb-4">🛡️ Limitation of Liability</h4>
                  
                  <div className="space-y-4 text-gray-300">
                    <p className="leading-relaxed">
                      To ensure fair and reasonable business practices for both parties, our liability is limited as follows:
                    </p>
                    
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

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                      <h5 className="text-amber-400 font-semibold mb-2">📝 What This Protects:</h5>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 mt-1">•</span>
                          <span><strong>Business Decisions:</strong> We're not liable for business decisions you make based on our advice</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 mt-1">•</span>
                          <span><strong>Market Changes:</strong> We're not liable for market conditions, economic changes, or industry shifts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 mt-1">•</span>
                          <span><strong>Third-Party Actions:</strong> We're not liable for actions of partners, vendors, or other third parties</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 mt-1">•</span>
                          <span><strong>Implementation Results:</strong> We're not liable for how you implement our recommendations</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h5 className="text-blue-400 font-semibold mb-2">✅ Fair Protection:</h5>
                      <p className="text-sm">
                        This limitation represents a fair balance - it protects us from catastrophic claims while ensuring you have recourse for genuine service failures. The cap is based on recent fees paid, making it proportional to the services received.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Dispute Resolution Section */}
                <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
                  <h4 className="text-white font-semibold text-lg mb-4">⚖️ Dispute Resolution & Arbitration</h4>
                  
                  <div className="space-y-4 text-gray-300">
                    <p className="leading-relaxed">
                      We believe in fair and efficient resolution of any disputes. This section outlines our agreed approach:
                    </p>

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

                {/* 4. Subscription Terms Section */}
                <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
                  <h4 className="text-white font-semibold text-lg mb-4">🔄 Subscription & Billing Terms</h4>
                  
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

                {/* 5. Data Protection & Privacy Section */}
                <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
                  <h4 className="text-white font-semibold text-lg mb-4">🔒 Data Protection & Privacy</h4>
                  
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

                {/* 6. Intellectual Property Section */}
                <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
                  <h4 className="text-white font-semibold text-lg mb-4">💡 Intellectual Property Rights</h4>
                  
                  <div className="space-y-4 text-gray-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h5 className="text-blue-400 font-semibold mb-2">🛡️ Our IP Protection</h5>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong>Frameworks & Methodologies:</strong> We retain all rights to our partnership frameworks, tools, and methodologies</span>
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
                        You may now proceed to accept the agreement and continue to payment
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
                  onClick={() => setShowTerms(false)}
                  className="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAccept}
                  disabled={!hasScrolledToBottom}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 transform ${
                    hasScrolledToBottom
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 hover:scale-105 shadow-lg shadow-blue-500/25'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  } flex-1`}
                >
                  {hasScrolledToBottom ? (
                    '✅ Accept Agreement & Continue to Payment'
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
          </motion.div>
        </motion.div>
      )}
    </>
  )
}