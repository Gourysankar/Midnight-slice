import { useRef, useEffect, useState } from 'react'
import { Zap, Shield, Globe, Layers, Star, Flame } from 'lucide-react'

const brandNames = ['Vortex', 'Nimbus', 'Apex', 'Zenith', 'Cobalt', 'Prism', 'Quartz', 'Nova']
const brandIcons = [Zap, Shield, Globe, Layers, Star, Flame, Zap, Shield]

export default function SocialProofSection() {
    const videoRef = useRef(null)
    const [videoOpacity, setVideoOpacity] = useState(0)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        let rafId

        const handleTimeUpdate = () => {
            const time = video.currentTime
            const duration = video.duration
            if (!duration) return

            const fadeIn = 0.5
            const fadeOut = 0.5

            let opacity = 1
            if (time < fadeIn) {
                opacity = time / fadeIn
            } else if (time > duration - fadeOut) {
                opacity = (duration - time) / fadeOut
            }

            setVideoOpacity(Math.max(0, Math.min(1, opacity)))
            rafId = requestAnimationFrame(handleTimeUpdate)
        }

        const handleEnded = () => {
            setVideoOpacity(0)
            setTimeout(() => {
                video.currentTime = 0
                video.play().catch(() => { })
            }, 100)
        }

        video.addEventListener('ended', handleEnded)
        video.addEventListener('play', () => {
            rafId = requestAnimationFrame(handleTimeUpdate)
        })

        video.play().catch(() => { })

        return () => {
            cancelAnimationFrame(rafId)
            video.removeEventListener('ended', handleEnded)
        }
    }, [])

    return (
        <section className="relative py-24">
            {/* Video Background */}
            <div className="absolute inset-0 overflow-hidden z-0">
                <video
                    ref={videoRef}
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-none"
                    style={{ opacity: videoOpacity * 0.15 }}
                    src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/food-promo-video-template-design-b23f7b38db798c5bacc92aa0bb1e5a82_screen.mp4"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(transparent, var(--color-background))' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="section-label">Trusted By Pizza Lovers</span>
                    <h2 className="mt-3 font-extrabold text-3xl md:text-4xl" style={{ fontFamily: "'Syne',sans-serif", color: 'var(--color-foreground)' }}>
                        Crafted for taste, built for speed
                    </h2>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {[
                        { icon: '🥗', title: 'Fresh Ingredients', desc: 'Pick from premium bases, sauces, cheeses, veggies, and meats — all sourced fresh.', glow: '142,70%,45%' },
                        { icon: '⚡', title: 'Real-Time Tracking', desc: 'Follow your order live through 4 stages — from kitchen to your doorstep.', glow: '262,83%,58%' },
                        { icon: '💳', title: 'Secure Payments', desc: 'Pay safely with Razorpay — UPI, cards, wallets, and net banking supported.', glow: '217,91%,60%' },
                    ].map(f => (
                        <div key={f.title} className="glass-card p-8 transition-all duration-300 hover:-translate-y-2 cursor-default group"
                            style={{ '--glow': f.glow }}>
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                                style={{ background: `hsla(${f.glow}, 0.1)`, border: `1px solid hsla(${f.glow}, 0.2)` }}>
                                {f.icon}
                            </div>
                            <h3 className="font-bold text-lg mb-3" style={{ fontFamily: "'Syne',sans-serif", color: 'var(--color-foreground)' }}>
                                {f.title}
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'hsl(260,10%,55%)' }}>
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Logo Marquee */}
                <div className="text-center mb-8">
                    <span className="section-label">Delivering Everywhere</span>
                </div>
                <div className="marquee-container py-6">
                    <div className="marquee-track">
                        {[...brandNames, ...brandNames].map((brand, i) => {
                            const Icon = brandIcons[i % brandIcons.length]
                            return (
                                <div key={`${brand}-${i}`} className="flex-shrink-0 mx-6 flex items-center gap-3 px-6 py-3 rounded-2xl liquid-glass"
                                    style={{ minWidth: 160 }}>
                                    <Icon size={20} style={{ color: 'hsl(262,83%,58%)', opacity: 0.7 }} />
                                    <span className="text-sm font-semibold" style={{ color: 'hsl(0,0%,60%)' }}>{brand}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
