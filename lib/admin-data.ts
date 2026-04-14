const ADMIN_PROFILES: Record<string, { id: string; email: string; full_name: string; role: 'admin' }> = {
  'mukeshkumar916241@gmail.com': { id: '1', email: 'mukeshkumar916241@gmail.com', full_name: 'Mukesh Kumar', role: 'admin' },
  'shwetatiwari.8060@gmail.com': { id: '2', email: 'shwetatiwari.8060@gmail.com', full_name: 'Shweta Tiwari', role: 'admin' },
  'techwitharyan2211@gmail.com': { id: '3', email: 'techwitharyan2211@gmail.com', full_name: 'Aryaman Patel', role: 'admin' },
  'deepatiwari221503@gmail.com': { id: '4', email: 'deepatiwari221503@gmail.com', full_name: 'Deepa Tiwari', role: 'admin' },
}

export function getAdminProfile(email: string) {
  const lowerEmail = email.toLowerCase()
  return ADMIN_PROFILES[lowerEmail] || null
}
