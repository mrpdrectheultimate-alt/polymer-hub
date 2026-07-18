'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import {
  Menu, X, ChevronDown, BookOpen, Brain, Zap, Trophy,
  MessageCircle, Calculator, Play, FlaskConical, ArrowRight,
  Scale, Wrench, User, Star, Flame
} from 'lucide-react'

// ─── Nav structure ─────────────────────────────────────────────────────────────

const NAV = [
  {
    label: 'Explore',
    items: [
      { label: 'Today in Plastics', href: '/today', icon: Flame, desc: 'Daily industry news & updates', color: '#EA580C' },
      { label: 'History of Plastics', href: '/history', icon: BookOpen, desc: '162 years that remade civilization', color: '#1D4ED8' },
      { label: 'World of Plastic', href: '/world', icon: FlaskConical, desc: '7 industries that run on polymers', color: '#15803D' },
      { label: 'Video Library', href: '/videos', icon: Play, desc: 'NPTEL + industry videos mapped to lessons', color: '#1D4ED8' },
    ]
  },
  {
    label: 'Learn',
    items: [
      { label: 'All Subjects', href: '/subjects', icon: BookOpen, desc: '10 subjects · 60 lessons', color: '#1D4ED8' },
      { label: 'AI Tutor', href: '/ai-tutor', icon: Brain, desc: 'Ask anything — grounded in your lessons', color: '#15803D' },
      { label: 'Practice Questions', href: '/practice', icon: Zap, desc: '50 MCQs across all subjects', color: '#CA8A04' },
      { label: 'GATE Mock Test', href: '/gate-mock', icon: Trophy, desc: '30 questions · 60 min · negative marking', color: '#7C3AED' },
      { label: 'Student Forum', href: '/forum', icon: MessageCircle, desc: 'Ask classmates, get answers', color: '#7C3AED' },
      { label: 'Reference Library', href: '/resources', icon: BookOpen, desc: '17 books mapped to your subjects', color: '#1D4ED8' },
    ]
  },
  {
    label: 'Tools',
    items: [
      { label: 'Engineering Calculators', href: '/calculators', icon: Calculator, desc: 'Tonnage, cooling, shrinkage & more', color: '#CA8A04' },
      { label: 'Defect Troubleshooter', href: '/troubleshooter', icon: Wrench, desc: 'Fix injection & extrusion defects', color: '#EA580C' },
      { label: 'Property Comparator', href: '/comparator', icon: Scale, desc: 'Compare 12 polymers · 15 properties', color: '#1D4ED8' },
      { label: 'Careers', href: '/careers', icon: Trophy, desc: '6 career tracks · ₹4–40 LPA', color: '#15803D' },
      { label: 'Materials Database', href: '/materials', icon: FlaskConical, desc: 'Polymer properties & Indian industry', color: '#7C3AED' },
    ]
  },
]

type Profile = {
  full_name: string | null
  avatar_url: string | null
  subscription_status: string | null
  xp_points: number
  current_streak: number
}

export default function Navbar() {
  const pathname = usePathname()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, subscription_status, xp_points, current_streak')
          .eq('id', session.user.id)
          .single()
        if (data) setProfile(data)
      }
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setSession(session)
      if (session) {
        const { data } = await supabase.from('profiles').select('full_name, avatar_url, subscription_status, xp_points, current_streak').eq('id', session.user.id).single()
        if (data) setProfile(data)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on route change
  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  const isPremium = profile?.subscription_status === 'premium'

  return (
    <>
      <nav className="border-b-4 border-ink bg-canvas sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14" ref={dropdownRef}>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-ink flex items-center justify-center border-2 border-ink">
                <span className="font-display text-sm font-black text-yellow-bright">P</span>
              </div>
              <span className="font-display text-base font-black text-ink leading-tight hidden sm:block">
                Polymer<span className="text-blue">Hub</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV.map(section => (
                <div key={section.label} className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === section.label ? null : section.label)}
                    className="flex items-center gap-1 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-wider hover:bg-ink hover:text-white transition-colors"
                    style={{ backgroundColor: activeDropdown === section.label ? '#0A0A0A' : undefined, color: activeDropdown === section.label ? 'white' : undefined }}
                  >
                    {section.label}
                    <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === section.label ? 'rotate-180' : ''}`} />
                  </button>

                  {activeDropdown === section.label && (
                    <div className="absolute top-full left-0 mt-0.5 w-72 border-4 border-ink bg-canvas z-50 shadow-hard-xl">
                      {section.items.map(item => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                          <Link key={item.href} href={item.href}
                            className="flex items-center gap-3 px-4 py-3 border-b-2 border-ink/10 last:border-0 hover:bg-ink hover:text-white group transition-colors"
                            style={{ backgroundColor: isActive ? '#0A0A0A' : undefined, color: isActive ? 'white' : undefined }}
                          >
                            <div className="w-8 h-8 border-2 border-ink flex items-center justify-center flex-shrink-0 group-hover:border-white transition-colors"
                              style={{ backgroundColor: item.color }}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="font-mono text-[10px] font-bold uppercase tracking-wider">{item.label}</div>
                              <div className="font-mono text-[8px] text-ink/50 group-hover:text-white/60 mt-0.5">{item.desc}</div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop right side */}
            <div className="hidden md:flex items-center gap-2">
              {session ? (
                <>
                  {/* Streak badge */}
                  {profile && profile.current_streak > 0 && (
                    <Link href="/achievements" className="flex items-center gap-1 border-2 border-ink px-2 py-1 hover:bg-ink hover:text-white transition-colors" title="Your streak">
                      <Flame className="w-3.5 h-3.5 text-orange" />
                      <span className="font-mono text-[9px] font-black text-ink">{profile.current_streak}</span>
                    </Link>
                  )}
                  {/* XP */}
                  {profile && (
                    <Link href="/achievements" className="flex items-center gap-1 border-2 border-ink px-2 py-1 hover:bg-yellow-bright transition-colors" title="Your XP">
                      <Star className="w-3.5 h-3.5" style={{ color: '#CA8A04' }} />
                      <span className="font-mono text-[9px] font-black text-ink">{(profile.xp_points ?? 0).toLocaleString()}</span>
                    </Link>
                  )}
                  {/* Premium badge */}
                  {isPremium && (
                    <span className="font-mono text-[8px] font-black border-2 border-yellow text-yellow px-2 py-0.5 uppercase" style={{ borderColor: '#CA8A04', color: '#CA8A04' }}>⭐ Premium</span>
                  )}
                  {/* Dashboard link */}
                  <Link href="/dashboard" className="flex items-center gap-2 border-4 border-ink px-3 py-1.5 hover:bg-ink hover:text-white group transition-colors">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="avatar" className="w-5 h-5 object-cover border border-ink" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider">
                      {profile?.full_name?.split(' ')[0] ?? 'Dashboard'}
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="font-mono text-[10px] font-bold px-3 py-1.5 border-4 border-ink hover:bg-ink hover:text-white transition-colors uppercase tracking-wider">
                    Sign In
                  </Link>
                  <Link href="/pricing" className="cn-btn-yellow text-xs py-1.5">
                    Get Premium <ArrowRight className="w-3 h-3" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden border-4 border-ink w-10 h-10 flex items-center justify-center hover:bg-ink hover:text-white transition-colors">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t-4 border-ink bg-canvas max-h-[80vh] overflow-y-auto">
            {/* Auth section */}
            {session ? (
              <div className="border-b-4 border-ink px-4 py-3 flex items-center gap-3 bg-ink">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="avatar" className="w-9 h-9 object-cover border-2 border-yellow-bright flex-shrink-0" />
                ) : (
                  <div className="w-9 h-9 bg-violet border-2 border-yellow-bright flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-white truncate">{profile?.full_name ?? 'Student'}</div>
                  <div className="flex items-center gap-2">
                    {isPremium && <span className="font-mono text-[8px] text-yellow-bright uppercase">⭐ Premium</span>}
                    {profile && <span className="font-mono text-[8px] text-white/40">{profile.xp_points} XP</span>}
                    {profile && profile.current_streak > 0 && <span className="font-mono text-[8px] text-orange">🔥 {profile.current_streak}</span>}
                  </div>
                </div>
                <Link href="/dashboard" className="font-mono text-[9px] font-bold border-2 border-yellow-bright text-yellow-bright px-2 py-1 uppercase">
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="border-b-4 border-ink px-4 py-3 flex gap-3">
                <Link href="/login" className="flex-1 font-mono text-[10px] font-bold border-4 border-ink px-3 py-2 text-center uppercase hover:bg-ink hover:text-white transition-colors">Sign In</Link>
                <Link href="/pricing" className="flex-1 cn-btn-yellow text-xs justify-center">Get Premium</Link>
              </div>
            )}

            {/* Nav sections */}
            {NAV.map(section => (
              <div key={section.label} className="border-b-4 border-ink">
                <div className="px-4 py-2 bg-ink">
                  <span className="font-mono text-[9px] font-black text-yellow-bright uppercase tracking-widest">{section.label}</span>
                </div>
                {section.items.map(item => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href}
                      className="flex items-center gap-3 px-4 py-3 border-b-2 border-ink/10 last:border-0 transition-colors"
                      style={{ backgroundColor: isActive ? '#0A0A0A' : undefined, color: isActive ? 'white' : undefined }}
                    >
                      <div className="w-7 h-7 border-2 border-ink flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color }}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">{item.label}</div>
                        <div className="font-mono text-[8px] text-ink/40">{item.desc}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ))}

            {/* Bottom links */}
            <div className="border-b-4 border-ink">
              {[
                { label: 'Achievements & Badges', href: '/achievements', icon: Trophy },
                { label: 'Profile Settings', href: '/profile', icon: User },
              ].map(item => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 border-b-2 border-ink/10 last:border-0 hover:bg-ink/5 transition-colors">
                    <Icon className="w-4 h-4 text-ink/50" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {session && (
              <div className="px-4 py-3">
                <button
                  onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }}
                  className="w-full font-mono text-[9px] font-bold text-ink/40 uppercase tracking-wider border-2 border-ink/20 py-2 hover:bg-ink hover:text-white hover:border-ink transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  )
}
