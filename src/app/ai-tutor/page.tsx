import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Brain } from 'lucide-react'
import AiTutorClient from '@/components/AiTutorClient'

export default async function AiTutorPage() {
  const supabase = createClient()

  // 1. Get active session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Load user profile
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Self-heal profile if missing
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

  const isPremium = profile?.subscription_status === 'premium'
  const queriesUsed = profile?.queries_used || 0
  const userFullName = profile?.full_name || 'PPE Student'

  return (
    <div className="min-h-screen bg-slate-50/50">

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight flex items-center gap-3">
            <Brain className="w-8 h-8 text-[#0F4C81]" />
            AI Tutor Workspace
          </h1>
          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            Your personal polymer engineering study buddy. Ask general questions or test yourself on chemical reactions, molecular architectures, injection moulding cycle times, and curing kinetics.
          </p>
        </div>

        {/* Interactive Chat client */}
        <AiTutorClient 
          initialQueriesUsed={queriesUsed} 
          isPremium={isPremium} 
          userFullName={userFullName} 
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8 text-center text-xs text-slate-400 mt-12">
        <p>© 2026 PolymerHub. All AI tutor answers are grounded in standard course curriculum notes.</p>
      </footer>
    </div>
  )
}
