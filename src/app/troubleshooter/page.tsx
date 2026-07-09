'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle, ChevronDown, RotateCcw, Wrench, Sparkles, BookOpen, Brain } from 'lucide-react'

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
  critical: { badge: 'bg-rose-500 text-white border-2 border-ink font-bold', label: 'CRITICAL' },
  moderate: { badge: 'bg-orange text-white border-2 border-ink font-bold', label: 'MODERATE' },
  minor: { badge: 'bg-yellow-bright text-ink border-2 border-ink font-bold', label: 'MINOR' },
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function TroubleshooterPage() {
  const [process, setProcess] = useState<Process | null>(null)
  const [defect, setDefect] = useState<Defect | null>(null)
  const [expandedFix, setExpandedFix] = useState<number | null>(null)

  const reset = () => { setProcess(null); setDefect(null); setExpandedFix(null) }
  const processKeys: Process[] = ['injection', 'extrusion', 'blow']

  return (
    <div className="min-h-screen bg-canvas pb-16">
      {/* Yellow Hero Band */}
      <section className="border-b-4 border-ink bg-yellow-bright px-6 md:px-12 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-ink border-4 border-ink flex items-center justify-center">
                <Wrench className="w-5 h-5 text-yellow-bright" />
              </div>
              <span className="font-mono text-[10px] font-black text-ink border-2 border-ink px-3 py-1 uppercase tracking-widest bg-white">
                Troubleshooter
              </span>
              <span className="font-mono text-[10px] font-black border-2 border-ink bg-ink text-yellow-bright px-3 py-1 uppercase tracking-widest">
                12 DEFECTS MAPPED
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black text-ink leading-none uppercase">
              DIAGNOSE AND FIX<br />
              <span className="italic">PROCESSING DEFECTS</span>
            </h1>
          </div>
          <div className="max-w-md text-left md:text-right">
            <p className="text-sm font-bold text-ink/70 leading-relaxed">
              Specific corrective actions drawn from Rosato&apos;s Data Handbook and Allen &amp; Baker&apos;s Handbook of Plastic Technology.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Step 1: Select process */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4 border-b-4 border-ink pb-2">
            <h2 className="font-mono text-xs font-black text-ink uppercase tracking-widest">
              Step 1 — Select processing method
            </h2>
            {process && (
              <button
                onClick={reset}
                className="font-mono text-[10px] font-black border-2 border-ink px-2.5 py-1 uppercase bg-canvas hover:bg-ink hover:text-white transition-colors flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                <RotateCcw className="w-3 h-3" /> Reset all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {processKeys.map((p) => {
              const d = DATA[p]
              const sel = process === p
              const accentColor = p === 'injection' ? '#1D4ED8' : p === 'extrusion' ? '#EA580C' : '#7C3AED'

              return (
                <button
                  key={p}
                  onClick={() => {
                    setProcess(p)
                    setDefect(null)
                    setExpandedFix(null)
                  }}
                  className={`text-left border-4 border-ink p-5 transition-all w-full select-none ${
                    sel ? '-translate-y-1' : 'hover:-translate-y-0.5'
                  }`}
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: sel ? `6px 6px 0px 0px ${accentColor}` : `4px 4px 0px 0px #0A0A0A`,
                  }}
                >
                  <div className="text-3xl mb-3">{d.icon}</div>
                  <div className="font-display text-xl font-black text-ink leading-tight">
                    {d.label}
                  </div>
                  <div className="font-mono text-[9px] font-bold text-ink/40 mt-1 uppercase tracking-wider">
                    {d.defects.length} defects mapped
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step 2: Select defect */}
        {process && (
          <div className="mb-10 animate-fadeIn">
            <div className="border-b-4 border-ink pb-2 mb-5">
              <h2 className="font-mono text-xs font-black text-ink uppercase tracking-widest">
                Step 2 — Select the defect symptoms
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {DATA[process].defects.map((d) => {
                const sel = defect?.id === d.id
                const sev = SEV[d.severity]
                const accentColor = process === 'injection' ? '#1D4ED8' : process === 'extrusion' ? '#EA580C' : '#7C3AED'

                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      setDefect(d)
                      setExpandedFix(null)
                    }}
                    className={`text-left border-4 border-ink p-5 transition-all w-full ${
                      sel ? '-translate-y-1' : 'hover:-translate-y-0.5'
                    }`}
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: sel ? `6px 6px 0px 0px ${accentColor}` : `4px 4px 0px 0px #0A0A0A`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display text-lg font-black text-ink leading-tight">
                        {d.name}
                      </h3>
                      <span className={`font-mono text-[8px] uppercase px-2 py-0.5 flex-shrink-0 ${sev.badge}`}>
                        {sev.label}
                      </span>
                    </div>
                    <p className="text-xs text-ink/60 leading-relaxed line-clamp-2">
                      {d.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3: Corrective actions */}
        {defect && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b-4 border-ink pb-2">
              <h2 className="font-mono text-xs font-black text-ink uppercase tracking-widest">
                Step 3 — Engineering diagnostics and fixes
              </h2>
            </div>

            {/* Defect Overview Panel */}
            <div className="border-4 border-ink bg-canvas p-6 shadow-hard" style={{ boxShadow: '5px 5px 0px 0px #0A0A0A' }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="font-mono text-[9px] font-bold text-ink/40 uppercase tracking-widest mb-1">{"// Defect Description"}</div>
                  <h3 className="font-display text-3xl font-black text-ink leading-tight">{defect.name}</h3>
                </div>
                <span className={`font-mono text-[10px] px-3 py-1 flex-shrink-0 ${SEV[defect.severity].badge}`}>
                  {SEV[defect.severity].label} SEVERITY
                </span>
              </div>
              <p className="text-sm text-ink/75 leading-relaxed mb-6 border-l-4 border-ink pl-4 py-1 italic">
                {defect.description}
              </p>

              {/* Causes block */}
              <div className="border-t-2 border-ink/10 pt-5">
                <div className="font-mono text-[10px] font-black text-ink uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-orange" /> Potential Root Causes
                </div>
                <div className="space-y-3">
                  {defect.causes.map((c, i) => (
                    <div key={i} className="flex items-start gap-3 bg-amber-50/50 border-2 border-ink p-3 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="w-5 h-5 bg-ink text-yellow-bright flex items-center justify-center font-mono text-[10px] font-black flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm text-ink font-bold leading-relaxed">{c}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Corrective Actions Accordion */}
            <div className="space-y-3">
              <div className="font-mono text-[10px] font-black text-ink uppercase tracking-wider mb-3 flex items-center gap-1.5">
                🔧 Corrective Actions (Try in Order)
              </div>

              <div className="space-y-4">
                {defect.fixes.map((fix, i) => {
                  const exp = expandedFix === i
                  const accentColor = process === 'injection' ? '#1D4ED8' : process === 'extrusion' ? '#EA580C' : '#7C3AED'
                  return (
                    <div
                      key={i}
                      className="border-4 border-ink bg-canvas transition-all overflow-hidden w-full block"
                      style={{
                        boxShadow: exp ? `4px 4px 0px 0px ${accentColor}` : `3px 3px 0px 0px #0A0A0A`
                      }}
                    >
                      <button
                        onClick={() => setExpandedFix(exp ? null : i)}
                        className="w-full text-left flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-8 h-8 bg-ink text-white flex items-center justify-center flex-shrink-0 font-mono text-sm font-black border-2 border-ink shadow-[2px_2px_0px_0px_rgba(254,240,138,1)]">
                            {i + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="font-mono text-[9px] font-black text-ink/40 uppercase tracking-widest">
                              {fix.parameter}
                            </div>
                            <div className="font-display text-lg font-black text-ink leading-tight">
                              {fix.action}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-ink flex-shrink-0 transition-transform duration-200 ${exp ? 'rotate-180' : ''}`} />
                      </button>

                      {exp && (
                        <div className="px-5 pb-5 pt-3 border-t-2 border-ink bg-slate-50/50 animate-fadeIn">
                          <div className="font-mono text-[9px] font-bold text-ink/40 uppercase tracking-widest mb-1.5">{"// Standard Operating Procedure"}</div>
                          <p className="text-sm text-ink/80 leading-relaxed font-bold">
                            {fix.detail}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Prevention Banner */}
            <div className="border-4 border-ink p-6 shadow-hard" style={{ backgroundColor: '#F0FDF4', boxShadow: '4px 4px 0px 0px #15803D' }}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <p className="font-mono text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                  Industrial Prevention Strategy
                </p>
              </div>
              <p className="text-sm text-emerald-950 font-bold leading-relaxed">
                {defect.preventionTip}
              </p>
            </div>

            {/* Source credit */}
            <div className="font-mono text-[9px] text-ink/40 text-right uppercase tracking-wider">
              Recommended Literature: {defect.source}
            </div>
          </div>
        )}

        {!process && (
          <div className="border-4 border-ink p-12 text-center shadow-hard bg-white">
            <Wrench className="w-10 h-10 mx-auto mb-4 text-ink/40" />
            <div className="font-display text-2xl font-black text-ink mb-2">Diagnostic Engine Offline</div>
            <p className="text-ink/60 max-w-sm mx-auto font-mono text-xs">
              Select a polymer manufacturing method above to load the corresponding defects and operation parameters.
            </p>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <section className="border-t-4 border-ink bg-yellow-bright px-6 md:px-12 py-10 mt-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-ink" />
              <span className="font-mono text-[10px] font-black text-ink uppercase tracking-widest">
                Learn the theory behind the fix
              </span>
            </div>
            <p className="font-display text-2xl font-black text-ink leading-tight">
              Understanding why defects happen makes you a faster field engineer.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-shrink-0">
            <Link
              href="/subjects/polymer-processing"
              className="cn-btn-black text-center text-xs py-3 px-5 flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" /> Study Processing Lessons
            </Link>
            <Link
              href="/ai-tutor"
              className="cn-btn bg-white text-ink text-center text-xs py-3 px-5 flex items-center justify-center gap-1.5"
            >
              <Brain className="w-4 h-4" /> Ask AI Tutor
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
