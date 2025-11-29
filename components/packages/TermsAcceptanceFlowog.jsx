// // components/packages/TermsAcceptanceFlow.jsx
// 'use client'
// import { useState } from 'react'
// import { motion } from 'framer-motion'

// export default function TermsAcceptanceFlow({ package: selectedPackage, onAccept }) {
//   const [step, setStep] = useState(1)
//   const [formData, setFormData] = useState({
//     clientName: '',
//     clientEmail: '',
//     signature: ''
//   })
//   const [loading, setLoading] = useState(false)
//   const [accepted, setAccepted] = useState(false)

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleAcceptTerms = async () => {
//     if (!formData.clientName || !formData.clientEmail) {
//       alert('Please fill in all required fields')
//       return
//     }

//     setLoading(true)
    
//     try {
//       const response = await fetch('/api/accept-terms', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           clientName: formData.clientName,
//           clientEmail: formData.clientEmail,
//           package: selectedPackage,
//           signature: formData.signature || 'digital-acceptance'
//         })
//       })

//       const data = await response.json()

//       if (data.success) {
//         setAccepted(true)
//         setStep(3)
//         onAccept?.(data.acceptanceId)
//       } else {
//         alert('Failed to accept terms: ' + data.error)
//       }
//     } catch (error) {
//       console.error('Error accepting terms:', error)
//       alert('An error occurred while accepting terms')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
//       {/* Progress Steps */}
//       <div className="flex justify-between mb-8">
//         {[1, 2, 3].map((stepNumber) => (
//           <div key={stepNumber} className="flex flex-col items-center">
//             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//               step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
//             }`}>
//               {stepNumber}
//             </div>
//             <span className="text-xs mt-2 text-gray-600">
//               {stepNumber === 1 ? 'Details' : stepNumber === 2 ? 'Review' : 'Complete'}
//             </span>
//           </div>
//         ))}
//       </div>

//       {/* Step 1: Client Information */}
//       {step === 1 && (
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="space-y-6"
//         >
//           <h2 className="text-2xl font-bold text-gray-900">Client Information</h2>
          
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Full Name *
//               </label>
//               <input
//                 type="text"
//                 name="clientName"
//                 value={formData.clientName}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter your full name"
//                 required
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address *
//               </label>
//               <input
//                 type="email"
//                 name="clientEmail"
//                 value={formData.clientEmail}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter your email address"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Signature
//               </label>
//               <input
//                 type="text"
//                 name="signature"
//                 value={formData.signature}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Type your full name as digital signature"
//               />
//               <p className="text-sm text-gray-500 mt-1">
//                 By typing your name, you agree to the terms and conditions
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={() => setStep(2)}
//             disabled={!formData.clientName || !formData.clientEmail}
//             className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//           >
//             Continue to Terms
//           </button>
//         </motion.div>
//       )}

//       {/* Step 2: Terms Review */}
//       {step === 2 && (
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="space-y-6"
//         >
//           <h2 className="text-2xl font-bold text-gray-900">Terms & Conditions</h2>
          
//           <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
//             <h3 className="font-semibold mb-4">Service Agreement</h3>
//             <div className="text-sm text-gray-700 space-y-3">
//               <p>
//                 By accepting these terms, you agree to our service conditions for the <strong>{selectedPackage}</strong> package.
//               </p>
//               <p>
//                 <strong>Client Information:</strong><br />
//                 Name: {formData.clientName}<br />
//                 Email: {formData.clientEmail}
//               </p>
//               <p>
//                 This agreement outlines the terms of service, payment obligations, and mutual responsibilities between EyeGuess and the client.
//               </p>
//               <p>
//                 All services are provided on a subscription basis and can be canceled according to our cancellation policy.
//               </p>
//               <p>
//                 By proceeding, you acknowledge that you have read and understood these terms.
//               </p>
//             </div>
//           </div>

//           <div className="flex space-x-4">
//             <button
//               onClick={() => setStep(1)}
//               className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300"
//             >
//               Back
//             </button>
//             <button
//               onClick={handleAcceptTerms}
//               disabled={loading}
//               className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
//             >
//               {loading ? 'Processing...' : 'Accept Terms'}
//             </button>
//           </div>
//         </motion.div>
//       )}

//       {/* Step 3: Completion */}
//       {step === 3 && (
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="text-center space-y-6"
//         >
//           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
//             <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//             </svg>
//           </div>
          
//           <h2 className="text-2xl font-bold text-gray-900">Terms Accepted!</h2>
          
//           <p className="text-gray-600">
//             Thank you, {formData.clientName}. You have successfully accepted the terms for the <strong>{selectedPackage}</strong> package.
//           </p>
          
//           <p className="text-sm text-gray-500">
//             A confirmation has been sent to {formData.clientEmail}
//           </p>

//           <button
//             onClick={() => {
//               setStep(1)
//               setFormData({ clientName: '', clientEmail: '', signature: '' })
//               setAccepted(false)
//             }}
//             className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
//           >
//             Accept Terms for Another Client
//           </button>
//         </motion.div>
//       )}
//     </div>
//   )
// }