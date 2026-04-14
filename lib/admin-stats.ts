export interface AdminStats {
  totalUsers: number
  totalAmbassadors: number
  totalSponsors: number
  totalCertificates: number
  validCertificates: number
  revokedCertificates: number
  recentSignups: { date: string; count: number }[]
  ambassadorReferrals: { name: string; referrals: number }[]
}

export function getStats(): AdminStats {
  return {
    totalUsers: 0,
    totalAmbassadors: 0,
    totalSponsors: 0,
    totalCertificates: 0,
    validCertificates: 0,
    revokedCertificates: 0,
    recentSignups: [],
    ambassadorReferrals: [],
  }
}
