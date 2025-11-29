// components/packages/PackageFlowManager.tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import EnhancedPackageCard from './EnhancedPackageCard'
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

interface PackageFlowManagerProps {
  pkg: Package
  index: number
}

export default function PackageFlowManager({ pkg, index }: PackageFlowManagerProps) {
  const [currentStep, setCurrentStep] = useState<'package' | 'service-agreement' | 'terms-acceptance'>('package')
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handlePackageSelect = () => {
    setIsLoading(true)
    setShowModal(true)
    setCurrentStep('service-agreement')
    // Small delay to ensure smooth animation
    setTimeout(() => setIsLoading(false), 300)
  }

  const handleServiceAgreementAccept = () => {
    setCurrentStep('terms-acceptance')
  }

  const handleTermsAccept = (acceptanceId: string) => {
    console.log('Package flow completed with acceptance ID:', acceptanceId)
    // TermsAcceptanceFlow handles the Stripe redirect automatically
    // We just close the modal and reset the flow
    setShowModal(false)
    setCurrentStep('package')
  }

  const handleBack = () => {
    if (currentStep === 'terms-acceptance') {
      setCurrentStep('service-agreement')
    } else if (currentStep === 'service-agreement') {
      setShowModal(false)
      setCurrentStep('package')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setCurrentStep('package')
  }

  // Comprehensive Service Agreement Content based on your terms
  const ServiceAgreementContent = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 p-6 bg-gradient-to-r from-gray-900 to-black sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Service Agreement</h2>
            <p className="text-gray-400 text-sm mt-1">Please review all terms carefully</p>
          </div>
          <button 
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto flex-1 space-y-6">
        {/* Selected Plan */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">📦 Selected Plan</h3>
          <p className="text-blue-400 font-medium">{pkg.name} • {pkg.price}{pkg.period}</p>
        </div>
        {/* Key Agreement Sections */}
        <div className="space-y-6">
          {/* Advisory Nature */}
          <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
            <h4 className="text-white font-semibold text-lg mb-4">🎯 Advisory Nature of Services</h4>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our partnership consulting services are strictly <strong>advisory in nature</strong>. We provide strategic guidance, frameworks, and recommendations based on our expertise and industry knowledge. However, we cannot and do not guarantee specific business outcomes, revenue increases, partnership successes, or any other specific results.
            </p>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span><strong>Your Success Depends on Your Execution:</strong> The value you receive depends on your team's ability to implement our recommendations within your specific business context</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span><strong>Market Factors Matter:</strong> External market conditions, competition, timing, and economic factors significantly impact outcomes</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span><strong>No Financial Guarantees:</strong> We do not guarantee ROI, revenue increases, cost savings, or any specific financial metrics</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span><strong>Partnership Outcomes Vary:</strong> Success in forming and maintaining partnerships depends on many factors beyond our control</span>
              </div>
            </div>
          </div>

          {/* Subscription & Billing */}
          <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
            <h4 className="text-white font-semibold text-lg mb-4">💰 Subscription & Billing Terms</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h5 className="text-blue-400 font-semibold">30-Day Satisfaction Guarantee</h5>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Full Refund:</strong> Get 100% refund within first 30 days if not satisfied</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>Written Request:</strong> Submit detailed explanation of dissatisfaction</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span><strong>No Questions Asked:</strong> We respect your decision and process promptly</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h5 className="text-blue-400 font-semibold">Billing Details</h5>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span><strong>Monthly Billing:</strong> Charged in advance each month</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span><strong>Auto-Renewal:</strong> Continues until you cancel</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span><strong>Cancel Anytime:</strong> 30-day notice for cancellation</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span><strong>Price Changes:</strong> 30-day notice for any price increases</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Policy Limitations */}
          <div className="border-2 border-yellow-700 rounded-xl p-5 bg-yellow-900/20">
            <h4 className="text-white font-semibold text-lg mb-4">⚠️ Refund Policy Limitations</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span><strong>No Refunds After 30 Days:</strong> The satisfaction guarantee applies only to the first 30 days of service</span>
              </div>
              <div className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span><strong>Custom Work Exclusion:</strong> No refunds for custom framework development or implementation work</span>
              </div>
              <div className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span><strong>Services Rendered:</strong> No refunds for services already provided or consultations already conducted</span>
              </div>
              <div className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span><strong>Third-Party Costs:</strong> No refunds for third-party tool subscriptions or external costs incurred</span>
              </div>
            </div>
          </div>

          {/* Intellectual Property Rights */}
          <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
            <h4 className="text-white font-semibold text-lg mb-4">🔒 Intellectual Property Rights</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h5 className="text-purple-400 font-semibold">Our IP Protection</h5>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span><strong>Frameworks & Methodologies:</strong> We retain all rights to our partnership frameworks, tools, and methodologies</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span><strong>License Grant:</strong> You receive a limited license to use our frameworks during active subscription</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span><strong>No Transfer of Ownership:</strong> Services provided do not transfer IP ownership</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h5 className="text-green-400 font-semibold">Your IP Protection</h5>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span><strong>Your Business Data:</strong> You retain all rights to your confidential business information</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span><strong>Pre-existing IP:</strong> Your existing intellectual property remains yours</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span><strong>Mutual Confidentiality:</strong> Both parties agree to protect each other's confidential information</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* IP Usage Restrictions */}
          <div className="border-2 border-red-700 rounded-xl p-5 bg-red-900/20">
            <h4 className="text-white font-semibold text-lg mb-4">🚫 IP Usage Restrictions</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span><strong>No Reselling:</strong> You may not resell, license, or distribute our frameworks to third parties</span>
              </div>
              <div className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span><strong>No Reverse Engineering:</strong> You may not reverse engineer or copy our methodologies</span>
              </div>
              <div className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span><strong>License Termination:</strong> Your license to use our frameworks terminates when your subscription ends</span>
              </div>
            </div>
          </div>

          {/* Data Protection & Privacy */}
          <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
            <h4 className="text-white font-semibold text-lg mb-4">🛡️ Data Protection & Privacy</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h5 className="text-blue-400 font-semibold">Your Data Rights</h5>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span><strong>Data Ownership:</strong> You retain all rights to your business data</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span><strong>Access & Portability:</strong> You can request your data at any time</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span><strong>Data Deletion:</strong> Request deletion of your data upon termination</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h5 className="text-green-400 font-semibold">Our Security Commitments</h5>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span><strong>Reasonable Security:</strong> We implement industry-standard protections</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span><strong>Data Encryption:</strong> Sensitive data is encrypted in transit and at rest</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span><strong>Access Controls:</strong> Strict internal access controls to your data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Usage & Analytics */}
          <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
            <h4 className="text-white font-semibold text-lg mb-4">📊 Data Usage & Analytics</h4>
            <p className="text-gray-300 leading-relaxed">
              We may use anonymized, aggregated data for improving our services, creating industry insights, and developing new frameworks. This data cannot be traced back to your specific business.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div className="border-2 border-orange-700 rounded-xl p-5 bg-orange-900/20">
            <h4 className="text-white font-semibold text-lg mb-4">⚖️ Limitation of Liability</h4>
            <div className="space-y-4">
              <div>
                <h5 className="text-orange-400 font-semibold mb-2">Liability Cap</h5>
                <p className="text-gray-300 text-sm">
                  Our total liability for any claims related to these services is limited to the total fees you've paid us in the 6 months immediately preceding the claim.
                </p>
              </div>
              <div>
                <h5 className="text-orange-400 font-semibold mb-2">No Consequential Damages</h5>
                <p className="text-gray-300 text-sm">
                  We are not liable for any indirect, special, incidental, or consequential damages, including lost profits, lost revenue, or business interruption.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h6 className="text-white font-semibold mb-2">🎯 Fair Protection</h6>
                <p className="text-gray-300 text-sm">
                  This limitation represents a fair balance - it protects us from catastrophic claims while ensuring you have recourse for genuine service failures. The cap is based on recent fees paid, making it proportional to the services received.
                </p>
              </div>
            </div>
          </div>

          {/* Force Majeure */}
          <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
            <h4 className="text-white font-semibold text-lg mb-4">🌪️ Force Majeure Protection</h4>
            <p className="text-gray-300 leading-relaxed mb-4">
              We are <strong>not liable for any failure or delay in performance</strong> due to circumstances beyond our reasonable control, including but not limited to: acts of God, war, terrorism, government restrictions, pandemics, internet outages, power failures, or any other events that could not be prevented with reasonable care.
            </p>
          </div>

          {/* Dispute Resolution & Arbitration */}
          <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
            <h4 className="text-white font-semibold text-lg mb-4">⚖️ Dispute Resolution & Arbitration</h4>
            <div className="space-y-4">
              <div className="space-y-3">
                <h5 className="text-blue-400 font-semibold">Step-by-Step Resolution Process</h5>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">1.</span>
                    <span><strong>Direct Negotiation (30 days):</strong> Both parties agree to attempt to resolve disputes through good-faith negotiation</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">2.</span>
                    <span><strong>Mediation (Optional):</strong> If negotiation fails, we may pursue mediation with a neutral third party</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">3.</span>
                    <span><strong>Binding Arbitration:</strong> If resolution isn't reached, disputes will be settled by binding arbitration</span>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h5 className="text-purple-400 font-semibold">Arbitration Details</h5>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span><strong>Binding & Final:</strong> Arbitration decisions are final and enforceable in court</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span><strong>Efficient:</strong> Typically faster and less expensive than court proceedings</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span><strong>Expert Arbitrators:</strong> Cases are heard by professionals with relevant expertise</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h5 className="text-orange-400 font-semibold">What You're Waiving</h5>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span><strong>Jury Trials:</strong> You waive your right to a jury trial</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span><strong>Class Actions:</strong> You waive your right to participate in class actions</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span><strong>Court Proceedings:</strong> You waive your right to sue in court</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Complete Legal Agreement */}
          <div className="border-2 border-green-700 rounded-xl p-5 bg-green-900/20">
            <h4 className="text-white font-semibold text-lg mb-4">📄 Complete Legal Agreement</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <p>
                <strong>Entire Agreement:</strong> This document constitutes the complete and exclusive understanding between us regarding the services. It supersedes all prior discussions, agreements, and understandings of any kind.
              </p>
              <p>
                <strong>Severability:</strong> If any part of this agreement is found unenforceable, the remainder continues in full force. We'll replace invalid provisions with valid ones that achieve similar economic objectives.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-800 p-6 bg-gray-900/50 sticky bottom-0">
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleCloseModal}
            className="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium flex-1"
          >
            Cancel
          </button>
          <button 
            onClick={handleServiceAgreementAccept}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-500 hover:to-purple-500 hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-500/25 flex-1"
          >
            ✅ Accept Agreement & Continue
          </button>
        </div>
        <p className="text-center text-gray-500 text-xs mt-3">
          By clicking "Accept", you acknowledge reading and understanding all terms and agree to be legally bound
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* Package Card */}
      <EnhancedPackageCard 
        pkg={pkg} 
        index={index}
        onSelect={handlePackageSelect}
      />
      
      {/* Flow Modal */}
      {showModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Service Agreement Step */}
            {currentStep === 'service-agreement' && (
              <ServiceAgreementContent />
            )}
            
            {/* Terms Acceptance Step */}
            {currentStep === 'terms-acceptance' && (
              <div className="h-full flex flex-col">
                {/* Header with Back Button */}
                <div className="border-b border-gray-800 p-6 bg-gradient-to-r from-gray-900 to-black sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Client Information & Terms</h2>
                      <p className="text-gray-400 text-sm mt-1">Complete your details to proceed to payment</p>
                    </div>
                    <button 
                      onClick={handleBack}
                      className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Terms Acceptance Flow - UPDATED FOR SCROLLING */}
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto">
                    <TermsAcceptanceFlow 
                      package={pkg.name}
                      onAccept={handleTermsAccept}
                      onBack={handleBack}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  )
}