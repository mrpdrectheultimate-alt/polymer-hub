import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  FlaskConical, 
  Settings, 
  Layers, 
  TestTube, 
  Circle, 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Database,
  User, 
  LogOut, 
  CheckCircle2, 
  Clock,
  Recycle,
  Leaf,
  Microscope,
  Rocket,
  type LucideIcon
} from 'lucide-react'

// Map slug to icon component
const iconMap: Record<string, LucideIcon> = {
  'polymer-chemistry': FlaskConical,
  'polymer-processing': Settings,
  'mould-design': Layers,
  'polymer-testing': TestTube,
  'rubber-technology': Circle,
  'recycling-technology': Recycle,
  'sustainable-plastics': Leaf,
  'polymer-composites': Microscope,
  'entrepreneurship-plastics': Rocket,
}

// Map slug to color scheme
const colorMap: { [key: string]: { color: string; bg: string; border: string; text: string } } = {
  'polymer-chemistry': { color: '#0F4C81', bg: 'bg-[#EEF4FF]', border: 'border-blue-100', text: 'text-blue-700' },
  'polymer-processing': { color: '#0891B2', bg: 'bg-cyan-50', border: 'border-cyan-100', text: 'text-cyan-700' },
  'mould-design': { color: '#7C3AED', bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-700' },
  'polymer-testing': { color: '#16A34A', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' },
  'rubber-technology': { color: '#D97706', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' },
  'recycling-technology': { color: '#2D6A4F', bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700' },
  'sustainable-plastics': { color: '#16A34A', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' },
  'polymer-composites': { color: '#1E5A6B', bg: 'bg-teal-50', border: 'border-teal-100', text: 'text-teal-700' },
  'entrepreneurship-plastics': { color: '#D97706', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' },
}

export default async function DashboardPage() {
  const supabase = createClient()
  
  // Get active session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch or create profile
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name || 'PPE Student',
        subscription_status: 'free',
        queries_used: 0,
        queries_reset_at: new Date().toISOString(),
      })
      .select()
      .single()
    if (newProfile) profile = newProfile
  }

  // Fetch subjects with lessons count
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*, lessons(id, title, is_premium)')
    .order('order_index')

  // Calculate totals
  const totalLessons = subjects?.reduce((acc: number, s: { lessons: unknown[] | null }) => acc + (s.lessons?.length || 0), 0) || 0
  const isPremium = profile?.subscription_status === 'premium'
  const queriesUsed = profile?.queries_used || 0
  const maxQueries = 5

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Dashboard Nav */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#0F4C81] rounded-lg flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">PolymerHub</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-slate-700">
                {profile?.full_name}
              </span>
            </div>

            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-r from-[#0F4C81] to-[#1565A8] rounded-3xl p-6 md:p-8 text-white overflow-hidden shadow-lg shadow-blue-900/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full opacity-[0.2] -translate-y-10 translate-x-10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F97316] rounded-full opacity-[0.05] translate-y-12 -translate-x-12" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs text-blue-100 font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                B.Tech PPE Student Portal
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Namaste, {profile?.full_name?.split(' ')[0]}!
              </h1>
              <p className="text-blue-100 text-sm mt-2 max-w-xl">
                Ready to study today? You have full access to core study guides. Explore our materials table or start your lessons below.
              </p>
            </div>

            {/* Status Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 min-w-[240px]">
              <div className="text-xs text-blue-200 font-medium">Subscription Level</div>
              <div className="flex items-center justify-between mt-1 mb-4">
                <span className="text-xl font-bold tracking-tight">
                  {isPremium ? 'Premium Plan' : 'Free Account'}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isPremium ? 'bg-orange-500 text-white' : 'bg-white/20 text-blue-100'}`}>
                  {isPremium ? 'PRO' : 'Basic'}
                </span>
              </div>
              {!isPremium && (
                <Link
                  href="/pricing"
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-[#F97316] hover:bg-[#EA6C0A] text-white text-xs font-bold py-2 rounded-xl transition-all shadow-md shadow-orange-950/10"
                >
                  Upgrade for ₹99/mo <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
              {isPremium && (
                <div className="flex items-center gap-1 text-xs text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Premium active
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left / Core Subjects Grid (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Your Core PPE Subjects</h2>
              <span className="text-xs text-slate-400 font-medium">{totalLessons} lessons total</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects?.map((subject: { id: string | number; slug: string; name: string; description?: string; lessons: unknown[] | null }) => {
                const Icon = iconMap[subject.slug] || FlaskConical
                const theme = colorMap[subject.slug] || { bg: 'bg-slate-50', border: 'border-slate-100', text: 'text-slate-600', color: '#64748b' }
                
                return (
                  <div 
                    key={subject.id} 
                    className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Icon & Title Row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${theme.bg}`}>
                          <Icon className="w-4.5 h-4.5" style={{ color: theme.color }} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {subject.lessons?.length || 0} Lessons
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1.5">{subject.name}</h3>
                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
                        {subject.description}
                      </p>
                    </div>

                    <Link
                      href={`/subjects/${subject.slug}`}
                      className="inline-flex items-center justify-between text-xs font-semibold text-[#0F4C81] hover:text-[#0A3560] border-t border-slate-50 pt-3 mt-2 group"
                    >
                      Browse Lessons
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Sidebar: AI Tutor & Quick Links (1/3 width) */}
          <div className="space-y-6">
            
            {/* AI Tutor Panel */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-[#F97316]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">AI Tutor Tracker</h3>
                  <p className="text-[10px] text-slate-400">Contextual homework assistant</p>
                </div>
              </div>

              {/* Progress bar for free queries */}
              <div className="space-y-2 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>Daily AI Queries Used</span>
                  <span>
                    {isPremium ? 'Unlimited' : `${queriesUsed} / ${maxQueries}`}
                  </span>
                </div>
                
                {!isPremium && (
                  <>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#F97316] h-full rounded-full transition-all"
                        style={{ width: `${Math.min((queriesUsed / maxQueries) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Free users get 5 AI tutor queries per day. Daily limits reset at midnight.
                    </p>
                  </>
                )}
                {isPremium && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Unlimited Premium access active
                  </div>
                )}
              </div>

              <Link
                href="/ai-tutor"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0F4C81] hover:bg-[#0A3560] text-white text-xs font-semibold py-2.5 rounded-xl transition-all shadow-sm"
              >
                <Brain className="w-3.5 h-3.5" />
                Ask AI Tutor now
              </Link>
            </div>

            {/* Quick Links List */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Reference Database</h3>
              
              <Link 
                href="/materials" 
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-slate-400 group-hover:text-[#0F4C81]" />
                  <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-800">Materials Database</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0F4C81] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link 
                href="/pricing" 
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-[#F97316]" />
                  <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-800">Billing & Upgrade</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#F97316] group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>

            {/* Quick Tips Box */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-800">
                <Clock className="w-4.5 h-4.5" />
                <span className="text-xs font-bold">Exam Checklist</span>
              </div>
              <p className="text-[11px] text-amber-700/80 leading-relaxed">
                CIPET and B.Tech PPE mid-term exams focus heavily on **Melt Flow Index (ASTM D1238)** and **Sulphur Vulcanization Curves**. Make sure you review subjects 4 and 5 in detail.
              </p>
            </div>
            
          </div>
        </div>

      </main>
    </div>
  )
}
