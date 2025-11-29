'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const testimonials = [
  {
    quote: "The Full Advisory service transformed my record label into a digital power house soon to make history. The content has boosted my channel views. And from recent devlopments I was able to make more money in one month than I did for 3 years off of my music alone",
    author: "DJ MEGATRON",
    role: "CEO, DJMEGATRONRECORDS.com"
  },
  {
    quote: "EyeGuess's content development framework helped us create complelling stories and visuals that actually convert. Worth every penny.",
    author: "David Y Rosonna",
    role: "CEO, Rancho El Encanto"
  },
  {
    quote: "EyeGuess really gave me the push and support needed to take my branding to the next level. I was able to sell all my inventory in a month",
    author: "Fifa Flame",
    role: "CEO, Flavor Records & Pxssy Water"
  }
]

export default function SocialProof() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Trusted by Partnership Leaders
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300"
              >
                <div className="text-4xl text-gray-400 mb-4">"</div>
                <p className="text-gray-300 mb-6 leading-relaxed">{testimonial.quote}</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold mb-8">Ready to Transform Your Partnerships?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {[
                { name: "Value-Based Support", price: "$49", cta: "Start with Value" },
                { name: "Content Development", price: "$1,799", cta: "Scale with Content", featured: true },
                { name: "Full Advisory", price: "$3,999", cta: "Go Full Strategy" }
              ].map((pkg, index) => (
                <motion.a
                  key={pkg.name}
                  href="#packages"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-6 py-3 rounded-lg font-semibold transition-all duration-200 border
                    ${pkg.featured 
                      ? 'bg-white text-black border-white hover:bg-gray-100' 
                      : 'bg-transparent text-white border-white/30 hover:bg-white hover:text-black'
                    }
                  `}
                >
                  {pkg.cta}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}