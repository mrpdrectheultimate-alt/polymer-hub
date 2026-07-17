'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FlaskConical, Menu, X, ChevronDown, Brain, BookOpen,
  Newspaper, Globe, Clock, Briefcase, Layers, Wrench,
  Scale, Zap, Trophy, MessageSquare, Calculator
} from 'lucide-react'

// ─── Nav structure ────────────────────────────────────────────────────────────

interface NavChild {
  label: string
  href: string
  icon: React.ElementType
  color: string
  desc: string
}

interface NavItem {
  label: string
  href?: string
  color?: string
  children?: NavChild[]
}

const NAV: NavItem[] = [
  {
    label: 'Explore',
    children: [
      { label: 'World of Plastic', href: '/world', icon: Globe, color: '#EA580C', desc: '7 industries that run on polymer engineering' },
      { label: 'History', href: '/history', icon: Clock, color: '#1D4ED8', desc: '162 years from Parkesine to PETase' },
      { label: 'Daily Pulse', href: '/today', icon: Newspaper, color: '#CA8A04', desc: 'What happened today in plastics' },
      { label: 'Leaderboard & Badges', href: '/leaderboard', icon: Trophy, color: '#CA8A04', desc: 'XP points, streaks, badges, and top student ranks' },
    ],
  },
  {
    label: 'Learn',
    children: [
      { label: 'All Subjects', href: '/subjects', icon: BookOpen, color: '#1D4ED8', desc: '10 subjects · 60 world-class lessons' },
      { label: 'Materials Database', href: '/materials', icon: Layers, color: '#EA580C', desc: 'Full engineering specs for 10+ polymers' },
      { label: 'AI Tutor', href: '/ai-tutor', icon: Brain, color: '#15803D', desc: 'Grounded in your lessons via real RAG' },
      { label: 'Reference Library', href: '/resources', icon: BookOpen, color: '#7C3AED', desc: '17 books that define the plastics sector' },
      { label: 'Practice Questions', href: '/practice', icon: Zap, color: '#CA8A04', desc: 'MCQ quiz across all subjects — GATE mapped' },
      { label: 'GATE Mock Test', href: '/gate-mock', icon: Trophy, color: '#7C3AED', desc: '30 questions · 60 min · negative marking' },
      { label: 'Student Forum', href: '/forum', icon: MessageSquare, color: '#7C3AED', desc: 'Ask questions & discuss topics with classmates' },
    ],
  },
  {
    label: 'Tools',
    children: [
      { label: 'Defect Troubleshooter', href: '/troubleshooter', icon: Wrench, color: '#EA580C', desc: 'Fix sink marks, warpage, flash and more' },
      { label: 'Property Comparator', href: '/comparator', icon: Scale, color: '#1D4ED8', desc: '20 polymers · 15 properties side by side' },
      { label: 'Engineering Calculators', href: '/calculators', icon: Calculator, color: '#CA8A04', desc: '8 industrial-grade calculators for processing' },
    ],
  },
  { label: 'Careers', href: '/careers', color: '#7C3AED' },
]

// Domain color per path prefix
const PATH_COLORS: { prefix: string; color: string }[] = [
  { prefix: '/subjects/polymer-chemistry', color: '#1D4ED8' },
  { prefix: '/subjects/polymer-processing', color: '#EA580C' },
  { prefix: '/subjects/mould-design', color: '#EA580C' },
  { prefix: '/subjects/polymer-testing', color: '#7C3AED' },
  { prefix: '/subjects/rubber-technology', color: '#EA580C' },
  { prefix: '/subjects/recycling-technology', color: '#15803D' },
  { prefix: '/subjects/sustainable-plastics', color: '#15803D' },
  { prefix: '/subjects/polymer-composites', color: '#1D4ED8' },
  { prefix: '/subjects/entrepreneurship-plastics', color: '#CA8A04' },
  { prefix: '/subjects/medical-plastics', color: '#7C3AED' },
  { prefix: '/world', color: '#EA580C' },
  { prefix: '/history', color: '#1D4ED8' },
  { prefix: '/today', color: '#CA8A04' },
  { prefix: '/careers', color: '#7C3AED' },
  { prefix: '/recycling', color: '#15803D' },
  { prefix: '/troubleshooter', color: '#EA580C' },
  { prefix: '/comparator', color: '#1D4ED8' },
  { prefix: '/resources', color: '#7C3AED' },
  { prefix: '/practice', color: '#CA8A04' },
  { prefix: '/gate-mock', color: '#7C3AED' },
  { prefix: '/forum', color: '#7C3AED' },
  { prefix: '/calculators', color: '#CA8A04' },
  { prefix: '/leaderboard', color: '#CA8A04' },
]



function getDomainColor(pathname: string): string {
  const match = PATH_COLORS.find((p) => pathname.startsWith(p.prefix))
  return match?.color ?? '#0A0A0A'
}

// ─── Desktop Dropdown ─────────────────────────────────────────────────────────

function DropdownMenu({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false)
  const hasActive = item.children?.some((c) => pathname.startsWith(c.href))

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={`flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-widest px-3 py-2 border-b-4 transition-colors ${
          hasActive
            ? 'border-yellow-bright text-ink'
            : 'border-transparent text-ink/70 hover:text-ink hover:border-ink/30'
        }`}
      >
        {item.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 pt-0 z-50 min-w-64">
          <div className="border-4 border-ink bg-canvas shadow-hard-lg mt-1">
            {item.children?.map((child) => {
              const Icon = child.icon
              const isActive = pathname.startsWith(child.href)
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`flex items-start gap-3 px-4 py-3 border-b-2 border-ink last:border-0 transition-colors ${
                    isActive ? 'bg-ink text-white' : 'hover:bg-ink hover:text-white group'
                  }`}
                >
                  <div
                    className="w-8 h-8 border-2 border-current flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: isActive ? child.color : 'transparent', borderColor: isActive ? child.color : 'currentColor' }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono text-xs font-bold uppercase tracking-wider">{child.label}</div>
                    <div className={`text-xs mt-0.5 ${isActive ? 'text-white/70' : 'text-ink/50 group-hover:text-white/70'}`}>{child.desc}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────

function MobileDrawer({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const domainColor = getDomainColor(pathname)

  return (
    <>
      <div className="fixed inset-0 bg-ink/60 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-80 bg-canvas z-50 flex flex-col border-l-4 border-ink">

        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b-4 border-ink bg-ink">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-bright border-2 border-yellow-bright flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-ink" />
            </div>
            <span className="font-display text-lg font-black text-white">PolymerHub</span>
          </Link>
          <button onClick={onClose} className="text-white hover:text-yellow-bright transition-colors border-2 border-white/30 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Domain color strip */}
        <div className="h-2" style={{ backgroundColor: domainColor }} />

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto">
          {NAV.map((item) => (
            <div key={item.label} className="border-b-4 border-ink">
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest px-5 py-2 bg-ink/5 text-ink/50 border-b-2 border-ink/10">
                {item.label}
              </div>
              {'children' in item && item.children ? (
                item.children.map((child) => {
                  const Icon = child.icon
                  const isActive = pathname.startsWith(child.href)
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-5 py-3 border-b-2 border-ink/10 last:border-0 transition-colors ${
                        isActive ? 'bg-ink text-white' : 'hover:bg-ink/5'
                      }`}
                    >
                      <div
                        className="w-7 h-7 border-2 flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: isActive ? child.color : child.color + '20',
                          borderColor: child.color,
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: isActive ? 'white' : child.color }} />
                      </div>
                      <span className={`font-mono text-xs font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-ink'}`}>
                        {child.label}
                      </span>
                    </Link>
                  )
                })
              ) : (
                'href' in item && (
                  <Link
                    href={item.href!}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                      pathname.startsWith(item.href!) ? 'bg-ink text-white' : 'hover:bg-ink/5'
                    }`}
                  >
                    <div className="w-7 h-7 border-2 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: (item.color ?? '#7C3AED') + '20', borderColor: item.color ?? '#7C3AED' }}>
                      <Briefcase className="w-3.5 h-3.5" style={{ color: item.color ?? '#7C3AED' }} />
                    </div>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">{item.label}</span>
                  </Link>
                )
              )}
            </div>
          ))}
          <div className="border-b-4 border-ink">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest px-5 py-2 bg-ink/5 text-ink/50 border-b-2 border-ink/10">
              Account
            </div>
            <Link
              href="/dashboard"
              onClick={onClose}
              className={`flex items-center gap-3 px-5 py-3 border-b-2 border-ink/10 transition-colors ${
                pathname === '/dashboard' ? 'bg-ink text-white' : 'hover:bg-ink/5'
              }`}
            >
              <div className="w-7 h-7 border-2 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#1D4ED820', borderColor: '#1D4ED8' }}>
                <Layers className="w-3.5 h-3.5" style={{ color: '#1D4ED8' }} />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">My Dashboard</span>
            </Link>
            <Link
              href="/profile"
              onClick={onClose}
              className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                pathname === '/profile' ? 'bg-ink text-white' : 'hover:bg-ink/5'
              }`}
            >
              <div className="w-7 h-7 border-2 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#7C3AED20', borderColor: '#7C3AED' }}>
                <Layers className="w-3.5 h-3.5" style={{ color: '#7C3AED' }} />
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">My Profile</span>
            </Link>
          </div>
        </div>

        {/* Drawer footer CTAs */}
        <div className="border-t-4 border-ink p-4 space-y-3 bg-canvas">
          <Link
            href="/login"
            onClick={onClose}
            className="cn-btn-black w-full justify-center text-sm"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            onClick={onClose}
            className="cn-btn w-full bg-white text-ink border-ink justify-center text-sm"
          >
            Dashboard
          </Link>
          <Link
            href="/pricing"
            onClick={onClose}
            className="cn-btn-yellow w-full justify-center text-sm"
          >
            Get Premium — ₹149/mo
          </Link>
        </div>
      </div>
    </>
  )
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const domainColor = getDomainColor(pathname)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Domain color accent bar at very top */}
      <div className="h-1.5 w-full transition-colors duration-300" style={{ backgroundColor: domainColor }} />

      <nav className={`bg-canvas border-b-4 border-ink sticky top-0 z-40 transition-shadow ${scrolled ? 'shadow-[0_4px_0px_0px_#0A0A0A]' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-9 h-9 bg-ink border-4 border-ink flex items-center justify-center group-hover:bg-yellow-bright transition-colors">
              <FlaskConical className="w-4 h-4 text-white group-hover:text-ink transition-colors" />
            </div>
            <span className="font-display text-lg font-black text-ink tracking-tight">PolymerHub</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0 flex-1 justify-center">
            {NAV.map((item) => {
              if ('children' in item && item.children) {
                return <DropdownMenu key={item.label} item={item} pathname={pathname} />
              }
              const isActive = 'href' in item && pathname.startsWith(item.href!)
              return (
                <Link
                  key={item.label}
                  href={'href' in item ? item.href! : '/'}
                  className={`font-mono text-xs font-bold uppercase tracking-widest px-3 py-2 border-b-4 transition-colors ${
                    isActive
                      ? 'border-yellow-bright text-ink'
                      : 'border-transparent text-ink/70 hover:text-ink hover:border-ink/30'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <Link
              href="/login"
              className="font-mono text-xs font-bold uppercase tracking-widest text-ink/70 hover:text-ink transition-colors px-2"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="font-mono text-xs font-bold uppercase tracking-widest text-ink/70 hover:text-ink transition-colors px-2"
            >
              My Dashboard
            </Link>
            <Link href="/pricing" className="cn-btn-yellow text-xs py-2 px-4">
              ₹149/mo
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden border-4 border-ink w-10 h-10 flex items-center justify-center hover:bg-ink hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} />
    </>
  )
}
