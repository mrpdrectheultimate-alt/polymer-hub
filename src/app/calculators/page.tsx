'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator, BookOpen, Brain } from 'lucide-react'

// ─── Calculator definitions ────────────────────────────────────────────────────

type CalcId = 'tonnage' | 'cooling' | 'shrinkage' | 'cycle' | 'screw_shear' | 'gate_freeze' | 'mfi_viscosity' | 'drying'

const CALCS: { id: CalcId; label: string; icon: string; color: string; bg: string; subject: string; lessonSlug: string }[] = [
  { id: 'tonnage', label: 'Clamping Force / Tonnage', icon: '⚡', color: '#EA580C', bg: '#FFF7ED', subject: 'Polymer Processing', lessonSlug: 'injection-moulding-process-parameters-and-defects' },
  { id: 'cooling', label: 'Cooling Time Estimator', icon: '❄️', color: '#1D4ED8', bg: '#EFF6FF', subject: 'Mould Design', lessonSlug: 'cooling-system-design-and-cycle-time-optimization' },
  { id: 'shrinkage', label: 'Mould Shrinkage & Dimension', icon: '📏', color: '#15803D', bg: '#F0FDF4', subject: 'Polymer Processing', lessonSlug: 'injection-moulding-process-parameters-and-defects' },
  { id: 'cycle', label: 'Cycle Time Breakdown', icon: '⏱️', color: '#7C3AED', bg: '#F5F3FF', subject: 'Mould Design', lessonSlug: 'cooling-system-design-and-cycle-time-optimization' },
  { id: 'screw_shear', label: 'Screw Shear Rate', icon: '🔧', color: '#EA580C', bg: '#FFF7ED', subject: 'Polymer Processing', lessonSlug: 'extrusion-fundamentals-the-backbone-of-plastic-processing' },
  { id: 'gate_freeze', label: 'Gate Freeze-Off Time', icon: '🧊', color: '#1D4ED8', bg: '#EFF6FF', subject: 'Mould Design', lessonSlug: 'gate-design-types-location-and-sizing' },
  { id: 'mfi_viscosity', label: 'MFI ↔ Viscosity Estimator', icon: '🌊', color: '#CA8A04', bg: '#FEFCE8', subject: 'Polymer Processing', lessonSlug: 'melt-flow-index-mfi-measurement-significance-and-indian-standards' },
  { id: 'drying', label: 'Drying Time Calculator', icon: '🌡️', color: '#15803D', bg: '#F0FDF4', subject: 'Polymer Processing', lessonSlug: 'polymer-degradation-and-stabilization' },
]

// ─── Individual calculators ────────────────────────────────────────────────────

function TonnageCalc() {
  const [area, setArea] = useState(150)
  const [cavities, setCavities] = useState(4)
  const [pressure, setPressure] = useState(400)
  const [safety, setSafety] = useState(1.1)

  const tonnage = Math.round((area * cavities * pressure / 1000) * safety)
  const totalArea = area * cavities

  return (
    <div className="space-y-4">
      <div className="border-4 border-ink p-4 bg-orange/10">
        <p className="font-mono text-[10px] text-ink/60 uppercase tracking-wider">Formula</p>
        <p className="font-mono text-sm font-bold text-ink mt-1">F = (A × N × P / 1000) × SF</p>
        <p className="font-mono text-[9px] text-ink/50 mt-1">Where A = projected area (cm²), N = cavities, P = cavity pressure (bar), SF = safety factor</p>
      </div>
      {[
        { label: 'Projected area per cavity (cm²)', val: area, set: setArea, min: 1, max: 2000, step: 1, hint: 'Typical: 50–500 cm²' },
        { label: 'Number of cavities', val: cavities, set: setCavities, min: 1, max: 64, step: 1, hint: '1, 2, 4, 8, 16, 32...' },
        { label: 'Cavity pressure (bar)', val: pressure, set: setPressure, min: 100, max: 1500, step: 10, hint: 'Typical: 300–600 bar' },
        { label: 'Safety factor', val: safety, set: setSafety, min: 1.0, max: 1.5, step: 0.05, hint: 'Recommended: 1.1–1.2' },
      ].map(f => (
        <div key={f.label}>
          <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-wider block mb-1">{f.label}</label>
          <div className="flex items-center gap-3">
            <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
              onChange={e => f.set(Number(e.target.value))}
              className="flex-1 accent-orange-600" />
            <input type="number" min={f.min} max={f.max} step={f.step} value={f.val}
              onChange={e => f.set(Number(e.target.value))}
              className="w-24 border-4 border-ink px-2 py-1 font-mono text-sm font-black text-center" />
          </div>
          <p className="font-mono text-[8px] text-ink/30 mt-0.5">{f.hint}</p>
        </div>
      ))}
      <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0px 0px #EA580C' }}>
        <div className="border-b-4 border-ink px-4 py-2 bg-orange">
          <span className="font-mono text-[9px] font-black text-white uppercase tracking-widest">Result</span>
        </div>
        <div className="p-5 bg-orange/10">
          <div className="font-display text-5xl font-black text-orange mb-1">{tonnage} <span className="text-2xl">Tonnes</span></div>
          <p className="font-mono text-[10px] text-ink/60 uppercase tracking-wider">Required clamping force</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="border-2 border-ink/20 p-2 text-center bg-white">
              <div className="font-mono text-sm font-black text-ink">{totalArea} cm²</div>
              <div className="font-mono text-[8px] text-ink/40 uppercase">Total projected area</div>
            </div>
            <div className="border-2 border-ink/20 p-2 text-center bg-white">
              <div className="font-mono text-sm font-black text-ink">{Math.round(tonnage / safety)} T</div>
              <div className="font-mono text-[8px] text-ink/40 uppercase">Without safety factor</div>
            </div>
          </div>
          <div className="mt-4 border-l-4 border-orange pl-3">
            <p className="font-mono text-[10px] text-ink/60">
              {tonnage < 100 ? 'Small machine range — desktop or benchtop injection moulders.' :
               tonnage < 300 ? 'Medium machine — typical for automotive, consumer electronics components.' :
               tonnage < 800 ? 'Large machine — suited for large automotive panels, industrial parts.' :
               'Very large machine — require specialized facilities and toolroom support.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CoolingCalc() {
  const [thickness, setThickness] = useState(2.5)
  const [alpha, setAlpha] = useState(0.08)
  const [Tm, setTm] = useState(230)
  const [Tw, setTw] = useState(50)
  const [Te, setTe] = useState(90)

  const valid = Tm > Te && Te > Tw && thickness > 0 && alpha > 0
  const innerLog = (8 / Math.pow(Math.PI, 2)) * ((Tm - Tw) / (Te - Tw))
  const coolingTime = valid && innerLog > 0
    ? Math.max(0, (Math.pow(thickness, 2) / (Math.pow(Math.PI, 2) * alpha)) * Math.log(innerLog)).toFixed(1)
    : '—'

  const DIFFUSIVITY_PRESETS = [
    { label: 'PP / HDPE', val: 0.08 },
    { label: 'ABS / PS', val: 0.085 },
    { label: 'PC / Nylon', val: 0.09 },
    { label: 'POM / PET', val: 0.095 },
  ]

  return (
    <div className="space-y-4">
      <div className="border-4 border-ink p-4 bg-blue/10">
        <p className="font-mono text-[10px] text-ink/60 uppercase tracking-wider">Fourier Transient Conduction Formula</p>
        <p className="font-mono text-sm font-bold text-ink mt-1">tc = (h² / π²α) × ln(8/π² × (Tm-Tw)/(Te-Tw))</p>
        <p className="font-mono text-[9px] text-ink/50 mt-1">h = half-thickness (mm), α = thermal diffusivity (mm²/s)</p>
      </div>
      <div>
        <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-wider block mb-1">Material preset (thermal diffusivity)</label>
        <div className="flex gap-2 flex-wrap">
          {DIFFUSIVITY_PRESETS.map(p => (
            <button key={p.label} onClick={() => setAlpha(p.val)}
              className="font-mono text-[9px] font-bold border-4 border-ink px-3 py-1.5 uppercase transition-all"
              style={{ backgroundColor: alpha === p.val ? '#1D4ED8' : 'white', color: alpha === p.val ? 'white' : '#0A0A0A' }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
      {[
        { label: 'Maximum wall thickness (mm)', val: thickness, set: setThickness, min: 0.5, max: 15, step: 0.5, hint: 'Use maximum wall section in the part' },
        { label: 'Melt temperature Tm (°C)', val: Tm, set: setTm, min: 150, max: 400, step: 5, hint: 'PP: 220-250 · PC: 280-310 · Nylon: 260-290' },
        { label: 'Mould wall temperature Tw (°C)', val: Tw, set: setTw, min: 10, max: 150, step: 5, hint: 'PP: 40-60 · PC: 80-100 · Nylon: 60-80' },
        { label: 'Ejection temperature Te (°C)', val: Te, set: setTe, min: 40, max: 200, step: 5, hint: 'Must be below HDT of the material' },
      ].map(f => (
        <div key={f.label}>
          <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-wider block mb-1">{f.label}</label>
          <div className="flex items-center gap-3">
            <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
              onChange={e => f.set(Number(e.target.value))} className="flex-1" />
            <input type="number" min={f.min} max={f.max} step={f.step} value={f.val}
              onChange={e => f.set(Number(e.target.value))}
              className="w-24 border-4 border-ink px-2 py-1 font-mono text-sm font-black text-center" />
          </div>
          <p className="font-mono text-[8px] text-ink/30 mt-0.5">{f.hint}</p>
        </div>
      ))}
      {!valid && <div className="border-4 border-orange bg-orange/10 p-3 font-mono text-xs text-orange">⚠ Check temperatures: Tm must be greater than Te, which must be greater than Tw.</div>}
      <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0px 0px #1D4ED8' }}>
        <div className="border-b-4 border-ink px-4 py-2 bg-blue">
          <span className="font-mono text-[9px] font-black text-white uppercase tracking-widest">Result</span>
        </div>
        <div className="p-5 bg-blue/10">
          <div className="font-display text-5xl font-black text-blue mb-1">{coolingTime} <span className="text-2xl">seconds</span></div>
          <p className="font-mono text-[10px] text-ink/60 uppercase tracking-wider">Minimum theoretical cooling time</p>
          <div className="mt-3 border-l-4 border-blue pl-3">
            <p className="font-mono text-[10px] text-ink/60">
              Cooling is typically 50-70% of total cycle time. Add 20-30% to this value for actual mould design — the theoretical formula assumes ideal uniform cooling channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ShrinkageCalc() {
  const [mouldDim, setMouldDim] = useState(100.0)
  const [shrinkage, setShrinkage] = useState(1.5)
  const [target, setTarget] = useState(98.5)

  const partDim = mouldDim * (1 - shrinkage / 100)
  const requiredMould = target / (1 - shrinkage / 100)

  const SHRINKAGE_PRESETS = [
    { label: 'PP (unfilled)', val: 1.5 }, { label: 'HDPE', val: 2.0 },
    { label: 'ABS', val: 0.5 }, { label: 'PC', val: 0.6 },
    { label: 'Nylon 6 (dry)', val: 1.0 }, { label: 'POM', val: 2.0 },
    { label: 'PVC (rigid)', val: 0.4 }, { label: '30% GF Nylon', val: 0.4 },
  ]

  return (
    <div className="space-y-4">
      <div className="border-4 border-ink p-4 bg-green/10">
        <p className="font-mono text-[10px] text-ink/60 uppercase tracking-wider">Formula</p>
        <p className="font-mono text-sm font-bold text-ink mt-1">Part Dim = Mould Dim × (1 - S/100)</p>
        <p className="font-mono text-sm font-bold text-ink">Mould Dim = Target / (1 - S/100)</p>
        <p className="font-mono text-[9px] text-ink/50 mt-1">S = shrinkage percentage</p>
      </div>
      <div>
        <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-wider block mb-1">Material shrinkage preset</label>
        <div className="flex gap-2 flex-wrap">
          {SHRINKAGE_PRESETS.map(p => (
            <button key={p.label} onClick={() => setShrinkage(p.val)}
              className="font-mono text-[9px] font-bold border-4 border-ink px-3 py-1.5 uppercase transition-all"
              style={{ backgroundColor: shrinkage === p.val ? '#15803D' : 'white', color: shrinkage === p.val ? 'white' : '#0A0A0A' }}>
              {p.label} ({p.val}%)
            </button>
          ))}
        </div>
      </div>
      {[
        { label: 'Shrinkage rate (%)', val: shrinkage, set: setShrinkage, min: 0.1, max: 5.0, step: 0.1, hint: 'See presets above or material datasheet' },
        { label: 'Mould cavity dimension (mm)', val: mouldDim, set: setMouldDim, min: 1, max: 1000, step: 0.5, hint: 'The dimension of the steel mould cavity' },
        { label: 'Required part dimension (mm)', val: target, set: setTarget, min: 1, max: 1000, step: 0.5, hint: 'The dimension you need the finished part to be' },
      ].map(f => (
        <div key={f.label}>
          <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-wider block mb-1">{f.label}</label>
          <div className="flex items-center gap-3">
            <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
              onChange={e => f.set(Number(e.target.value))} className="flex-1" />
            <input type="number" min={f.min} max={f.max} step={f.step} value={f.val}
              onChange={e => f.set(Number(e.target.value))}
              className="w-24 border-4 border-ink px-2 py-1 font-mono text-sm font-black text-center" />
          </div>
          <p className="font-mono text-[8px] text-ink/30 mt-0.5">{f.hint}</p>
        </div>
      ))}
      <div className="grid grid-cols-2 gap-4">
        <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0px 0px #15803D' }}>
          <div className="border-b-4 border-ink px-4 py-2 bg-green"><span className="font-mono text-[9px] font-black text-white uppercase">Part dimension</span></div>
          <div className="p-4 bg-green/10 text-center">
            <div className="font-display text-3xl font-black text-green">{partDim.toFixed(2)} mm</div>
            <p className="font-mono text-[9px] text-ink/50 mt-1">From mould {mouldDim} mm</p>
          </div>
        </div>
        <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0px 0px #15803D' }}>
          <div className="border-b-4 border-ink px-4 py-2 bg-green"><span className="font-mono text-[9px] font-black text-white uppercase">Required mould size</span></div>
          <div className="p-4 bg-green/10 text-center">
            <div className="font-display text-3xl font-black text-green">{requiredMould.toFixed(2)} mm</div>
            <p className="font-mono text-[9px] text-ink/50 mt-1">To achieve {target} mm part</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CycleTimeCalc() {
  const [injection, setInjection] = useState(3)
  const [packing, setPacking] = useState(8)
  const [cooling, setCooling] = useState(20)
  const [mould, setMould] = useState(4)

  const total = injection + packing + cooling + mould
  const cyclesPerHour = Math.round(3600 / total)
  const phases = [
    { label: 'Injection time', val: injection, set: setInjection, color: '#EA580C', hint: 'Filling phase: 1-5 seconds typical' },
    { label: 'Packing / Hold time', val: packing, set: setPacking, color: '#7C3AED', hint: 'Compensates for shrinkage: 5-15 seconds' },
    { label: 'Cooling time', val: cooling, set: setCooling, color: '#1D4ED8', hint: 'Largest component: 10-40 seconds' },
    { label: 'Mould open / Eject / Close', val: mould, set: setMould, color: '#15803D', hint: 'Machine dependent: 2-8 seconds' },
  ]

  return (
    <div className="space-y-4">
      <div className="border-4 border-ink p-4" style={{ backgroundColor: '#F5F3FF' }}>
        <p className="font-mono text-[10px] text-ink/60 uppercase tracking-wider">Formula</p>
        <p className="font-mono text-sm font-bold text-ink mt-1">Total Cycle = Injection + Packing + Cooling + Mould Movement</p>
        <p className="font-mono text-[9px] text-ink/50 mt-1">Cooling time typically 50-70% of total cycle</p>
      </div>
      {phases.map(f => (
        <div key={f.label}>
          <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-wider block mb-1">{f.label}</label>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <div className="border-4 border-ink h-3 overflow-hidden">
                <div className="h-full transition-all" style={{ width: `${(f.val / 60) * 100}%`, backgroundColor: f.color }} />
              </div>
              <input type="range" min={0.5} max={60} step={0.5} value={f.val}
                onChange={e => f.set(Number(e.target.value))}
                className="w-full mt-1 accent-violet-600" />
            </div>
            <input type="number" min={0.5} max={60} step={0.5} value={f.val}
              onChange={e => f.set(Number(e.target.value))}
              className="w-20 border-4 border-ink px-2 py-1 font-mono text-sm font-black text-center" />
            <span className="font-mono text-[10px] text-ink/50 w-4">s</span>
          </div>
          <p className="font-mono text-[8px] text-ink/30">{f.hint}</p>
        </div>
      ))}
      <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0px 0px #7C3AED' }}>
        <div className="border-b-4 border-ink px-4 py-2 bg-violet"><span className="font-mono text-[9px] font-black text-white uppercase tracking-widest">Result</span></div>
        <div className="p-5" style={{ backgroundColor: '#F5F3FF' }}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="font-display text-4xl font-black text-violet">{total.toFixed(1)}s</div>
              <p className="font-mono text-[9px] text-ink/50 uppercase mt-1">Total cycle time</p>
            </div>
            <div className="text-center">
              <div className="font-display text-4xl font-black text-violet">{cyclesPerHour}</div>
              <p className="font-mono text-[9px] text-ink/50 uppercase mt-1">Shots / hour</p>
            </div>
          </div>
          <div className="border-4 border-ink h-6 overflow-hidden flex">
            {phases.map(f => (
              <div key={f.label} className="h-full" title={`${f.label}: ${f.val}s`}
                style={{ width: `${(f.val / total) * 100}%`, backgroundColor: f.color }} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {phases.map(f => (
              <div key={f.label} className="flex items-center gap-1">
                <div className="w-3 h-3 border border-ink flex-shrink-0" style={{ backgroundColor: f.color }} />
                <span className="font-mono text-[8px] text-ink/50">{f.label.split(' ')[0]}: {((f.val / total) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ScrewShearCalc() {
  const [diameter, setDiameter] = useState(40)
  const [rpm, setRpm] = useState(120)
  const [channelDepth, setChannelDepth] = useState(4)

  const shearRate = Math.round((Math.PI * diameter * rpm) / (60 * channelDepth))
  const tipSpeed = Math.round((Math.PI * diameter * rpm) / 60)

  return (
    <div className="space-y-4">
      <div className="border-4 border-ink p-4 bg-orange/10">
        <p className="font-mono text-[10px] text-ink/60 uppercase tracking-wider">Formula</p>
        <p className="font-mono text-sm font-bold text-ink mt-1">γ̇ = (π × D × N) / (60 × h)</p>
        <p className="font-mono text-[9px] text-ink/50 mt-1">D = screw diameter (mm), N = screw speed (RPM), h = metering zone channel depth (mm)</p>
      </div>
      {[
        { label: 'Screw diameter D (mm)', val: diameter, set: setDiameter, min: 20, max: 200, step: 5, hint: 'Standard: 30, 40, 50, 60, 80mm' },
        { label: 'Screw speed N (RPM)', val: rpm, set: setRpm, min: 10, max: 400, step: 5, hint: 'Typical range: 50-200 RPM' },
        { label: 'Metering zone channel depth h (mm)', val: channelDepth, set: setChannelDepth, min: 1, max: 20, step: 0.5, hint: 'Typically D/8 to D/12' },
      ].map(f => (
        <div key={f.label}>
          <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-wider block mb-1">{f.label}</label>
          <div className="flex items-center gap-3">
            <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
              onChange={e => f.set(Number(e.target.value))} className="flex-1" />
            <input type="number" value={f.val} onChange={e => f.set(Number(e.target.value))}
              className="w-24 border-4 border-ink px-2 py-1 font-mono text-sm font-black text-center" />
          </div>
          <p className="font-mono text-[8px] text-ink/30">{f.hint}</p>
        </div>
      ))}
      <div className="grid grid-cols-2 gap-4">
        <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0px 0px #EA580C' }}>
          <div className="border-b-4 border-ink px-4 py-2 bg-orange"><span className="font-mono text-[9px] font-black text-white uppercase">Shear rate</span></div>
          <div className="p-4 bg-orange/10 text-center">
            <div className="font-display text-3xl font-black text-orange">{shearRate} s⁻¹</div>
            <p className="font-mono text-[9px] text-ink/50 mt-1">{shearRate < 50 ? 'Low — risk of unmelt' : shearRate < 200 ? 'Normal range' : 'High — risk of degradation'}</p>
          </div>
        </div>
        <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0px 0px #EA580C' }}>
          <div className="border-b-4 border-ink px-4 py-2 bg-orange"><span className="font-mono text-[9px] font-black text-white uppercase">Screw tip speed</span></div>
          <div className="p-4 bg-orange/10 text-center">
            <div className="font-display text-3xl font-black text-orange">{tipSpeed} mm/s</div>
            <p className="font-mono text-[9px] text-ink/50 mt-1">{tipSpeed < 300 ? 'Acceptable' : 'High — check heat-sensitive materials'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function GateFreezeCalc() {
  const [gateThickness, setGateThickness] = useState(1.0)
  const [alpha, setAlpha] = useState(0.08)

  const freezeTime = ((Math.pow(gateThickness, 2)) / (4 * Math.pow(Math.PI, 2) * alpha)).toFixed(1)

  return (
    <div className="space-y-4">
      <div className="border-4 border-ink p-4 bg-blue/10">
        <p className="font-mono text-[10px] text-ink/60 uppercase tracking-wider">Formula (simplified)</p>
        <p className="font-mono text-sm font-bold text-ink mt-1">tf ≈ tg² / (4π²α)</p>
        <p className="font-mono text-[9px] text-ink/50 mt-1">tg = gate thickness (mm), α = thermal diffusivity (mm²/s)</p>
        <p className="font-mono text-[9px] text-ink/50 mt-1">Hold time must be ≥ gate freeze-off time to prevent backflow</p>
      </div>
      {[
        { label: 'Gate thickness tg (mm)', val: gateThickness, set: setGateThickness, min: 0.2, max: 5, step: 0.1, hint: 'Typically 50-70% of adjacent wall thickness' },
        { label: 'Thermal diffusivity α (mm²/s)', val: alpha, set: setAlpha, min: 0.05, max: 0.15, step: 0.005, hint: 'PP: 0.08 · ABS: 0.085 · PC: 0.09' },
      ].map(f => (
        <div key={f.label}>
          <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-wider block mb-1">{f.label}</label>
          <div className="flex items-center gap-3">
            <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
              onChange={e => f.set(Number(e.target.value))} className="flex-1" />
            <input type="number" value={f.val} onChange={e => f.set(Number(e.target.value))}
              className="w-24 border-4 border-ink px-2 py-1 font-mono text-sm font-black text-center" />
          </div>
          <p className="font-mono text-[8px] text-ink/30">{f.hint}</p>
        </div>
      ))}
      <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0px 0px #1D4ED8' }}>
        <div className="border-b-4 border-ink px-4 py-2 bg-blue"><span className="font-mono text-[9px] font-black text-white uppercase tracking-widest">Gate freeze-off time</span></div>
        <div className="p-5 bg-blue/10 text-center">
          <div className="font-display text-5xl font-black text-blue mb-1">{freezeTime} <span className="text-2xl">seconds</span></div>
          <p className="font-mono text-[10px] text-ink/60">Set hold time ≥ {freezeTime}s to prevent suck-back</p>
          <p className="font-mono text-[9px] text-ink/40 mt-1">Increasing gate thickness significantly increases hold time requirement</p>
        </div>
      </div>
    </div>
  )
}

function MFICalc() {
  const [mfi, setMfi] = useState(10)


  // Approximate viscosity from MFI (empirical relationship)
  const viscosity = Math.round(53000 / Math.pow(mfi, 0.67))
  const mwEst = mfi < 1 ? 'Very High (>500,000 g/mol)' : mfi < 5 ? 'High (200,000-500,000 g/mol)' : mfi < 20 ? 'Medium (100,000-200,000 g/mol)' : 'Low (<100,000 g/mol)'
  const application = mfi < 1 ? 'Pipe / Profile extrusion, film blowing' : mfi < 5 ? 'Blow moulding, general extrusion' : mfi < 20 ? 'General injection moulding' : mfi < 50 ? 'Thin-wall moulding, fibres' : 'Fibres, non-wovens, fast-cycling thin parts'

  return (
    <div className="space-y-4">
      <div className="border-4 border-ink p-4" style={{ backgroundColor: '#FEFCE8' }}>
        <p className="font-mono text-[10px] text-ink/60 uppercase tracking-wider">Relationship (empirical approximation)</p>
        <p className="font-mono text-sm font-bold text-ink mt-1">η ≈ 53,000 / MFI^0.67</p>
        <p className="font-mono text-[9px] text-ink/50 mt-1">Higher MFI = lower viscosity = lower molecular weight. This is an empirical estimate — actual viscosity depends on shear rate (viscosity is shear-thinning).</p>
      </div>
      <div>
        <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-wider block mb-1">MFI value (g/10min)</label>
        <div className="flex items-center gap-3">
          <input type="range" min={0.1} max={100} step={0.5} value={mfi}
            onChange={e => setMfi(Number(e.target.value))} className="flex-1" />
          <input type="number" value={mfi} onChange={e => setMfi(Number(e.target.value))}
            className="w-24 border-4 border-ink px-2 py-1 font-mono text-sm font-black text-center" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div className="border-4 border-ink p-4" style={{ backgroundColor: '#FEFCE8', boxShadow: '3px 3px 0px 0px #CA8A04' }}>
          <div className="font-display text-3xl font-black" style={{ color: '#CA8A04' }}>{viscosity.toLocaleString()} Pa·s</div>
          <p className="font-mono text-[9px] text-ink/50 uppercase mt-1">Estimated zero-shear viscosity (approximate)</p>
        </div>
        <div className="border-4 border-ink p-4 bg-canvas">
          <p className="font-mono text-[9px] font-bold text-ink/50 uppercase tracking-wider mb-1">Estimated molecular weight</p>
          <p className="font-bold text-ink">{mwEst}</p>
        </div>
        <div className="border-4 border-ink p-4 bg-canvas">
          <p className="font-mono text-[9px] font-bold text-ink/50 uppercase tracking-wider mb-1">Recommended application</p>
          <p className="font-bold text-ink">{application}</p>
        </div>
      </div>
    </div>
  )
}

function DryingCalc() {
  const MATERIALS = [
    { label: 'Nylon 6 (PA6)', temp: 80, time: 4, target: 0.20, initial: 3.5, color: '#7C3AED' },
    { label: 'Nylon 66 (PA66)', temp: 80, time: 4, target: 0.20, initial: 2.5, color: '#7C3AED' },
    { label: 'PET (bottle grade)', temp: 165, time: 4, target: 0.005, initial: 0.4, color: '#1D4ED8' },
    { label: 'PC (Polycarbonate)', temp: 120, time: 4, target: 0.020, initial: 0.35, color: '#1D4ED8' },
    { label: 'ABS', temp: 80, time: 3, target: 0.10, initial: 0.4, color: '#EA580C' },
    { label: 'PBT', temp: 120, time: 4, target: 0.020, initial: 0.3, color: '#EA580C' },
    { label: 'PMMA (Acrylic)', temp: 80, time: 4, target: 0.10, initial: 0.35, color: '#15803D' },
    { label: 'PP (standard)', temp: 0, time: 0, target: 0, initial: 0.01, color: '#15803D' },
  ]

  const [selected, setSelected] = useState(MATERIALS[2])

  return (
    <div className="space-y-4">
      <div className="border-4 border-ink p-4 bg-green/10">
        <p className="font-mono text-[10px] text-ink/60 uppercase tracking-wider">Why drying matters</p>
        <p className="text-sm text-ink mt-1">Hygroscopic polymers absorb moisture from air. During melt processing, this moisture causes hydrolytic chain scission — reducing molecular weight, causing silver streaks, splay marks, and loss of mechanical properties. Drying is non-negotiable for PA, PET, PC, ABS, PBT, and PMMA.</p>
      </div>
      <div>
        <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-wider block mb-1">Select material</label>
        <div className="flex flex-wrap gap-2">
          {MATERIALS.map(m => (
            <button key={m.label} onClick={() => setSelected(m)}
              className="font-mono text-[9px] font-bold border-4 border-ink px-3 py-1.5 uppercase transition-all"
              style={{ backgroundColor: selected.label === m.label ? m.color : 'white', color: selected.label === m.label ? 'white' : '#0A0A0A' }}>
              {m.label}
            </button>
          ))}
        </div>
      </div>
      {selected.time === 0 ? (
        <div className="border-4 border-green bg-green/10 p-5 text-center">
          <div className="font-display text-2xl font-black text-green mb-2">No Drying Required</div>
          <p className="font-mono text-[10px] text-ink/60">PP is non-hygroscopic — no pre-drying needed under normal storage conditions. If exposed to condensation, dry at 80°C for 1-2 hours as a precaution.</p>
        </div>
      ) : (
        <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: `4px 4px 0px 0px ${selected.color}` }}>
          <div className="border-b-4 border-ink px-4 py-2" style={{ backgroundColor: selected.color }}>
            <span className="font-mono text-[9px] font-black text-white uppercase tracking-widest">Drying specification — {selected.label}</span>
          </div>
          <div className="p-5 bg-canvas">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="border-4 border-ink p-3 text-center" style={{ backgroundColor: selected.color + '15' }}>
                <div className="font-display text-3xl font-black" style={{ color: selected.color }}>{selected.temp}°C</div>
                <p className="font-mono text-[9px] text-ink/50 uppercase mt-1">Drying temperature</p>
              </div>
              <div className="border-4 border-ink p-3 text-center" style={{ backgroundColor: selected.color + '15' }}>
                <div className="font-display text-3xl font-black" style={{ color: selected.color }}>{selected.time}h</div>
                <p className="font-mono text-[9px] text-ink/50 uppercase mt-1">Minimum drying time</p>
              </div>
              <div className="border-4 border-ink p-3 text-center" style={{ backgroundColor: selected.color + '15' }}>
                <div className="font-display text-3xl font-black" style={{ color: selected.color }}>{selected.target}%</div>
                <p className="font-mono text-[9px] text-ink/50 uppercase mt-1">Target moisture</p>
              </div>
            </div>
            <div className="border-4 border-ink p-3 font-mono text-[10px] text-ink/60">
              <strong>Initial moisture:</strong> ~{selected.initial}% (equilibrium at 50% RH) → Must reduce to &lt;{selected.target}% before processing. Use dehumidifying dryer, not hot air dryer, for moisture-sensitive materials.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

const CALC_COMPONENTS: Record<CalcId, React.ReactNode> = {
  tonnage: <TonnageCalc />,
  cooling: <CoolingCalc />,
  shrinkage: <ShrinkageCalc />,
  cycle: <CycleTimeCalc />,
  screw_shear: <ScrewShearCalc />,
  gate_freeze: <GateFreezeCalc />,
  mfi_viscosity: <MFICalc />,
  drying: <DryingCalc />,
}

export default function CalculatorsPage() {
  const [active, setActive] = useState<CalcId>('tonnage')
  const current = CALCS.find(c => c.id === active)!

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2" style={{ backgroundColor: current.color }} />

      {/* Hero */}
      <section className="border-b-4 border-ink bg-ink px-6 md:px-12 py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 border-4 border-yellow-bright flex items-center justify-center" style={{ backgroundColor: '#CA8A04' }}>
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="font-mono text-[10px] font-black text-yellow-bright border-2 border-yellow-bright px-3 py-1 uppercase tracking-widest">Engineering Calculators</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black text-white leading-none mb-4">
            CALCULATE.<br />
            <span className="text-yellow-bright italic">NOT GUESS.</span>
          </h1>
          <p className="text-white/70 max-w-xl leading-relaxed">
            8 industrial-grade calculators for polymer processing engineers. Clamping force, cooling time, shrinkage, cycle time, screw shear rate — all in one place.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="font-mono text-[9px] font-bold text-ink/40 uppercase tracking-widest mb-3">Select Calculator</div>
          {CALCS.map(c => (
            <button key={c.id} onClick={() => setActive(c.id)}
              className="w-full text-left border-4 border-ink p-3 flex items-center gap-3 transition-all"
              style={{
                backgroundColor: active === c.id ? c.color : 'white',
                color: active === c.id ? 'white' : '#0A0A0A',
                boxShadow: `2px 2px 0px 0px ${c.color}`,
              }}>
              <span className="text-xl">{c.icon}</span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wide leading-snug">{c.label}</span>
            </button>
          ))}
        </div>

        {/* Calculator */}
        <div className="lg:col-span-3">
          <div className="border-4 border-ink overflow-hidden shadow-hard" style={{ boxShadow: `6px 6px 0px 0px ${current.color}` }}>
            <div className="border-b-4 border-ink px-5 py-4 flex items-center justify-between flex-wrap gap-3" style={{ backgroundColor: current.bg }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{current.icon}</span>
                <div>
                  <h2 className="font-display text-xl font-black text-ink">{current.label}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[9px] text-ink/50">{current.subject}</span>
                    <Link href={`/lessons/${current.lessonSlug}`}
                      className="font-mono text-[9px] font-bold flex items-center gap-1 hover:underline"
                      style={{ color: current.color }}>
                      <BookOpen className="w-2.5 h-2.5" /> Related Lesson →
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/ai-tutor" className="font-mono text-[9px] font-bold border-2 px-2 py-1 flex items-center gap-1 uppercase hover:opacity-80 transition-opacity"
                style={{ borderColor: current.color, color: current.color }}>
                <Brain className="w-3 h-3" /> Ask AI
              </Link>
            </div>
            <div className="p-6 bg-canvas">
              {CALC_COMPONENTS[active]}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
