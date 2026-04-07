import { Ambassador } from '@/lib/types'

interface AmbassadorLeaderboardProps {
  ambassadors: Ambassador[]
  visible: boolean
}

export function AmbassadorLeaderboard({ ambassadors, visible }: AmbassadorLeaderboardProps) {
  if (!visible) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-300">
        <h3 className="text-xl font-semibold text-white">Leaderboard is private</h3>
        <p className="mt-3 text-sm text-slate-400">The ambassador leaderboard is currently not visible to the public.</p>
      </div>
    )
  }

  if (ambassadors.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-300">
        <p className="text-sm">No approved ambassadors are visible yet. Check back soon.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {ambassadors.map((ambassador, index) => (
        <div key={ambassador.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Rank {index + 1}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{ambassador.fullName}</h3>
              <p className="mt-2 text-sm text-slate-400">{ambassador.collegeName}</p>
            </div>
            <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200">
              {ambassador.validReferralCount} valid refs
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">
            <p>{ambassador.rewardEligible ? 'Reward eligible' : 'Working toward reward'}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
