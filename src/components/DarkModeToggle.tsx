'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('ph_dark_mode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = saved ? saved === 'true' : prefersDark
    setDark(shouldBeDark)
    document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light')
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    localStorage.setItem('ph_dark_mode', String(next))
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      className="border-4 border-ink w-10 h-10 flex items-center justify-center hover:bg-ink hover:text-white transition-colors"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle dark mode"
    >
      {dark
        ? <Sun className="w-4 h-4 text-yellow-bright" />
        : <Moon className="w-4 h-4 text-ink" />}
    </button>
  )
}
