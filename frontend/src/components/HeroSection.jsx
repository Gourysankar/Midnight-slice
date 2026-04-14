import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HeroSection() {
    const { user } = useAuth()

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-[68px]">
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, hsla(262,83%,58%,0.08) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
            />

            {/* Badge */}
            <div className="relative z-10 flex items-center gap-2 mb-10 px-5 py-2 rounded-full text-sm font-semibold liquid-glass"
                style={{ color: 'hsl(262,83%,68%)', borderColor: 'hsla(262,83%,58%,0.25)' }}>
                <Sparkles size={16} />
                <span>Craft Your Perfect Custom Pizza</span>
            </div>

            {/* Main Headline */}
            <h1 className="relative z-10 text-center font-extrabold leading-[1.02] mb-6"
                style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 'clamp(4rem, 12vw, 14rem)',
                    backgroundImage: 'linear-gradient(223deg, #E8E8E9 0%, #3A7BBF 104.15%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}>
                Slice
            </h1>

            {/* Subtitle */}
            <p className="relative z-10 text-center max-w-xl mb-10 text-lg leading-relaxed"
                style={{ color: 'hsl(260,10%,55%)' }}>
                Hand-picked ingredients, built exactly your way.
                Fresh. Hot. Delivered straight to your door with real-time tracking.
            </p>

            {/* CTA Buttons */}
            <div className="relative z-10 flex flex-wrap gap-4 justify-center">
                <Link to={user ? '/customize' : '/register'}>
                    <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.05rem' }}>
                        Build My Pizza <ArrowRight size={18} />
                    </button>
                </Link>
                <Link to={user ? '/dashboard' : '/login'}>
                    <button className="btn-glass" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
                        {user ? 'Browse Menu' : 'Sign In'}
                    </button>
                </Link>
            </div>

            {/* Stats Row */}
            <div className="relative z-10 flex flex-wrap gap-6 mt-16 justify-center">
                {[
                    { value: '4.9★', label: '2k+ Reviews' },
                    { value: '30 min', label: 'Avg Delivery' },
                    { value: '25+', label: 'Fresh Toppings' },
                ].map(s => (
                    <div key={s.label} className="text-center px-6">
                        <div className="text-2xl font-extrabold gradient-text mb-1">{s.value}</div>
                        <div className="text-xs font-medium" style={{ color: 'hsl(260,10%,45%)' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                style={{ background: 'linear-gradient(transparent, var(--color-background))' }}
            />
        </section>
    )
}
