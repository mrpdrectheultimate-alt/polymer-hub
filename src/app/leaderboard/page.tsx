'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Trophy, Flame, Award, History, ArrowLeft, Shield, User as UserIcon } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Badge {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  color: string
  xp_reward: number
  category: 'learning' | 'quiz' | 'streak' | 'community' | 'special'
  condition: string
}

interface LeaderboardUser {
  id: string
  full_name: string | null
  avatar_url: string | null
  college_name: string | null
  xp_points: number
  current_streak: number
  total_lessons_completed: number
  total_quizzes_passed: number
  badges_earned: number
}

interface XPLogEntry {
  id: string
  action: string
  xp_earned: number
  created_at: string
  reference: string | null
}

const CATEGORY_LABELS: Record<string, string> = {
  learning: 'Learning',
  quiz: 'Assessments',
  streak: 'Streaks',
  community: 'Community',
  special: 'Special Awards',
}

// ─── Fallback mock data if tables are not yet migrated ──────────────────────────

const MOCK_BADGES: Badge[] = [
  { id: '1', slug: 'first_lesson', name: 'First Step', description: 'Completed your first lesson on PolymerHub', icon: '📖', color: '#1D4ED8', xp_reward: 25, category: 'learning', condition: 'Complete 1 lesson' },
  { id: '2', slug: 'five_lessons', name: 'Getting Started', description: 'Completed 5 lessons', icon: '📚', color: '#1D4ED8', xp_reward: 50, category: 'learning', condition: 'Complete 5 lessons' },
  { id: '3', slug: 'chemistry_complete', name: 'Polymer Chemist', description: 'Completed all Polymer Chemistry lessons', icon: '🧪', color: '#1D4ED8', xp_reward: 150, category: 'learning', condition: 'Complete all Chemistry lessons' },
  { id: '4', slug: 'first_quiz', name: 'Quiz Taker', description: 'Passed your first lesson quiz', icon: '✅', color: '#15803D', xp_reward: 25, category: 'quiz', condition: 'Pass 1 quiz' },
  { id: '5', slug: 'perfect_score', name: 'Perfection', description: 'Scored 100% on a lesson quiz', icon: '💯', color: '#CA8A04', xp_reward: 100, category: 'quiz', condition: 'Score 100% on any quiz' },
  { id: '6', slug: 'streak_3', name: '3-Day Streak', description: 'Studied 3 days in a row', icon: '🔥', color: '#EA580C', xp_reward: 30, category: 'streak', condition: '3 consecutive study days' },
  { id: '7', slug: 'streak_7', name: 'Week Warrior', description: 'Studied 7 days in a row', icon: '🔥', color: '#EA580C', xp_reward: 75, category: 'streak', condition: '7 consecutive study days' },
  { id: '8', slug: 'first_question', name: 'Curious Mind', description: 'Asked your first forum question', icon: '❓', color: '#7C3AED', xp_reward: 20, category: 'community', condition: 'Post 1 forum question' },
  { id: '9', slug: 'premium_member', name: 'Premium Scholar', description: 'Upgraded to PolymerHub Premium', icon: '⭐', color: '#CA8A04', xp_reward: 50, category: 'special', condition: 'Purchase premium subscription' },
]

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { id: 'u1', full_name: 'Ananya Sharma', avatar_url: null, college_name: 'IIT Kharagpur', xp_points: 1250, current_streak: 12, total_lessons_completed: 28, total_quizzes_passed: 18, badges_earned: 9 },
  { id: 'u2', full_name: 'Rahul Verma', avatar_url: null, college_name: 'MIT Pune', xp_points: 980, current_streak: 8, total_lessons_completed: 20, total_quizzes_passed: 14, badges_earned: 6 },
  { id: 'u3', full_name: 'Priya Patel', avatar_url: null, college_name: 'CIPET Chennai', xp_points: 840, current_streak: 5, total_lessons_completed: 18, total_quizzes_passed: 10, badges_earned: 5 },
  { id: 'u4', full_name: 'Amit Patel', avatar_url: null, college_name: 'HBTI Kanpur', xp_points: 710, current_streak: 4, total_lessons_completed: 15, total_quizzes_passed: 8, badges_earned: 4 },
  { id: 'u5', full_name: 'Divya Nair', avatar_url: null, college_name: 'ICT Mumbai', xp_points: 620, current_streak: 3, total_lessons_completed: 12, total_quizzes_passed: 6, badges_earned: 3 },
]

const MOCK_LOGS: XPLogEntry[] = [
  { id: 'log1', action: 'quiz_pass', xp_earned: 30, created_at: new Date(Date.now() - 3600000).toISOString(), reference: 'injection-moulding' },
  { id: 'log2', action: 'lesson_complete', xp_earned: 25, created_at: new Date(Date.now() - 7200000).toISOString(), reference: 'polymerization-mechanisms' },
  { id: 'log3', action: 'streak_day', xp_earned: 10, created_at: new Date(Date.now() - 86400000).toISOString(), reference: null },
]

export default function LeaderboardPage() {
  const supabase = createClient()

  // User states
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string } | null>(null)
  const [userProfile, setUserProfile] = useState<{
    xp_points: number
    current_streak: number
    longest_streak: number
    total_lessons_completed: number
    total_quizzes_passed: number
  } | null>(null)

  // DB States
  const [badges, setBadges] = useState<Badge[]>([])
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<Set<string>>(new Set())
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [xpLogs, setXpLogs] = useState<XPLogEntry[]>([])
  
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'badges' | 'history'>('leaderboard')
  const [badgeCategory, setBadgeCategory] = useState<'all' | 'learning' | 'quiz' | 'streak' | 'community' | 'special'>('all')

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setCurrentUser({ id: user.id, email: user.email ?? '' })
          
          // Load user profile stats
          const { data: profile } = await supabase
            .from('profiles')
            .select('xp_points, current_streak, longest_streak, total_lessons_completed, total_quizzes_passed')
            .eq('id', user.id)
            .single()

          if (profile) {
            setUserProfile({
              xp_points: profile.xp_points ?? 0,
              current_streak: profile.current_streak ?? 0,
              longest_streak: profile.longest_streak ?? 0,
              total_lessons_completed: profile.total_lessons_completed ?? 0,
              total_quizzes_passed: profile.total_quizzes_passed ?? 0,
            })
          }
        }

        // 1. Fetch Badges
        const { data: dbBadges } = await supabase
          .from('badges')
          .select('*')
          .order('xp_reward', { ascending: true })

        if (dbBadges && dbBadges.length > 0) {
          setBadges(dbBadges)
        } else {
          setBadges(MOCK_BADGES)
        }

        // 2. Fetch User Earned Badges
        if (user) {
          const { data: dbEarned } = await supabase
            .from('user_badges')
            .select('badge_id')
            .eq('user_id', user.id)

          if (dbEarned) {
            setEarnedBadgeIds(new Set(dbEarned.map(b => b.badge_id)))
          }
        }

        // 3. Fetch Leaderboard view
        const { data: dbLeaderboard } = await supabase
          .from('leaderboard')
          .select('*')
          .limit(100)

        if (dbLeaderboard && dbLeaderboard.length > 0) {
          setLeaderboard(dbLeaderboard)
        } else {
          setLeaderboard(MOCK_LEADERBOARD)
        }

        // 4. Fetch XP Activity logs
        if (user) {
          const { data: dbLogs } = await supabase
            .from('xp_log')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(30)

          if (dbLogs && dbLogs.length > 0) {
            setXpLogs(dbLogs)
          } else {
            setXpLogs(MOCK_LOGS)
          }
        }

      } catch (err) {
        console.error('Gamification loading failed, falling back to mock data:', err)
        setBadges(MOCK_BADGES)
        setLeaderboard(MOCK_LEADERBOARD)
        setXpLogs(MOCK_LOGS)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase])

  // Filters badges
  const filteredBadges = badges.filter(b => badgeCategory === 'all' || b.category === badgeCategory)

  // XP Progress calculate (next rank threshold)
  const xp = userProfile?.xp_points ?? 120
  const currentRank = xp < 100 ? 'Novice' :
                      xp < 300 ? 'Apprentice' :
                      xp < 700 ? 'Specialist' :
                      xp < 1500 ? 'Expert' :
                      xp < 3000 ? 'Master' : 'Grandmaster'

  const nextThreshold = xp < 100 ? 100 :
                        xp < 300 ? 300 :
                        xp < 700 ? 700 :
                        xp < 1500 ? 1500 :
                        xp < 3000 ? 3000 : 5000

  const prevThreshold = xp < 100 ? 0 :
                        xp < 300 ? 100 :
                        xp < 700 ? 300 :
                        xp < 1500 ? 700 :
                        xp < 3000 ? 1500 : 3000

  const progressPercent = Math.min(100, Math.round(((xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100))

  return (
    <div className="min-h-screen bg-canvas pb-12">
      {/* Top Banner Accent */}
      <div className="h-2 bg-[#CA8A04]" />

      {/* Header */}
      <div className="border-b-4 border-ink px-6 md:px-10 py-5 flex items-center justify-between flex-wrap gap-4 bg-[#FEFCE8]">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-8 h-8 border-4 border-ink bg-white flex items-center justify-center hover:translate-x-[-2px] transition-transform">
            <ArrowLeft className="w-4 h-4 text-ink" />
          </Link>
          <div>
            <div className="font-mono text-[9px] font-black uppercase tracking-widest text-[#CA8A04]">Gamification Hub</div>
            <h1 className="font-display text-2xl font-black text-ink uppercase leading-none mt-1">
              Leaderboard & Badges
            </h1>
          </div>
        </div>
        
        {currentUser && (
          <div className="flex items-center gap-2 border-4 border-ink bg-white px-3 py-1.5 shadow-hard-sm">
            <Flame className="w-5 h-5 text-orange fill-orange" />
            <span className="font-mono text-xs font-black text-ink">
              {userProfile?.current_streak ?? 0} DAY STREAK
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="font-mono text-sm font-black text-ink/40 animate-pulse uppercase tracking-widest">
            Loading Leaderboard...
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ─── LEFT PANEL: Student Stats (4 cols) ───────────────────────────── */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Profile Rank Card */}
              <div className="border-4 border-ink bg-white p-5 shadow-hard">
                <h2 className="font-display text-lg font-black text-ink uppercase border-b-2 border-ink/5 pb-2 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#CA8A04]" /> Your Rank
                </h2>

                <div className="text-center py-3">
                  <div className="font-display text-3xl font-black text-ink uppercase tracking-tight">{currentRank}</div>
                  <div className="font-mono text-[9px] font-bold text-ink/50 uppercase tracking-widest mt-0.5">Title</div>

                  <div className="font-display text-6xl font-black text-[#CA8A04] mt-4 mb-1">
                    {xp} <span className="text-xl">XP</span>
                  </div>
                  <p className="font-mono text-[9px] text-ink/40 uppercase tracking-wider mb-5">Total points earned</p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[9px] font-bold text-ink/50 uppercase">
                    <span>Rank Progress</span>
                    <span>{xp} / {nextThreshold} XP</span>
                  </div>
                  <div className="w-full border-4 border-ink h-4 bg-canvas overflow-hidden">
                    <div className="h-full bg-[#CA8A04] transition-all" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>

              {/* Stats Summary Card */}
              <div className="border-4 border-ink bg-white p-5 shadow-hard space-y-4">
                <h3 className="font-display text-sm font-black text-ink uppercase border-b-2 border-ink/5 pb-2 mb-1">
                  Platform Progress
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="border-2 border-ink/10 p-3 text-center bg-canvas">
                    <div className="font-display text-2xl font-black text-ink">{userProfile?.total_lessons_completed ?? 0}</div>
                    <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mt-0.5">Lessons read</div>
                  </div>
                  
                  <div className="border-2 border-ink/10 p-3 text-center bg-canvas">
                    <div className="font-display text-2xl font-black text-ink">{userProfile?.total_quizzes_passed ?? 0}</div>
                    <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mt-0.5">Quizzes passed</div>
                  </div>

                  <div className="border-2 border-ink/10 p-3 text-center bg-canvas">
                    <div className="font-display text-2xl font-black text-ink">{earnedBadgeIds.size}</div>
                    <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mt-0.5">Badges earned</div>
                  </div>

                  <div className="border-2 border-ink/10 p-3 text-center bg-canvas">
                    <div className="font-display text-2xl font-black text-ink">{userProfile?.longest_streak ?? 0}d</div>
                    <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider mt-0.5">Longest streak</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── RIGHT PANEL: Tabs & Tables (8 cols) ──────────────────────────── */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Tab Selector */}
              <div className="flex border-4 border-ink bg-white shadow-hard-sm">
                {[
                  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, color: '#CA8A04' },
                  { id: 'badges', label: 'Badges', icon: Award, color: '#1D4ED8' },
                  { id: 'history', label: 'XP Log', icon: History, color: '#15803D' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as 'leaderboard' | 'badges' | 'history')}

                    className="flex-1 font-mono text-[10px] font-black uppercase py-3.5 tracking-wider border-r-4 border-ink last:border-r-0 flex items-center justify-center gap-2 transition-all hover:bg-canvas"
                    style={activeTab === t.id ? { backgroundColor: t.color, color: 'white' } : {}}
                  >
                    <t.icon className="w-4 h-4" /> {t.label}
                  </button>
                ))}
              </div>

              {/* ─── TAB CONTENT: LEADERBOARD ────────────────────────────────────── */}
              {activeTab === 'leaderboard' && (
                <div className="border-4 border-ink bg-white shadow-hard overflow-hidden">
                  <div className="border-b-4 border-ink px-5 py-3.5 bg-ink flex items-center justify-between">
                    <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest">Top Students (India)</span>
                    <span className="font-mono text-[8px] text-white/50 uppercase">Updated live</span>
                  </div>

                  <div className="divide-y-4 divide-ink">
                    {leaderboard.map((item, idx) => {
                      const isSelf = currentUser && item.id === currentUser.id
                      const rank = idx + 1

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 transition-colors"
                          style={isSelf ? { backgroundColor: '#FEFCE8' } : {}}
                        >
                          {/* Rank badge */}
                          <div className="w-7 h-7 border-2 border-ink flex items-center justify-center font-mono text-xs font-black bg-canvas">
                            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                          </div>

                          {/* Avatar */}
                          <div className="w-8 h-8 rounded-full border-2 border-ink bg-gray-100 flex items-center justify-center font-mono font-black text-xs">
                            {item.full_name?.slice(0, 2).toUpperCase() || <UserIcon className="w-4 h-4 text-ink/40" />}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-ink truncate flex items-center gap-1.5">
                              {item.full_name || 'Anonymous Student'}
                              {isSelf && <span className="font-mono text-[7px] bg-[#CA8A04] text-white px-1.5 py-0.5 uppercase font-bold">You</span>}
                            </div>
                            <div className="font-mono text-[9px] text-ink/40 truncate uppercase">{item.college_name || 'PPE Student'}</div>
                          </div>

                          {/* Stats block */}
                          <div className="flex items-center gap-6">
                            <div className="text-center hidden sm:block">
                              <div className="font-mono text-xs font-black text-ink">🔥 {item.current_streak}d</div>
                              <div className="font-mono text-[7px] text-ink/30 uppercase">streak</div>
                            </div>
                            
                            <div className="text-center hidden sm:block">
                              <div className="font-mono text-xs font-black text-ink">🏅 {item.badges_earned}</div>
                              <div className="font-mono text-[7px] text-ink/30 uppercase">badges</div>
                            </div>

                            <div className="text-right">
                              <div className="font-display text-lg font-black text-[#CA8A04]">{item.xp_points}</div>
                              <div className="font-mono text-[7px] text-ink/30 uppercase leading-none">XP</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ─── TAB CONTENT: BADGES ─────────────────────────────────────────── */}
              {activeTab === 'badges' && (
                <div className="space-y-4">
                  {/* Category switcher */}
                  <div className="flex gap-2 flex-wrap border-4 border-ink p-3 bg-white shadow-hard-sm">
                    {(['all', 'learning', 'quiz', 'streak', 'community', 'special'] as const).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setBadgeCategory(cat)}
                        className="font-mono text-[9px] border-2 px-2.5 py-1 uppercase font-bold tracking-wider transition-colors"
                        style={badgeCategory === cat ? { backgroundColor: '#1D4ED8', borderColor: '#1D4ED8', color: 'white' } : { borderColor: '#E5E7EB', color: '#6B7280' }}
                      >
                        {CATEGORY_LABELS[cat] ?? 'All'}
                      </button>
                    ))}
                  </div>

                  {/* Badges Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredBadges.map(badge => {
                      const isEarned = earnedBadgeIds.has(badge.id) || earnedBadgeIds.has(badge.slug) || (badge.slug === 'first_lesson' && (userProfile?.total_lessons_completed ?? 0) >= 1)

                      return (
                        <div
                          key={badge.id}
                          className="border-4 border-ink bg-white p-4 flex gap-4 transition-all relative overflow-hidden"
                          style={{
                            boxShadow: isEarned ? `4px 4px 0px 0px ${badge.color}` : '2px 2px 0px 0px #E5E7EB',
                            opacity: isEarned ? 1 : 0.65
                          }}
                        >
                          {/* Left: icon/emoji */}
                          <div
                            className="w-12 h-12 border-4 border-ink flex items-center justify-center text-2xl flex-shrink-0"
                            style={{ backgroundColor: isEarned ? badge.color + '15' : '#F3F4F6' }}
                          >
                            {badge.icon}
                          </div>

                          {/* Right: info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <h4 className="font-bold text-sm text-ink leading-tight">{badge.name}</h4>
                              <span className="font-mono text-[9px] font-black border-2 px-1.5 py-0.2 uppercase" style={{ borderColor: badge.color, color: badge.color }}>
                                +{badge.xp_reward} XP
                              </span>
                            </div>
                            <p className="text-xs text-ink/60 mt-1 leading-normal pr-1">{badge.description}</p>
                            
                            <div className="mt-3 flex items-center gap-1.5">
                              <span className="font-mono text-[8px] font-bold text-ink/40 uppercase tracking-wide">Condition:</span>
                              <span className="font-mono text-[8px] bg-canvas text-ink/70 px-1.5 py-0.5 border border-ink/10 uppercase">
                                {badge.condition}
                              </span>
                            </div>
                          </div>

                          {/* Lock layer for unearned */}
                          {!isEarned && (
                            <div className="absolute right-2 top-2 w-5 h-5 bg-[#F3F4F6] border border-ink/10 flex items-center justify-center font-mono text-[10px] text-ink/30 select-none">
                              🔒
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ─── TAB CONTENT: XP HISTORY ─────────────────────────────────────── */}
              {activeTab === 'history' && (
                <div className="border-4 border-ink bg-white shadow-hard overflow-hidden">
                  <div className="border-b-4 border-ink px-5 py-3.5 bg-ink flex items-center justify-between">
                    <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest">Recent XP Activity</span>
                    <span className="font-mono text-[8px] text-white/50 uppercase">User: {currentUser?.email}</span>
                  </div>

                  <div className="divide-y-4 divide-ink">
                    {xpLogs.length === 0 ? (
                      <div className="p-8 text-center bg-canvas">
                        <p className="font-mono text-xs font-bold text-ink/40 uppercase">No recent activity logged</p>
                      </div>
                    ) : (
                      xpLogs.map(log => (
                        <div key={log.id} className="flex items-center justify-between p-4 bg-white">
                          <div>
                            <div className="font-bold text-sm text-ink uppercase tracking-tight">
                              {log.action === 'lesson_complete' ? '📖 Lesson Completed' :
                               log.action === 'quiz_pass' ? '✅ Assessment Passed' :
                               log.action === 'streak_day' ? '🔥 Daily Streak Kept' :
                               log.action === 'badge_earned' ? '🏆 Achievement Unlocked' : '💬 Forum Contribution'}
                            </div>
                            <div className="font-mono text-[9px] text-ink/40 mt-1 uppercase">
                              {log.reference ? `Ref: ${log.reference}` : 'Daily active check-in'} · {new Date(log.created_at).toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="font-display text-xl font-black text-[#15803D]">
                            +{log.xp_earned} XP
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </div>
  )
}
