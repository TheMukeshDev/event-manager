import { getPublicOverview } from '@/lib/public-data'
import { getApprovedAmbassadors } from '@/lib/ambassador-service'
import { Ambassador } from '@/lib/types'
import { AmbassadorApplicationForm } from '@/components/ambassador/application-form'
import { AmbassadorLeaderboard } from '@/components/ambassador/leaderboard'

export default async function AmbassadorPage() {
  const { adminSettings } = await getPublicOverview()
  const ambassadors = (await getApprovedAmbassadors(12)) as Ambassador[]

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 xl:grid-cols-[0.9fr_0.95fr] items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-2 text-sm text-cyan-100">
              Campus Ambassador Program
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Become a Student Ambassador & own the referral leaderboard.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-300">
              Apply for the ambassador role, share your unique referral link, and earn rewards once your referrals hit the threshold.
              Approved ambassadors can submit proof, track team signups, and move up the leaderboard.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-sm font-semibold text-cyan-300">Reward Threshold</p>
                <p className="mt-3 text-3xl font-semibold text-white">{adminSettings.referral_threshold} valid referrals</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-sm font-semibold text-cyan-300">Ambassador Reward</p>
                <p className="mt-3 text-lg text-slate-200">{adminSettings.reward_title}</p>
                <p className="mt-2 text-sm text-slate-400">{adminSettings.reward_description}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-500/5">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">
                Apply now
              </div>
              <h2 className="text-2xl font-bold text-white">Ambassador Application</h2>
              <p className="text-sm leading-6 text-slate-400">
                Submit your details and we will review your application. Once approved, you will receive your ambassador referral link and access to the leaderboard.
              </p>
            </div>
            <div className="mt-8">
              <AmbassadorApplicationForm proofFormLink={adminSettings.external_proof_form_link} />
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white">Leaderboard</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            Approved ambassadors are ranked by verified referrals. The leaderboard updates as proof is validated and referrals are confirmed.
          </p>
          <div className="mt-8">
            <AmbassadorLeaderboard ambassadors={ambassadors} visible={adminSettings.leaderboard_visible} />
          </div>
        </div>
      </div>
    </div>
  )
}
