import { supabaseServer } from './supabase-server'

export interface AdminStats {
  totalUsers: number
  totalAdmins: number
  totalAmbassadors: number
  totalSponsors: number
  totalCertificates: number
  validCertificates: number
  sentCertificates: number
  pendingCertificates: number
  revokedCertificates: number
  recentSignups: { date: string; count: number }[]
  ambassadorReferrals: { name: string; referrals: number }[]
}

export async function getStats(): Promise<AdminStats> {
  if (!supabaseServer) {
    return {
      totalUsers: 0,
      totalAdmins: 0,
      totalAmbassadors: 0,
      totalSponsors: 0,
      totalCertificates: 0,
      validCertificates: 0,
      sentCertificates: 0,
      pendingCertificates: 0,
      revokedCertificates: 0,
      recentSignups: [],
      ambassadorReferrals: [],
    }
  }

  try {
    const [
      usersResult,
      sponsorsResult,
      certsResult,
      recentSignupsResult,
      adminsResult,
      ambassadorsResult,
      referralsResult
    ] = await Promise.all([
      supabaseServer.from('users').select('id', { count: 'exact', head: true }),
      supabaseServer.from('sponsors').select('id', { count: 'exact', head: true }),
      supabaseServer.from('certificate_records').select('*', { count: 'exact' }),
      supabaseServer.from('users').select('created_at').order('created_at', { ascending: false }).limit(100),
      supabaseServer.from('users').select('id, email, role').eq('role', 'admin'),
      supabaseServer.from('ambassadors').select('id', { count: 'exact', head: true }),
      supabaseServer.from('ambassadors').select('full_name, valid_referral_count').order('valid_referral_count', { ascending: false }).limit(10)
    ])

    const totalUsers = usersResult.count || 0
    const totalAdmins = adminsResult.data?.length || adminsResult.count || 0
    const totalAmbassadors = ambassadorsResult.count || 0
    const totalSponsors = sponsorsResult.count || 0
    const certsData = certsResult.data || []
    const totalCertificates = certsResult.count || 0
    const validCertificates = certsData.filter(c => c.status === 'valid').length
    const sentCertificates = certsData.filter(c => c.sent_status === true).length
    const pendingCertificates = certsData.filter(c => !c.sent_status && c.status === 'valid').length
    const revokedCertificates = certsData.filter(c => c.status === 'invalid').length

    const dateCounts = new Map<string, number>()
    recentSignupsResult.data?.forEach((user: any) => {
      if (user.created_at) {
        const date = new Date(user.created_at).toISOString().split('T')[0]
        dateCounts.set(date, (dateCounts.get(date) || 0) + 1)
      }
    })

    const recentSignups = Array.from(dateCounts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14)

    const ambassadorReferrals = (referralsResult.data || [])
      .filter(a => a.full_name && a.valid_referral_count)
      .map(a => ({ name: a.full_name, referrals: a.valid_referral_count || 0 }))

    return {
      totalUsers,
      totalAdmins,
      totalAmbassadors,
      totalSponsors,
      totalCertificates,
      validCertificates,
      sentCertificates,
      pendingCertificates,
      revokedCertificates,
      recentSignups,
      ambassadorReferrals
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return {
      totalUsers: 0,
      totalAdmins: 0,
      totalAmbassadors: 0,
      totalSponsors: 0,
      totalCertificates: 0,
      validCertificates: 0,
      sentCertificates: 0,
      pendingCertificates: 0,
      revokedCertificates: 0,
      recentSignups: [],
      ambassadorReferrals: [],
    }
  }
}
