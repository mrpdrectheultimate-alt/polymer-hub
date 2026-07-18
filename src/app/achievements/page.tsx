'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trophy, Flame, Star, Lock } from 'lucide-react'

type Badge = {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  color: string
  xp_reward: number
  category: string
  condition: string
}

type UserBadge = { badge_id: string; earned_at: string }

type LeaderboardEntry = {
  id: string
  full_name: string | null
  avatar_url: string | null
  college_name: string | null
  xp_points: number
  current_streak: number
  total_lessons_completed: number
  badges_earned: number
}

type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  xp_points: number
  current_streak: number
  longest_streak: number
  total_lessons_completed: number
  total_quizzes_passed: number
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  learning:  { label: 'Learning',  color: '#1D4ED8', bg: '#EFF6FF' },
  quiz:      { label: 'Quizzes',   color: '#15803D', bg: '#F0FDF4' },
  streak:    { label: 'Streaks',   color: '#EA580C', bg: '#FFF7ED' },
  community: { label: 'Community', color: '#7C3AED', bg: '#F5F3FF' },
  special:   { label: 'Special',   color: '#CA8A04', bg: '#FEFCE8' },
}

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

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'u1', full_name: 'Ananya Sharma', avatar_url: null, college_name: 'IIT Kharagpur', xp_points: 1250, current_streak: 12, total_lessons_completed: 28, badges_earned: 9 },
  { id: 'u2', full_name: 'Rahul Verma', avatar_url: null, college_name: 'MIT Pune', xp_points: 980, current_streak: 8, total_lessons_completed: 20, badges_earned: 6 },
  { id: 'u3', full_name: 'Priya Patel', avatar_url: null, college_name: 'CIPET Chennai', xp_points: 840, current_streak: 5, total_lessons_completed: 18, badges_earned: 5 },
  { id: 'u4', full_name: 'Amit Patel', avatar_url: null, college_name: 'HBTI Kanpur', xp_points: 710, current_streak: 4, total_lessons_completed: 15, badges_earned: 4 },
  { id: 'u5', full_name: 'Divya Nair', avatar_url: null, college_name: 'ICT Mumbai', xp_points: 620, current_streak: 3, total_lessons_completed: 12, badges_earned: 3 },
]

function Avatar({ name, avatarUrl, size = 10 }: { name: string | null; avatarUrl: string | null; size?: number }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST'
  
  const sizeMap: Record<number, string> = {
    9: 'w-9 h-9',
    10: 'w-10 h-10',
    12: 'w-12 h-12',
  }
  const sizeClass = sizeMap[size] ?? 'w-10 h-10'

  return avatarUrl ? (
    <img src={avatarUrl} alt={name ?? ''} className={`${sizeClass} border-2 border-ink object-cover flex-shrink-0`} />
  ) : (
    <div className={`${sizeClass} border-2 border-ink bg-violet flex items-center justify-center font-mono text-xs font-black text-white flex-shrink-0`}>
      {initials}
    </div>
  )
}

export default function AchievementsPage() {
  const supabase = createClient()
  const [badges, setBadges] = useState<Badge[]>([])
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'badges' | 'leaderboard'>('badges')
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        const { data: allBadges } = await supabase
          .from('badges')
          .select('*')
          .order('category')
          .order('xp_reward')

        const { data: board } = await supabase
          .from('leaderboard')
          .select('*')
          .limit(50)

        setBadges(allBadges ?? MOCK_BADGES)
        setLeaderboard(board ?? MOCK_LEADERBOARD)

        if (session) {
          try {
            const { data: prof } = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url, xp_points, current_streak, longest_streak, total_lessons_completed, total_quizzes_passed')
              .eq('id', session.user.id)
              .single()
            
            if (prof) setProfile(prof)
          } catch (e) {
            console.warn('Failed to load profile:', e)
          }

          try {
            const { data: earned } = await supabase
              .from('user_badges')
              .select('badge_id, earned_at')
              .eq('user_id', session.user.id)
            
            setUserBadges(earned ?? [])
          } catch (e) {
            console.warn('Failed to load user badges:', e)
          }
        }
      } catch (err) {
        console.error('Failed to load achievements data:', err)
        setBadges(MOCK_BADGES)
        setLeaderboard(MOCK_LEADERBOARD)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [supabase])

  const earnedIds = new Set(userBadges.map(b => b.badge_id))
  const earnedCount = userBadges.length
  const totalBadges = badges.length

  const filteredBadges = activeCategory === 'all' ? badges : badges.filter(b => b.category === activeCategory)
  const userRank = profile ? leaderboard.findIndex(e => e.id === profile.id) + 1 : null

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="border-4 border-ink p-8 shadow-hard font-display text-2xl font-black text-ink animate-pulse">Loading achievements...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-yellow-bright" />

      {/* Hero */}
      <section className="border-b-4 border-ink bg-ink px-6 md:px-12 py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-6xl mx-auto flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-bright border-4 border-yellow-bright flex items-center justify-center">
                <Trophy className="w-5 h-5 text-ink" />
              </div>
              <span className="font-mono text-[10px] font-black text-yellow-bright border-2 border-yellow-bright px-3 py-1 uppercase tracking-widest">Achievements</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-none mb-3">
              BADGES. STREAKS.<br />
              <span className="text-yellow-bright italic">LEADERBOARD.</span>
            </h1>
            <p className="text-white/70 max-w-lg">{totalBadges} badges to earn. {earnedCount} earned so far. Keep learning to unlock them all.</p>
          </div>

          {/* Profile XP card */}
          {profile && (
            <div className="border-4 border-yellow-bright p-5 flex-shrink-0" style={{ backgroundColor: 'rgba(250,204,21,0.1)' }}>
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={profile.full_name} avatarUrl={profile.avatar_url} size={12} />
                <div>
                  <div className="font-display text-lg font-black text-white">{profile.full_name ?? 'Student'}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-3.5 h-3.5 text-yellow-bright" />
                    <span className="font-mono text-sm font-black text-yellow-bright">{profile.xp_points.toLocaleString()} XP</span>
                    {userRank && userRank > 0 && (
                      <span className="font-mono text-[9px] text-white/50 border border-white/20 px-2 py-0.5">Rank #{userRank}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { val: profile.current_streak, label: 'Day streak', icon: '🔥' },
                  { val: profile.total_lessons_completed, label: 'Lessons', icon: '📚' },
                  { val: earnedCount, label: 'Badges', icon: '🏅' },
                ].map(s => (
                  <div key={s.label} className="border-2 border-yellow-bright/30 px-2 py-2">
                    <div className="font-display text-xl font-black text-yellow-bright">{s.val}</div>
                    <div className="font-mono text-[8px] text-white/40 uppercase">{s.icon} {s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b-4 border-ink flex">
        {(['badges', 'leaderboard'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="font-mono text-[10px] font-black uppercase tracking-widest px-6 py-3 border-r-4 border-ink transition-colors"
            style={{ backgroundColor: activeTab === tab ? '#0A0A0A' : 'white', color: activeTab === tab ? '#FACC15' : '#6B7280' }}>
            {tab === 'badges' ? `🏅 Badges (${earnedCount}/${totalBadges})` : '🏆 Leaderboard'}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* BADGES TAB */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            {/* Category filter */}
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setActiveCategory('all')}
                className="font-mono text-[10px] font-black border-4 border-ink px-4 py-2 uppercase tracking-wider transition-all"
                style={{ backgroundColor: activeCategory === 'all' ? '#0A0A0A' : 'white', color: activeCategory === 'all' ? 'white' : '#6B7280' }}>
                All ({badges.length})
              </button>
              {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
                const count = badges.filter(b => b.category === key).length
                const earnedInCat = badges.filter(b => b.category === key && earnedIds.has(b.id)).length
                return (
                  <button key={key} onClick={() => setActiveCategory(key)}
                    className="font-mono text-[10px] font-black border-4 border-ink px-4 py-2 uppercase tracking-wider transition-all"
                    style={{
                      backgroundColor: activeCategory === key ? cfg.color : 'white',
                      color: activeCategory === key ? 'white' : '#6B7280',
                      boxShadow: `2px 2px 0px 0px ${cfg.color}`,
                    }}>
                    {cfg.label} ({earnedInCat}/{count})
                  </button>
                )
              })}
            </div>

            {/* Streak display */}
            {profile && profile.current_streak > 0 && (
              <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0px 0px #EA580C' }}>
                <div className="border-b-4 border-ink px-5 py-3 bg-orange flex items-center gap-3">
                  <Flame className="w-5 h-5 text-white" />
                  <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest">Current Streak</span>
                </div>
                <div className="p-5 flex items-center gap-6 flex-wrap" style={{ backgroundColor: '#FFF7ED' }}>
                  <div className="font-display text-6xl font-black text-orange">{profile.current_streak}</div>
                  <div>
                    <div className="font-bold text-ink mb-1">days in a row 🔥</div>
                    <div className="font-mono text-[10px] text-ink/50">Longest streak: {profile.longest_streak} days</div>
                    <div className="font-mono text-[10px] text-ink/50 mt-0.5">Don&apos;t break it — come back tomorrow to continue</div>
                  </div>
                  {/* Streak milestones */}
                  <div className="flex gap-2 ml-auto flex-wrap">
                    {[3, 7, 14, 30].map(milestone => (
                      <div key={milestone}
                        className="border-4 border-ink w-12 h-12 flex flex-col items-center justify-center"
                        style={{ backgroundColor: profile.current_streak >= milestone ? '#EA580C' : 'white' }}>
                        <div className="font-mono text-[10px] font-black" style={{ color: profile.current_streak >= milestone ? 'white' : '#9CA3AF' }}>{milestone}</div>
                        <div className="text-[8px]" style={{ color: profile.current_streak >= milestone ? 'white' : '#D1D5DB' }}>days</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Badges grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBadges.map(badge => {
                const isEarned = earnedIds.has(badge.id)
                const earnedDate = userBadges.find(ub => ub.badge_id === badge.id)?.earned_at
                const cfg = CATEGORY_CONFIG[badge.category] || { label: 'Badge', color: '#6B7280', bg: '#F3F4F6' }

                return (
                  <div key={badge.id}
                    className="border-4 border-ink overflow-hidden transition-all"
                    style={{
                      boxShadow: isEarned ? `4px 4px 0px 0px ${badge.color}` : '2px 2px 0px 0px #D1D5DB',
                      opacity: isEarned ? 1 : 0.6,
                    }}>
                    <div className="border-b-4 border-ink px-4 py-3 flex items-center justify-between"
                      style={{ backgroundColor: isEarned ? badge.color : '#F3F4F6' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{badge.icon}</span>
                        <span className="font-mono text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border"
                          style={isEarned
                            ? { borderColor: 'rgba(255,255,255,0.4)', color: 'white' }
                            : { borderColor: '#D1D5DB', color: '#6B7280' }}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" style={{ color: isEarned ? 'white' : '#9CA3AF' }} />
                        <span className="font-mono text-[10px] font-black" style={{ color: isEarned ? 'white' : '#9CA3AF' }}>+{badge.xp_reward} XP</span>
                      </div>
                    </div>
                    <div className="p-4 bg-canvas">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display text-base font-black text-ink leading-tight">{badge.name}</h3>
                        {!isEarned && <Lock className="w-4 h-4 text-ink/30 flex-shrink-0 mt-0.5" />}
                        {isEarned && <span className="text-green font-mono text-[9px] font-bold border border-green px-1.5 py-0.5 uppercase flex-shrink-0">Earned ✓</span>}
                      </div>
                      <p className="text-xs text-ink/60 leading-relaxed mb-2">{badge.description}</p>
                      <div className="font-mono text-[8px] text-ink/40 uppercase tracking-wider border-t border-ink/10 pt-2">
                        {isEarned && earnedDate
                          ? `Earned ${new Date(earnedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                          : badge.condition}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="border-4 border-ink overflow-hidden shadow-hard">
              <div className="border-b-4 border-ink px-5 py-3 bg-ink flex items-center justify-between">
                <span className="font-mono text-[10px] font-black text-yellow-bright uppercase tracking-widest">Top Students by XP</span>
                <span className="font-mono text-[9px] text-white/40">Updated live</span>
              </div>

              {/* Top 3 podium */}
              {leaderboard.length >= 3 && (
                <div className="border-b-4 border-ink grid grid-cols-3 gap-0">
                  {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, i) => {
                    const rank = i === 1 ? 1 : i === 0 ? 2 : 3
                    const colors = ['#C0C0C0', '#CA8A04', '#CD7F32']
                    const color = colors[rank - 1]
                    const heights = ['h-28', 'h-36', 'h-24']
                    const height = heights[i]
                    return (
                      <div key={entry.id}
                        className={`border-r-4 border-ink last:border-r-0 flex flex-col items-center justify-end pb-4 pt-4 ${height}`}
                        style={{ backgroundColor: color + '15' }}>
                        <Avatar name={entry.full_name} avatarUrl={entry.avatar_url} size={10} />
                        <div className="font-display text-2xl font-black mt-1" style={{ color }}>#{rank}</div>
                        <div className="font-bold text-xs text-ink text-center px-2 leading-tight">{entry.full_name ?? 'Student'}</div>
                        <div className="font-mono text-[9px] font-black" style={{ color }}>{entry.xp_points.toLocaleString()} XP</div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Full table */}
              <div className="divide-y-2 divide-ink/10">
                {leaderboard.map((entry, i) => {
                  const isMe = profile?.id === entry.id
                  const rankColors = ['#CA8A04', '#C0C0C0', '#CD7F32']
                  const rankColor = i < 3 ? rankColors[i] : '#9CA3AF'

                  return (
                    <div key={entry.id}
                      className="flex items-center gap-4 px-5 py-4 transition-colors"
                      style={{ backgroundColor: isMe ? '#FEFCE8' : 'transparent' }}>
                      <div className="w-8 h-8 border-4 border-ink flex items-center justify-center font-mono font-black text-sm flex-shrink-0"
                        style={{ backgroundColor: i < 3 ? rankColor : 'white', color: i < 3 ? 'white' : '#9CA3AF' }}>
                        {i + 1}
                      </div>
                      <Avatar name={entry.full_name} avatarUrl={entry.avatar_url} size={9} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-ink truncate">{entry.full_name ?? 'Student'}</span>
                          {isMe && <span className="font-mono text-[8px] border border-yellow bg-yellow-light px-1.5 py-0.5 uppercase" style={{ borderColor: '#CA8A04', color: '#CA8A04', backgroundColor: '#FEFCE8' }}>You</span>}
                        </div>
                        {entry.college_name && <div className="font-mono text-[9px] text-ink/40">{entry.college_name}</div>}
                      </div>
                      <div className="hidden sm:flex items-center gap-4 text-center flex-shrink-0">
                        <div>
                          <div className="font-mono text-xs font-black text-orange">{entry.current_streak}🔥</div>
                          <div className="font-mono text-[8px] text-ink/40">streak</div>
                        </div>
                        <div>
                          <div className="font-mono text-xs font-black text-blue">{entry.total_lessons_completed}</div>
                          <div className="font-mono text-[8px] text-ink/40">lessons</div>
                        </div>
                        <div>
                          <div className="font-mono text-xs font-black text-violet">{entry.badges_earned}</div>
                          <div className="font-mono text-[8px] text-ink/40">badges</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-3.5 h-3.5" style={{ color: '#CA8A04' }} />
                        <span className="font-mono text-sm font-black" style={{ color: i < 3 ? rankColor : '#0A0A0A' }}>
                          {entry.xp_points.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {leaderboard.length === 0 && (
                <div className="p-12 text-center">
                  <p className="font-display text-xl font-black text-ink/30 mb-2">No rankings yet</p>
                  <p className="font-mono text-[10px] text-ink/30 uppercase tracking-wider">Complete lessons to appear here</p>
                </div>
              )}
            </div>

            {/* How XP is earned */}
            <div className="border-4 border-ink overflow-hidden shadow-hard">
              <div className="border-b-4 border-ink px-5 py-3 bg-yellow-bright">
                <span className="font-mono text-[10px] font-black text-ink uppercase tracking-widest">How to Earn XP</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-0 divide-x-2 divide-y-2 divide-ink/10">
                {[
                  { action: 'Complete a lesson', xp: 25, icon: '📚' },
                  { action: 'Pass a quiz (70%+)', xp: 30, icon: '✅' },
                  { action: 'Perfect quiz score', xp: 50, icon: '💯' },
                  { action: 'Daily streak', xp: 10, icon: '🔥' },
                  { action: 'Forum answer', xp: 10, icon: '💬' },
                  { action: 'Earn a badge', xp: '25–1000', icon: '🏅' },
                ].map(item => (
                  <div key={item.action} className="p-4 text-center">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="font-mono text-[10px] font-bold text-ink uppercase tracking-wide mb-0.5">{item.action}</div>
                    <div className="font-display text-lg font-black" style={{ color: '#CA8A04' }}>+{item.xp} XP</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
