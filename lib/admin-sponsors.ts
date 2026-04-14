export interface Sponsor {
  id: string
  name: string
  type: string
  logo_url?: string
  website?: string
  description?: string
  tier: 'platinum' | 'gold' | 'silver' | 'bronze'
  is_visible: boolean
  sort_order: number
}

let sponsorsStore: Sponsor[] = []

export function getSponsors() {
  return sponsorsStore
}

export function addSponsor(sponsor: Omit<Sponsor, 'id'>) {
  const newSponsor: Sponsor = {
    ...sponsor,
    id: Date.now().toString(),
  }
  sponsorsStore.push(newSponsor)
  return newSponsor
}

export function updateSponsor(id: string, updates: Partial<Sponsor>) {
  const index = sponsorsStore.findIndex(s => s.id === id)
  if (index !== -1) {
    sponsorsStore[index] = { ...sponsorsStore[index], ...updates }
    return sponsorsStore[index]
  }
  return null
}

export function deleteSponsor(id: string) {
  const index = sponsorsStore.findIndex(s => s.id === id)
  if (index !== -1) {
    sponsorsStore.splice(index, 1)
    return true
  }
  return false
}

export function getSponsorById(id: string) {
  return sponsorsStore.find(s => s.id === id) || null
}
