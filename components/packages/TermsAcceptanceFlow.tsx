// components/packages/TermsAcceptanceFlow.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TermsAcceptanceFlowProps {
  package: string
  onAccept: (acceptanceId: string) => void
  onBack?: () => void
}

export default function TermsAcceptanceFlow({ package: selectedPackage, onAccept, onBack }: TermsAcceptanceFlowProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    signature: ''
  })
  const [loading, setLoading] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  // Replace with your actual Stripe URLs
  const stripeUrls = {
    'Value-Based Support': 'https://buy.stripe.com/14A3cwbUg8xZ88b47D9IQ00',
    'Content Development': 'https://buy.stripe.com/aFa00kbUg29BfADcE99IQ01', 
    'Full Advisory': 'https://buy.stripe.com/3cI6oIbUg01t1JN1Zv9IQ02'
  }

  // Google Forms submission function
  const submitToGoogleForm = async () => {
    // Create form data
    const formDataToSubmit = new URLSearchParams();
    
    // TODO: Replace these entry IDs with your actual Google Form field IDs
    // Get these from your pre-filled link or by inspecting the form
    formDataToSubmit.append('entry.1220544924', formData.clientName);        // Client Name
    formDataToSubmit.append('entry.1670307896', formData.clientEmail);       // Client Email  
    formDataToSubmit.append('entry.1951489488', formData.signature || formData.clientName); // Digital Signature

    // Your Google Form submission URL
    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd2be0jsTM-leR3SM9Qp2pn2Rhz7akK9boeorXvViHxOOSBPA/formResponse';

    console.log('📤 Submitting to Google Form:', {
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      package: selectedPackage, // Still logging package for debugging
      signature: formData.signature,
      stripeUrl: stripeUrls[selectedPackage as keyof typeof stripeUrls] // Still logging for debugging
    });

    try {
      // Submit to Google Form
      const response = await fetch(formUrl, {
        method: 'POST',
        body: formDataToSubmit,
        mode: 'no-cors' // Important: no-cors mode for Google Forms
      });

      // With no-cors, we can't read the response, but the submission should work
      console.log('✅ Form submission sent (no-cors mode)');
      return { success: true };

    } catch (error) {
      console.error('❌ Form submission error:', error);
      throw new Error('Failed to submit form data');
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAcceptTerms = async () => {
    if (!formData.clientName || !formData.clientEmail) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    
    try {
      // Submit to Google Form
      await submitToGoogleForm();
      
      setAccepted(true)
      setStep(3)
      onAccept?.(Date.now().toString())
      
      // Redirect to Stripe after 2 seconds
      setTimeout(() => {
        setRedirecting(true)
        const stripeUrl = stripeUrls[selectedPackage as keyof typeof stripeUrls] || 'https://buy.stripe.com/test_00g3f0bNBeKZ0wg5kk'
        window.location.href = stripeUrl
      }, 2000)
      
    } catch (error) {
      console.error('Error storing data:', error)
      // Even if form submission fails, proceed to Stripe
      alert('Note: Form submission failed, but proceeding to payment...')
      setAccepted(true)
      setStep(3)
      setTimeout(() => {
        const stripeUrl = stripeUrls[selectedPackage as keyof typeof stripeUrls] || 'https://buy.stripe.com/test_00g3f0bNBeKZ0wg5kk'
        window.location.href = stripeUrl
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (step === 1 && onBack) {
      onBack()
    } else if (step === 2) {
      setStep(1)
    }
  }

  const resetForm = () => {
    setStep(1)
    setFormData({ clientName: '', clientEmail: '', signature: '' })
    setAccepted(false)
    setRedirecting(false)
  }

  return (
    <div className="max-w-2xl mx-auto bg-transparent rounded-xl p-1 h-full flex flex-col min-h-0">
      {/* Progress Steps - Updated for integrated flow */}
      <div className="flex justify-between mb-6 px-2 flex-shrink-0">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              {stepNumber}
            </div>
            <span className="text-xs mt-2 text-gray-400 text-center">
              {stepNumber === 1 ? 'Details' : stepNumber === 2 ? 'Review' : 'Complete'}
            </span>
            {stepNumber < 3 && (
              <div className={`flex-1 h-1 mt-4 -ml-4 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-700'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Client Information */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 flex-1 flex flex-col min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-2">
            <h2 className="text-2xl font-bold text-white mb-2">Client Information</h2>
            <p className="text-gray-400 mb-6">Please provide your details to continue with the {selectedPackage} package</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Digital Signature *
                </label>
                <input
                  type="text"
                  name="signature"
                  value={formData.signature}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Type your full name as digital signature"
                />
                <p className="text-sm text-gray-500 mt-1">
                  By typing your name, you provide your digital signature accepting the terms
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4 flex-shrink-0 px-2">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
            >
              Back to Agreement
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={!formData.clientName || !formData.clientEmail}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Continue to Review
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Terms Review */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 flex-1 flex flex-col min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-2">
            <h2 className="text-2xl font-bold text-white mb-2">Final Review & Acceptance</h2>
            <p className="text-gray-400 mb-6">Review your information and accept the terms to proceed to payment</p>
            
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
              <h3 className="font-semibold text-white mb-3 text-lg">Selected Package</h3>
              <div className="text-blue-400 font-medium text-xl">{selectedPackage}</div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700 mb-6">
              <h3 className="font-semibold text-white mb-3">Client Information</h3>
              <div className="space-y-2 text-gray-300">
                <p><strong>Name:</strong> {formData.clientName}</p>
                <p><strong>Email:</strong> {formData.clientEmail}</p>
                {formData.signature && <p><strong>Signature:</strong> {formData.signature}</p>}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold text-white mb-3">Final Terms Confirmation</h3>
              <div className="text-sm text-gray-300 space-y-3">
                <p>By accepting, you confirm that:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>You have read and understood the Service Agreement</li>
                  <li>The information provided is accurate</li>
                  <li>You agree to the subscription terms and billing cycle</li>
                  <li>You understand the advisory nature of our services</li>
                  <li>You accept the liability limitations and dispute resolution process</li>
                </ul>
                <p className="text-amber-400 font-medium mt-4">
                  You will be redirected for secure payment processing after acceptance.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4 flex-shrink-0 px-2">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
            >
              Back to Details
            </button>
            <button
              onClick={handleAcceptTerms}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-600 transition-colors font-semibold"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Accept Terms & Continue to Payment'
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Completion & Redirect */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center space-y-6 flex-1 flex flex-col justify-center min-h-0 px-2"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-white">Terms Accepted!</h2>
          
          <p className="text-gray-300">
            Thank you, <span className="text-white font-semibold">{formData.clientName}</span>. You have successfully accepted the terms for the <span className="text-blue-400 font-semibold">{selectedPackage}</span> package.
          </p>

          {redirecting ? (
            <div className="bg-blue-500/20 border border-blue-500/30 p-4 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-blue-400">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-medium">Redirecting to secure payment...</span>
              </div>
            </div>
          ) : (
            <div className="bg-amber-500/20 border border-amber-500/30 p-4 rounded-lg">
              <p className="text-amber-400">Preparing secure checkout. You will be redirected to Stripe in a moment...</p>
            </div>
          )}
          
          <p className="text-sm text-gray-400">
            Your information has been recorded and a confirmation will be sent to {formData.clientEmail}
          </p>

          <button
            onClick={resetForm}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors mt-4"
          >
            Accept Terms for Another Client
          </button>
        </motion.div>
      )}
    </div>
  )
}