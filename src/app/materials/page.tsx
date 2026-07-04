'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Search, Filter, Lock, ChevronDown, ChevronUp, ArrowRight, Database } from 'lucide-react'

type Material = {
  id: string
  name: string
  family: string
  density: number | null
  melt_temp: string | null
  tensile_strength: string | null
  top_applications: string[] | null
  indian_trade_names: string[] | null
  is_premium: boolean
}

const FAMILIES = ['All', 'Polyolefin', 'Vinyl', 'Styrenic', 'Engineering Thermoplastic', 'Polyester', 'Fluoropolymer', 'Elastomer', 'Bioplastic']

const FAMILY_COLORS: Record<string, { bg: string; text: string }> = {
  'Polyolefin': { bg: '#EEF4FF', text: '#0F4C81' },
  'Vinyl': { bg: '#ECFEFF', text: '#0891B2' },
  'Styrenic': { bg: '#F5F3FF', text: '#7C3AED' },
  'Engineering Thermoplastic': { bg: '#F0FDF4', text: '#16A34A' },
  'Polyester': { bg: '#FFF7ED', text: '#EA6C0A' },
  'Fluoropolymer': { bg: '#FFF1F2', text: '#E11D48' },
  'Elastomer': { bg: '#FEF2F2', text: '#DC2626' },
  'Bioplastic': { bg: '#F0FDF4', text: '#15803D' },
}

function MaterialRow({ material, expanded, onToggle }: {
  material: Material
  expanded: boolean
  onToggle: () => void
}) {
  const fc = FAMILY_COLORS[material.family] ?? { bg: '#F8FAFC', text: '#64748B' }

  if (material.is_premium) {
    return (
      <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4">
        <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-slate-400 text-sm">{material.name}</span>
          <span className="ml-2 text-xs bg-amber-100 text-amber-600 font-semibold px-2 py-0.5 rounded-full">Premium</span>
        </div>
        <Link href="/pricing" className="text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">
          Unlock
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md hover:shadow-slate-100 transition-all">
      {/* Row header */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 md:p-5 flex items-start md:items-center gap-4"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-bold text-[#0F172A] text-sm md:text-base">{material.name}</h3>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: fc.bg, color: fc.text }}
            >
              {material.family}
            </span>
          </div>
          {/* Quick specs row */}
          <div className="flex flex-wrap gap-3 text-xs text-slate-400 font-mono">
            {material.density && <span>ρ {material.density} g/cm³</span>}
            {material.melt_temp && <span>Tm {material.melt_temp}</span>}
            {material.tensile_strength && <span>σ {material.tensile_strength}</span>}
          </div>
        </div>
        <div className="flex-shrink-0 text-slate-300">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-slate-50 px-4 md:px-5 pb-5 pt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Properties */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Properties</p>
            <div className="space-y-2">
              {([
                ['Density', material.density ? `${material.density} g/cm³` : '—'],
                ['Melt Temp', material.melt_temp ?? '—'],
                ['Tensile Strength', material.tensile_strength ?? '—'],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className="text-xs font-semibold text-[#0F172A] font-mono">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Applications */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Applications</p>
            <div className="space-y-1">
              {(material.top_applications ?? []).map((app) => (
                <div key={app} className="flex items-start gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0F4C81] mt-1.5 flex-shrink-0" />
                  <span className="text-xs text-slate-600">{app}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Indian trade names */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Indian Trade Names</p>
            <div className="flex flex-wrap gap-1.5">
              {(material.indian_trade_names ?? []).map((tradeName) => (
                <span
                  key={tradeName}
                  className="text-xs px-2 py-1 rounded-lg font-medium"
                  style={{ backgroundColor: fc.bg, color: fc.text }}
                >
                  {tradeName}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedFamily, setSelectedFamily] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMaterials() {
      const supabase = createClient()
      setLoading(true)
      const { data } = await supabase
        .from('materials')
        .select('*')
        .order('name')
      setMaterials(data ?? [])
      setLoading(false)
    }
    fetchMaterials()
  }, [])

  const filtered = materials.filter((m) => {
    const matchSearch =
      search.trim() === '' ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.family.toLowerCase().includes(search.toLowerCase()) ||
      (m.indian_trade_names ?? []).some((t) => t.toLowerCase().includes(search.toLowerCase()))
    const matchFamily = selectedFamily === 'All' || m.family === selectedFamily
    return matchSearch && matchFamily
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC]">


      {/* ── Hero ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-[#EEF4FF] rounded-2xl flex items-center justify-center flex-shrink-0">
              <Database className="w-6 h-6 text-[#0F4C81]" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-[#F97316] mb-1">Database</p>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-2">Polymer Materials Database</h1>
              <p className="text-slate-500 text-sm max-w-xl">
                Properties, applications, and Indian trade names for {materials.length}+ polymers. The only database built for Indian PPE students.
              </p>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, family, or trade name..."
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent transition-all bg-white"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
                className="pl-10 pr-8 py-3 border border-slate-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent transition-all bg-white appearance-none cursor-pointer min-w-[180px]"
              >
                {FAMILIES.map((f) => (
                  <option key={f} value={f}>{f === 'All' ? 'All Families' : f}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Family chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FAMILIES.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFamily(f)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all ${
                selectedFamily === f
                  ? 'bg-[#0F4C81] text-white shadow-sm'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-[#0F4C81] hover:text-[#0F4C81]'
              }`}
            >
              {f === 'All' ? `All (${materials.length})` : f}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-xs text-slate-400 font-medium mb-4">
          Showing {filtered.length} of {materials.length} materials
          {search && ` matching "${search}"`}
        </p>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-48 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-64" />
              </div>
            ))}
          </div>
        )}

        {/* Materials list */}
        {!loading && (
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No materials found</p>
                <p className="text-sm mt-1">Try a different search or filter.</p>
              </div>
            ) : (
              filtered.map((material) => (
                <MaterialRow
                  key={material.id}
                  material={material}
                  expanded={expandedId === material.id}
                  onToggle={() => setExpandedId(expandedId === material.id ? null : material.id)}
                />
              ))
            )}
          </div>
        )}

        {/* Premium upsell */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-[#0F172A] text-sm mb-1">
                Unlock Chemical Resistance & Processing Data
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Premium includes chemical resistance tables, detailed processing conditions, and full material datasheets for all polymers.
              </p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
          >
            Unlock Premium <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
