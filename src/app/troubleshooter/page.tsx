'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, AlertTriangle, CheckCircle, ChevronDown, RotateCcw, Wrench, Sparkles } from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────────

type Process = 'injection' | 'extrusion' | 'blow'
type Severity = 'critical' | 'moderate' | 'minor'
type Fix = { parameter: string; action: string; detail: string }
type Defect = {
  id: string; name: string; description: string; severity: Severity
  causes: string[]; fixes: Fix[]; preventionTip: string; source: string
}
type ProcessData = { label: string; icon: string; defects: Defect[] }

// ─── Data ──────────────────────────────────────────────────────────────────────

const DATA: Record<Process, ProcessData> = {
  injection: {
    label: 'Injection Moulding', icon: '🔩',
    defects: [
      {
        id: 'sink-marks', name: 'Sink Marks', severity: 'moderate',
        description: 'Depressions or dimples on the surface of a moulded part, typically opposite ribs, bosses, or thick wall sections.',
        causes: [
          'Insufficient holding pressure — melt shrinks away from mould wall during cooling',
          'Holding time too short — gate freezes before part is fully packed',
          'Wall section too thick — skin solidifies but core shrinks inward',
          'Melt temperature too high — excessive shrinkage during cooling',
          'Gate too small — pressure drop across gate limits effective packing',
        ],
        fixes: [
          { parameter: 'Holding Pressure', action: 'Increase by 10–15%', detail: 'Raise hold pressure until sink marks eliminate or reduce. Typical range: 50–80% of injection pressure.' },
          { parameter: 'Holding Time', action: 'Extend by 1–3 seconds', detail: 'Hold pressure must be maintained until gate freeze-off. Test: increase time until part weight stabilizes.' },
          { parameter: 'Melt Temperature', action: 'Reduce by 5–10°C', detail: 'Lower melt temp reduces shrinkage magnitude. Stay within material processing window minimum.' },
          { parameter: 'Mould Temperature', action: 'Reduce by 5–10°C', detail: 'Faster surface solidification reduces the time window during which sink can form.' },
          { parameter: 'Gate Size', action: 'Increase gate cross-section', detail: 'Larger gate delays freeze-off, allowing more packing pressure transfer to the cavity.' },
        ],
        preventionTip: 'Design ribs to 60% or less of the adjacent wall thickness. Use coring to reduce wall thickness in thick sections. Position gates adjacent to the thickest wall section.',
        source: 'Rosato — Plastics Processing Data Handbook; Allen & Baker — Handbook of Plastic Technology',
      },
      {
        id: 'warpage', name: 'Warpage / Distortion', severity: 'critical',
        description: 'The moulded part deforms or twists out of its intended shape after ejection — the most common dimensional quality failure in injection moulding.',
        causes: [
          'Non-uniform cooling — areas cooling faster shrink more, pulling the part',
          'Differential orientation — fibre or molecular orientation creates anisotropic shrinkage',
          'Residual stress from over-packing — excessive holding pressure freezes in stress',
          'Asymmetric wall thickness — thick and thin sections cool and shrink at different rates',
          'Ejection before sufficient cooling — part still soft when ejected, deforms under ejector pin force',
        ],
        fixes: [
          { parameter: 'Cooling System', action: 'Audit cooling channel layout for uniform heat extraction', detail: 'Measure mould surface temperature across the cavity. Temperature variation more than 10C indicates uneven cooling. Rebalance or add cooling channels to hot spots.' },
          { parameter: 'Cooling Time', action: 'Increase by 2–5 seconds', detail: 'Part must reach safe ejection temperature throughout — not just at the surface.' },
          { parameter: 'Mould Temperature', action: 'Balance both mould halves to within 5°C', detail: 'Core and cavity side temperature differential causes asymmetric shrinkage. Measure with thermocouple and adjust water flow rates.' },
          { parameter: 'Holding Pressure', action: 'Reduce if over-packed', detail: 'Excessive hold pressure creates residual stress that releases on ejection as warpage. Reduce gradually until part weight drops slightly — that is optimum.' },
          { parameter: 'Gate Location', action: 'Reposition gate(s) for symmetric flow', detail: 'Asymmetric fill patterns cause differential orientation shrinkage. Use Moldflow simulation to predict weld line and flow front position before cutting steel.' },
        ],
        preventionTip: 'Use Moldflow or Moldex3D to predict warpage before tooling is cut. Design for uniform wall thickness. Place cooling channels at equal depth from cavity surface on both mould halves.',
        source: 'Rosato — Plastics Processing Data Handbook; Osswald — Plastics Engineering',
      },
      {
        id: 'short-shot', name: 'Short Shot', severity: 'critical',
        description: 'The mould cavity is not completely filled — the part is missing sections, typically at the end of flow or in thin areas remote from the gate.',
        causes: [
          'Injection pressure or speed insufficient to fill the cavity before material freezes',
          'Melt temperature too low — viscosity too high, flow stops before fill complete',
          'Inadequate venting — trapped air at flow front prevents fill',
          'Shot size too small — insufficient material volume for the cavity',
          'Gate or runner too small — excessive pressure drop leaves insufficient pressure at flow front',
        ],
        fixes: [
          { parameter: 'Injection Pressure', action: 'Increase by 10–20 bar', detail: 'First check: ensure hydraulic/electric pressure limit is not the bottleneck. Pressure at end of fill should drop 10–15% from peak — if no drop, pressure is insufficient.' },
          { parameter: 'Injection Speed', action: 'Increase fill speed in stages', detail: 'Faster fill reduces viscosity (shear-thinning) and reduces the time available for freeze-off. Use velocity-pressure switchover near 95–98% fill.' },
          { parameter: 'Melt Temperature', action: 'Increase by 5–10°C', detail: 'Reduces melt viscosity, improves flow to remote areas. Do not exceed material maximum processing temperature.' },
          { parameter: 'Venting', action: 'Add or deepen vents at short-shot location', detail: 'Vent depth: 0.02–0.05mm for most materials. Position vents at the last-fill point.' },
          { parameter: 'Shot Size', action: 'Increase by 5–10%', detail: 'If cushion is zero or negative, shot size is insufficient. Cushion should be 3–6mm for a typical mould.' },
        ],
        preventionTip: 'Run a fill study (short shots at 50%, 70%, 90%, 98% fill) before first full shot. This reveals fill pattern, last-fill areas, and vent requirements before production.',
        source: 'Allen & Baker — Handbook of Plastic Technology; Rosato — Plastics Processing Data Handbook',
      },
      {
        id: 'flash', name: 'Flash', severity: 'moderate',
        description: 'Thin fins or webs of plastic at the parting line, ejector pin locations, or insert boundaries — material has escaped the cavity.',
        causes: [
          'Clamping force insufficient for the projected area times cavity pressure',
          'Mould parting line damaged, worn, or contaminated — fails to seal',
          'Injection pressure too high — exceeds mould clamping capacity',
          'Over-packing — excessive holding pressure forces material through parting line',
          'Mould misalignment — core and cavity not mating correctly',
        ],
        fixes: [
          { parameter: 'Clamping Force', action: 'Verify required tonnage: Clamp = Projected area (cm2) x cavity pressure (bar) / 100', detail: 'Required clamp force should be 10–20% below machine maximum for safety margin. If requirement exceeds machine capacity, reduce injection pressure or use a larger machine.' },
          { parameter: 'Injection Pressure', action: 'Reduce by 5–10 bar', detail: 'If flash appears at high hold pressure, reduce hold pressure first — this often eliminates flash without affecting fill quality.' },
          { parameter: 'Parting Line', action: 'Inspect, clean, and polish mould parting surface', detail: 'Polish parting line to Ra 0.4–0.8 um. Check for burrs, damage, or plastic contamination in the parting land area.' },
          { parameter: 'Mould Temperature', action: 'Reduce by 5°C', detail: 'Higher mould temperature reduces melt viscosity, making it easier for flash to form.' },
          { parameter: 'Switchover Point', action: 'Switch velocity to pressure earlier', detail: 'Move velocity-to-pressure switchover earlier (at 90–95% fill) to reduce peak cavity pressure at the parting line.' },
        ],
        preventionTip: 'During mould design, calculate required clamp force and size the machine with 15–20% margin. Design parting line with adequate land width (minimum 3–5mm for most resins).',
        source: 'Allen & Baker — Handbook of Plastic Technology; Rosato — Plastics Processing Data Handbook',
      },
      {
        id: 'burn-marks', name: 'Burn Marks / Diesel Effect', severity: 'moderate',
        description: 'Brown or black discolouration at the end of flow, in ribs, or at vent locations — caused by adiabatic compression of trapped air igniting.',
        causes: [
          'Inadequate venting — air compressed ahead of melt front reaches ignition temperature',
          'Injection speed too high — adiabatic compression of trapped air exceeds material ignition temperature',
          'Melt temperature too high — material approaching thermal degradation temperature before compression',
          'Vents blocked by material — previous shot has sealed vent channels',
          'Blind pockets with no vent provision in mould design',
        ],
        fixes: [
          { parameter: 'Injection Speed', action: 'Reduce fill speed in final 20–30% of stroke', detail: 'Use velocity profiling: fast fill for 70% of stroke, then decelerate for final 30% to give trapped air time to escape through vents.' },
          { parameter: 'Venting', action: 'Add vents at burn location; clean existing vents', detail: 'Vent at every last-fill point and every blind pocket. Clean vents after every 500–1000 shots — plastic deposits block vent channels quickly.' },
          { parameter: 'Melt Temperature', action: 'Reduce by 5–10°C', detail: 'Lower starting temperature means compressed air needs more heat to reach degradation temperature — reduces sensitivity to burning.' },
          { parameter: 'Mould Design', action: 'Add ejector pins at blind spots for venting', detail: 'Ejector pins in ribs and bosses act as secondary vents (clearance ~0.02mm between pin and hole provides venting without flash).' },
          { parameter: 'Cycle Time', action: 'Check for abnormally long residence time', detail: 'If cycle time is long, degraded material in the barrel can cause discolouration. Purge barrel if residence time exceeds 3x normal.' },
        ],
        preventionTip: 'Design vents into the mould at every predicted last-fill location (use Moldflow fill simulation to identify these). Rib tips and deep bosses always need ejector pin venting.',
        source: 'Allen & Baker — Handbook of Plastic Technology; Rosato — Plastics Processing Data Handbook',
      },
      {
        id: 'weld-lines', name: 'Weld Lines / Knit Lines', severity: 'moderate',
        description: 'Visible lines on the part surface where two melt fronts have met and fused — often weak points and cosmetic defects simultaneously.',
        causes: [
          'Two flow fronts meeting after flowing around a hole, insert, or from multiple gates',
          'Low melt temperature at the meeting point — poor polymer chain entanglement across weld',
          'Low injection speed — fronts arrive cold, reducing fusion quality',
          'Low holding pressure — insufficient pressure to force re-fusion of the weld plane',
          'Material with poor weld strength (glass-filled grades are most susceptible)',
        ],
        fixes: [
          { parameter: 'Melt Temperature', action: 'Increase by 5–10°C', detail: 'Higher melt temperature at weld point means hotter fronts that fuse more effectively. More chain entanglement across the weld plane = higher weld strength.' },
          { parameter: 'Injection Speed', action: 'Increase fill speed', detail: 'Faster fill means fronts arrive hotter. Weld strength is directly correlated with temperature at meeting point.' },
          { parameter: 'Mould Temperature', action: 'Increase by 5–10°C', detail: 'Hotter mould slows surface solidification, giving chains more time to entangle across the weld.' },
          { parameter: 'Venting at Weld', action: 'Add vent at weld line location', detail: 'A gas trap at the weld location compresses ahead of the meeting fronts, reducing temperature and pressure — venting removes this.' },
          { parameter: 'Gate Relocation', action: 'Move gate(s) to reposition weld line', detail: 'Reposition weld line away from high-stress or cosmetically critical areas using Moldflow simulation to predict new weld position.' },
        ],
        preventionTip: 'Weld lines cannot be eliminated when flow must divide — design strategy is to position them in low-stress, non-visible areas. Avoid glass-filled materials where weld line strength is critical.',
        source: 'Rosato — Plastics Processing Data Handbook; Osswald — Plastics Engineering',
      },
    ],
  },
  extrusion: {
    label: 'Extrusion', icon: '🔧',
    defects: [
      {
        id: 'melt-fracture', name: 'Melt Fracture / Sharkskin', severity: 'critical',
        description: 'Irregular, rough surface on the extrudate — ranges from a fine matte texture (sharkskin) to severe periodic distortion (gross melt fracture).',
        causes: [
          'Shear stress at die lip exceeds critical value for the material',
          'Die temperature too low — high viscosity increases wall shear stress',
          'Draw ratio too high — extrudate stretched too quickly after die',
          'Sharp die entry angle — promotes flow instability at die entrance',
          'Material at edge of its processability window',
        ],
        fixes: [
          { parameter: 'Die Temperature', action: 'Increase by 5–15°C', detail: 'Higher die temperature reduces melt viscosity, lowering wall shear stress below critical threshold for melt fracture onset.' },
          { parameter: 'Output Rate', action: 'Reduce screw speed by 5–10 RPM', detail: 'Lower output reduces throughput shear rate. Trade-off: lower productivity. Balance against quality requirement.' },
          { parameter: 'Die Land Length', action: 'Increase die land length', detail: 'Longer die land allows stress relaxation before exit. Minimum land length: 10–20x die gap for most resins.' },
          { parameter: 'Processing Aid', action: 'Add fluoropolymer processing aid (0.05–0.1%)', detail: 'Fluoropolymer PPA coats the die wall, reducing effective viscosity at the die surface. Particularly effective for LLDPE and HDPE blown film.' },
          { parameter: 'Die Entry Angle', action: 'Use streamlined (tapered) die entry', detail: 'Streamlined die entry reduces extensional stress at die entry, delaying melt fracture onset to higher shear rates.' },
        ],
        preventionTip: 'For LLDPE and metallocene PE, use low-shear-rate screw designs and fluoropolymer processing aids as standard formulation components.',
        source: 'Rosato — Plastics Processing Data Handbook; EIRI — Handbook of Plastic Materials and Processing',
      },
      {
        id: 'die-swell', name: 'Excessive Die Swell', severity: 'moderate',
        description: 'The extrudate diameter or thickness is significantly larger than the die opening — causes dimensional non-conformance and downstream handling problems.',
        causes: [
          'High elastic component (normal stress) — melt recovers compression in die',
          'Die land too short — insufficient relaxation time before exit',
          'High molecular weight or broad MWD — more elastic memory',
          'Low melt temperature — higher elasticity at lower temperature',
          'High output rate — less relaxation time in die',
        ],
        fixes: [
          { parameter: 'Die Land Length', action: 'Increase land length to reduce swell', detail: 'Longer land allows elastic stress to relax before exit. Guideline: L/D ratio of die land = 10:1 minimum, 20:1 for high-swell materials.' },
          { parameter: 'Melt Temperature', action: 'Increase by 5–10°C', detail: 'Higher temperature reduces elastic component, reducing die swell. Balance against degradation risk.' },
          { parameter: 'Screw Speed', action: 'Reduce screw RPM', detail: 'Lower shear rate reduces elastic component — less die swell at lower output rates.' },
          { parameter: 'Die Gap', action: 'Compensate die gap for expected swell', detail: 'Measure actual swell ratio for your material/conditions, then reduce die gap by that factor to achieve target extrudate dimensions.' },
          { parameter: 'Resin Grade', action: 'Switch to narrower MWD grade', detail: 'Narrower MWD resins have lower elastic component and more predictable die swell. Discuss with resin supplier.' },
        ],
        preventionTip: 'Measure die swell ratio during initial process setup for each material grade, and maintain this data for future die design compensation.',
        source: 'Rosato — Plastics Processing Data Handbook; Brandrup — Polymer Handbook (rheology sections)',
      },
      {
        id: 'surging', name: 'Surging / Output Instability', severity: 'critical',
        description: 'Periodic fluctuation in extrudate output — visible as alternating thick and thin sections, causing dimensional variation along the extrudate length.',
        causes: [
          'Screw speed instability — drive motor or controller issue',
          'Feed zone problems — material bridging in hopper or inconsistent feed',
          'Screw design mismatch — incorrect compression ratio for the material',
          'Melt temperature fluctuation — barrel heater zone cycling causing viscosity changes',
          'Partially melted material reaching metering zone — incomplete plastication',
        ],
        fixes: [
          { parameter: 'Barrel Temperature Profile', action: 'Stabilize barrel temperature zones; check heater bands and thermocouples', detail: 'Replace faulty heater bands. Ensure thermocouple is seated correctly. Temperature variation more than 2C indicates control problem.' },
          { parameter: 'Back Pressure', action: 'Increase back pressure', detail: 'Higher back pressure improves mixing and melting uniformity, reducing unmelted material reaching the metering zone. Start at 50–100 bar.' },
          { parameter: 'Feed Zone Cooling', action: 'Check feed zone cooling water — ensure barrel is not too hot at feed', detail: 'Feed zone should be cooler (30–60C) to allow solid pellets to be gripped by screw. If feed zone overheats, pellets melt and slide — causing surging.' },
          { parameter: 'Screw Speed', action: 'Reduce screw speed', detail: 'Lower screw speed gives material more residence time to melt completely before the metering zone.' },
          { parameter: 'Hopper', action: 'Check for bridging — agitate or use vibrator', detail: 'Material bridging in hopper causes intermittent starvation of the screw. Ensure material flows freely and hopper geometry prevents arching.' },
        ],
        preventionTip: 'Maintain a process parameter log. Surging that develops gradually often indicates a worn screw or barrel — measure flight clearance if surging appears after extended running.',
        source: 'Rosato — Plastics Processing Data Handbook; Allen & Baker — Handbook of Plastic Technology',
      },
      {
        id: 'fish-eyes', name: 'Fish Eyes / Gels', severity: 'moderate',
        description: 'Small transparent or opaque lumps or specks visible in extruded film or sheet — undispersed polymer, contamination, or crosslinked material.',
        causes: [
          'Incompletely melted polymer — undispersed resin particles from the feed',
          'Crosslinked material (gels) from degradation — high molecular weight fragments that do not melt',
          'Contamination — incompatible polymer or foreign material in the feed',
          'Poorly dispersed additive or filler — masterbatch not properly let down',
          'Recycle contamination — incompatible polymer in regrind stream',
        ],
        fixes: [
          { parameter: 'Melt Temperature', action: 'Increase barrel temperature by 5–10°C', detail: 'Ensures complete melting of high-MW particles. Check all barrel zones — cold spots cause localised incomplete melting.' },
          { parameter: 'Screen Pack', action: 'Replace with finer screen (100 mesh to 200 mesh)', detail: 'Finer breaker plate screen catches larger gel particles. Monitor pressure differential — if pressure builds rapidly, gels are present in significant quantity.' },
          { parameter: 'Purging', action: 'Full barrel purge with purging compound', detail: 'Degraded/crosslinked material accumulates in stagnation zones (adapter, die body). Purge with commercial purging compound or LDPE at high temperature.' },
          { parameter: 'Raw Material', action: 'Check incoming material — run gel count test', detail: 'Test incoming resin by extruding film and counting gels per m2 (industry standard: less than 100 gels per m2 for premium film grades).' },
          { parameter: 'Regrind', action: 'Reduce regrind percentage or segregate', detail: 'Regrind can introduce degraded material. Reduce regrind to less than 10% and ensure it is from the same material family.' },
        ],
        preventionTip: 'Implement incoming MFI testing for all resin batches. Establish a maximum acceptable gel count specification before production and test each new batch.',
        source: 'Rosato — Plastics Processing Data Handbook; EIRI — Handbook of Plastic Materials and Processing',
      },
    ],
  },
  blow: {
    label: 'Blow Moulding', icon: '💨',
    defects: [
      {
        id: 'parison-sag', name: 'Parison Sag / Drawdown', severity: 'critical',
        description: 'The extruded parison (tube) elongates under its own weight before the mould closes, causing non-uniform wall thickness — thinner at the bottom, thicker at the top.',
        causes: [
          'Parison extrusion too slow — parison hangs too long before mould closure',
          'Melt temperature too high — low melt strength, parison sags quickly',
          'High-MFI resin — low melt strength materials sag more',
          'Parison length too long for the melt strength of the material',
          'Accumulator head timing — material held too long in accumulator at high temperature',
        ],
        fixes: [
          { parameter: 'Parison Extrusion Speed', action: 'Increase extrusion speed', detail: 'Faster extrusion reduces hang time before mould closure. Shorter hang time = less sag. Balance against parison surface quality.' },
          { parameter: 'Melt Temperature', action: 'Reduce by 5–10°C', detail: 'Lower temperature increases melt viscosity and melt strength, resisting gravitational sag.' },
          { parameter: 'Parison Programming', action: 'Apply parison thickness profile — thicker at bottom', detail: 'Use die gap programming (parison controller) to extrude progressively thicker parison at the bottom of the stroke, compensating for sag-induced thinning.' },
          { parameter: 'Resin Grade', action: 'Switch to higher-HLMI or bimodal HDPE grade', detail: 'Bimodal HDPE resins have better melt strength at equivalent MFI vs monomodal grades. Consult resin supplier for blow moulding specific grades.' },
          { parameter: 'Mould Close Time', action: 'Reduce time between extrusion and mould closure', detail: 'Audit cycle time. Every 0.1 second saved in machine movement reduces sag. Optimize hydraulic speeds on mould close sequence.' },
        ],
        preventionTip: 'For large containers (more than 5L), always use parison programming (die gap profiling). Select resins with HLMI/MFI ratio more than 20 for good melt strength in large part blow moulding.',
        source: 'Allen & Baker — Handbook of Plastic Technology; Rosato — Plastics Processing Data Handbook',
      },
      {
        id: 'poor-pinch', name: 'Poor Pinch-Off / Flash', severity: 'moderate',
        description: 'Weak or incomplete pinch-off at the mould parting line causes thin flash, incomplete tail pinch, or poor sealing at the bottom of bottles and containers.',
        causes: [
          'Pinch-off blade too wide or worn — insufficient compression of parison at pinch',
          'Mould clamping force insufficient for the blow pressure and parison diameter',
          'Parison temperature too low at pinch zone — cold parison resists compression',
          'Pinch knife geometry incorrect for the resin',
          'Contamination on pinch knife surface',
        ],
        fixes: [
          { parameter: 'Pinch Knife', action: 'Inspect knife edge — sharpen or replace if worn', detail: 'Pinch knife should have radius 0.1–0.5mm depending on material. HDPE needs sharper pinch than LDPE. Replace when flash tail shows ragged or unsupported edges.' },
          { parameter: 'Clamping Force', action: 'Increase clamp tonnage if adjustable', detail: 'Clamp force must overcome blow pressure acting on projected area plus parison compression force. Verify against machine specification.' },
          { parameter: 'Parison Temperature', action: 'Increase die temperature by 5–10°C', detail: 'Hotter parison at pinch zone is more deformable — compresses and fuses more cleanly.' },
          { parameter: 'Mould Alignment', action: 'Check mould halves for alignment and parallelism', detail: 'Misaligned moulds cause uneven pinch — one side over-pinches while the other under-pinches. Check with feeler gauge at four corners.' },
          { parameter: 'Blow Timing', action: 'Delay blow start until mould fully closed', detail: 'Premature blowing before full mould closure prevents proper pinch. Check mould closed confirmation signal before blow valve opens.' },
        ],
        preventionTip: 'Inspect pinch knife condition every 100,000 cycles for HDPE and every 50,000 cycles for glass-filled or abrasive materials. Keep spare pinch inserts in stock.',
        source: 'Allen & Baker — Handbook of Plastic Technology; Rosato — Plastics Processing Data Handbook',
      },
    ],
  },
}

const SEV: Record<Severity, { badge: string; label: string }> = {
  critical: { badge: 'bg-red-50 text-red-700 border-red-200', label: 'Critical' },
  moderate: { badge: 'bg-amber-light text-amber border-amber-border', label: 'Moderate' },
  minor: { badge: 'bg-sage-light text-sage border-sage/20', label: 'Minor' },
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function TroubleshooterPage() {
  const [process, setProcess] = useState<Process | null>(null)
  const [defect, setDefect] = useState<Defect | null>(null)
  const [expandedFix, setExpandedFix] = useState<number | null>(null)

  const reset = () => { setProcess(null); setDefect(null); setExpandedFix(null) }
  const processKeys: Process[] = ['injection', 'extrusion', 'blow']

  return (
    <div className="min-h-screen bg-background">



      {/* ── Hero ── */}
      <div className="bg-background-card border-b border-border px-6 md:px-10 py-10 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-sage-light rounded-full px-4 py-1.5 mb-5">
            <Wrench className="w-3.5 h-3.5 text-sage" />
            <span className="font-mono text-[10px] text-sage tracking-widest uppercase">Defect Troubleshooter</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-ink mb-3 leading-tight">
            Diagnose and fix plastic processing defects
          </h1>
          <p className="text-ink-muted max-w-xl leading-relaxed mb-2">
            Select your process, then select the defect. Get specific corrective actions drawn from Rosato&apos;s Data Handbook and Allen &amp; Baker&apos;s Handbook of Plastic Technology.
          </p>
          <p className="font-mono text-[11px] text-ink-muted">Sources: D.V. Rosato · Allen &amp; Baker · Osswald</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Step 1: Select process ── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-[11px] text-ink-muted uppercase tracking-widest">Step 1 — Select process</h2>
            {process && (
              <button onClick={reset} className="font-mono text-[10px] text-ink-muted hover:text-sage flex items-center gap-1 transition-colors">
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {processKeys.map((p) => {
              const d = DATA[p]
              const sel = process === p
              return (
                <button
                  key={p}
                  onClick={() => { setProcess(p); setDefect(null); setExpandedFix(null) }}
                  className={`text-left rounded-2xl border p-5 transition-all ${sel ? 'border-sage bg-sage-light' : 'border-border bg-background-card hover:border-sage hover:-translate-y-0.5'}`}
                >
                  <div className="text-2xl mb-2">{d.icon}</div>
                  <div className={`font-semibold text-sm ${sel ? 'text-sage' : 'text-ink'}`}>{d.label}</div>
                  <div className="font-mono text-[10px] text-ink-muted mt-1">{d.defects.length} defects mapped</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Step 2: Select defect ── */}
        {process && (
          <div className="mb-8">
            <h2 className="font-mono text-[11px] text-ink-muted uppercase tracking-widest mb-4">Step 2 — Select defect</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DATA[process].defects.map((d) => {
                const sel = defect?.id === d.id
                const sev = SEV[d.severity]
                return (
                  <button
                    key={d.id}
                    onClick={() => { setDefect(d); setExpandedFix(null) }}
                    className={`text-left rounded-2xl border p-4 transition-all ${sel ? 'border-sage bg-sage-light' : 'border-border bg-background-card hover:border-sage hover:-translate-y-0.5'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold text-sm ${sel ? 'text-sage' : 'text-ink'}`}>{d.name}</h3>
                      <span className={`font-mono text-[9px] px-2 py-0.5 rounded border ${sev.badge}`}>{sev.label}</span>
                    </div>
                    <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">{d.description}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Step 3: Results ── */}
        {defect && (
          <div className="space-y-6">
            <div className="border-t border-border pt-6">
              <h2 className="font-mono text-[11px] text-ink-muted uppercase tracking-widest mb-5">Step 3 — Corrective actions</h2>

              <div className="bg-background-card rounded-2xl border border-border p-5 mb-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-serif font-semibold text-lg text-ink">{defect.name}</h3>
                  <span className={`font-mono text-[9px] px-2.5 py-1 rounded border flex-shrink-0 ${SEV[defect.severity].badge}`}>{SEV[defect.severity].label}</span>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed mb-4">{defect.description}</p>
                <p className="font-mono text-[10px] text-ink-muted uppercase tracking-wider mb-2">Root Causes</p>
                <div className="space-y-1.5">
                  {defect.causes.map((c, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-ink leading-relaxed">{c}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <p className="font-mono text-[10px] text-sage uppercase tracking-wider">Corrective Actions (try in order)</p>
                {defect.fixes.map((fix, i) => {
                  const exp = expandedFix === i
                  return (
                    <button
                      key={i}
                      onClick={() => setExpandedFix(exp ? null : i)}
                      className="w-full text-left bg-background-card rounded-2xl border border-border hover:border-sage transition-all overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-sage text-white flex items-center justify-center flex-shrink-0 font-mono text-xs font-semibold">{i + 1}</div>
                          <div className="min-w-0">
                            <div className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">{fix.parameter}</div>
                            <div className="font-medium text-sm text-ink">{fix.action}</div>
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-ink-muted flex-shrink-0 transition-transform ${exp ? 'rotate-180' : ''}`} />
                      </div>
                      {exp && (
                        <div className="px-4 pb-4 border-t border-border pt-3">
                          <p className="text-sm text-ink leading-relaxed">{fix.detail}</p>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="bg-sage-light rounded-2xl p-5 border border-sage/20 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-sage" />
                  <p className="font-mono text-[10px] text-sage uppercase tracking-wider">Prevention Tip</p>
                </div>
                <p className="text-sm text-ink leading-relaxed">{defect.preventionTip}</p>
              </div>

              <p className="font-mono text-[10px] text-ink-muted">Source: {defect.source}</p>
            </div>
          </div>
        )}

        {!process && (
          <div className="text-center py-16 text-ink-muted">
            <Wrench className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="font-mono text-sm">Select a process above to start diagnosing</p>
          </div>
        )}
      </div>

      {/* ── Footer CTA ── */}
      <div className="bg-background-card border-t border-border px-6 py-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-sage" />
              <span className="font-mono text-[10px] text-sage uppercase tracking-widest">Learn the theory behind the fix</span>
            </div>
            <p className="font-serif text-lg font-medium text-ink">Understanding why defects happen makes you faster at fixing them</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/subjects/polymer-processing" className="inline-flex items-center gap-2 bg-sage hover:bg-sage-hover text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
              Polymer Processing <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/ai-tutor" className="inline-flex items-center gap-2 bg-background border border-border text-ink font-semibold text-sm px-5 py-2.5 rounded-xl hover:border-sage transition-colors">
              Ask AI Tutor
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
