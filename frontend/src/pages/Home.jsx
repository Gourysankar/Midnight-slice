import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'
import Loader from '../components/Loader'
import HeroSection from '../components/HeroSection'
import SocialProofSection from '../components/SocialProofSection'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const [pizzas, setPizzas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/pizza')
      .then(res => setPizzas(res.data))
      .catch(err => console.error('Failed to fetch pizzas', err))
      .finally(() => setLoading(false))
  }, [])

  const steps = [
    { num: 1, icon: '📧', title: 'Create Account', desc: 'Register and verify your email to get started in seconds.' },
    { num: 2, icon: '🍕', title: 'Build Your Pizza', desc: 'Choose your base, sauce, cheese, veggies, and meat toppings.' },
    { num: 3, icon: '💳', title: 'Pay Securely', desc: 'Complete checkout with Razorpay — quick and safe.' },
    { num: 4, icon: '🚀', title: 'Track Live', desc: 'Watch your pizza move through each stage until delivered.' },
  ]

  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <HeroSection />

      {/* ── SOCIAL PROOF & VIDEO ── */}
      <SocialProofSection />

      {/* ── PRE-DEFINED PIZZAS ── */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="section-label">Our Classics</span>
          <h2 className="mt-3 font-extrabold text-3xl md:text-4xl" style={{ fontFamily: "'Syne',sans-serif", color: 'var(--color-foreground)' }}>
            Popular Picks Ready to Go
          </h2>
        </div>

        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center"><Loader /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pizzas.map(pizza => (
              <div key={pizza._id} className="glass-card overflow-hidden transition-all duration-300 hover:-translate-y-2 group">
                <div className="h-52 w-full overflow-hidden">
                  <img src={pizza.image} alt={pizza.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-extrabold text-xl" style={{ fontFamily: "'Syne',sans-serif" }}>{pizza.name}</h3>
                    <span className="font-extrabold text-lg gradient-text">₹{pizza.price}</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-5 min-h-[40px]" style={{ color: 'hsl(260,10%,55%)' }}>
                    {pizza.description}
                  </p>
                  <Link to="/customize" state={{ pizza }}>
                    <button className="btn-glass w-full justify-center">
                      Order & Customize
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6" style={{ background: 'hsla(262,83%,58%,0.02)', borderTop: '1px solid hsla(0,0%,100%,0.04)', borderBottom: '1px solid hsla(0,0%,100%,0.04)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">Simple Process</span>
            <h2 className="mt-3 font-extrabold text-3xl md:text-4xl" style={{ fontFamily: "'Syne',sans-serif", color: 'var(--color-foreground)' }}>
              From craving to doorstep in 4 steps
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(step => (
              <div key={step.num} className="text-center p-8">
                <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center font-extrabold text-xl text-white"
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    background: 'linear-gradient(135deg, hsl(262,83%,58%), hsl(262,83%,48%))',
                    boxShadow: '0 6px 20px hsla(262,83%,58%,0.3)',
                  }}>
                  {step.num}
                </div>
                <div className="text-3xl mb-4">{step.icon}</div>
                <h3 className="font-bold text-base mb-2" style={{ fontFamily: "'Syne',sans-serif", color: 'var(--color-foreground)' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'hsl(260,10%,55%)' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center max-w-7xl mx-auto">
        <h2 className="font-extrabold text-3xl md:text-4xl mb-5" style={{ fontFamily: "'Syne',sans-serif", color: 'var(--color-foreground)' }}>
          Ready to build your pizza?
        </h2>
        <p className="mb-10 text-lg" style={{ color: 'hsl(260,10%,55%)' }}>
          Join thousands crafting their perfect pie.
        </p>
        <Link to={user ? '/customize' : '/register'}>
          <button className="btn-primary" style={{ padding: '16px 44px', fontSize: '1.05rem' }}>
            Get Started Free <ArrowRight size={18} />
          </button>
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="liquid-glass py-5 px-10 text-center text-sm"
        style={{ borderTop: '1px solid hsla(0,0%,100%,0.04)', color: 'hsl(260,10%,45%)' }}>
        © 2026 Midnight Slice. Built by Gourysankar. All rights reserved. 🍕
      </footer>
    </div>
  )
}
