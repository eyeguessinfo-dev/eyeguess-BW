import Header from '../components/Header'
import Hero from '../components/Hero'
import ValueProposition from '../components/ValueProposition'
import PackageTiers from '../components/packages/PackageTiers'
import FeatureBreakdown from '../components/FeatureBreakdown'
import SocialProof from '../components/SocialProof'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Header />
      <Hero />
      <ValueProposition />
      
      {/* Packages Section with ID */}
      <section id="packages">
        <PackageTiers />
      </section>
      
      {/* Features Section with ID */}
      <section id="features">
        <FeatureBreakdown />
      </section>
      
      {/* Testimonials Section with ID */}
      <section id="testimonials">
        <SocialProof />
      </section>
      
      {/* Admin Link - Added to Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-6 text-center">
          {/* Centered Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.png"
                  alt="EyeGuess Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold">EyeGuess</span>
            </div>
            
            {/* Contact Information - Centered */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-sm mb-1">Phone</span>
                <a 
                  href="tel:+14706664388" 
                  className="text-white hover:text-gray-300 transition-colors duration-200 font-medium"
                >
                  (470) 666-4388
                </a>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-sm mb-1">Email</span>
                <a 
                  href="mailto:engage@eyeguess.org" 
                  className="text-white hover:text-gray-300 transition-colors duration-200 font-medium"
                >
                  engage@eyeguess.org
                </a>
              </div>
            </div>

            {/* Admin Link - Added Here */}
            <div className="mt-6">
              <a 
                href="/admin/terms-acceptances"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Admin Dashboard
              </a>
            </div>
          </div>
          
          {/* Copyright - Centered */}
          <div className="border-t border-white/10 pt-8">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} EyeGuess. Partnership frameworks designed for growth.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}