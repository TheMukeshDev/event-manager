/**
 * Event Manager Type Definitions
 * Prepared for Supabase integration
 */

// Events
export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  registeredCount: number
  imageUrl?: string
  status: 'upcoming' | 'ongoing' | 'completed'
  createdAt: string
  updatedAt: string
}

// Event Tracks
export interface EventTrack {
  id: string
  eventId: string
  name: string
  description: string
  icon?: string
  maxParticipants: number
  registeredCount: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  schedule: {
    startTime: string
    endTime: string
  }
}

// Timeline Events
export interface TimelineItem {
  id: string
  eventId: string
  time: string
  title: string
  description?: string
  type: 'registration' | 'session' | 'break' | 'award'
  duration?: string
}

// Prize Pool
export interface Prize {
  id: string
  eventId: string
  rank: number
  title: string
  amount: number
  currency: string
  label?: string
  description?: string
  image?: string
}

// User/Team
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  bio?: string
  role: 'admin' | 'organizer' | 'participant'
  createdAt: string
}

export interface TeamMember {
  id: string
  eventId: string
  name: string
  role: string
  avatar?: string
  bio?: string
  email?: string
  linkedin?: string
  instagram?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
}

export interface AmbassadorApplication {
  id: string
  eventId: string
  fullName: string
  phone: string
  email: string
  collegeName: string
  branch: string
  section: string
  yearOrSemester: string
  city?: string
  state?: string
  whyFitForRole: string
  priorExperience?: string
  socialProfileLink?: string
  whatsappNumber?: string
  consent: boolean
  status: 'pending' | 'approved' | 'rejected'
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

export interface Ambassador {
  id: string
  eventId: string
  userId?: string
  fullName: string
  email: string
  phone?: string
  collegeName: string
  branch: string
  section: string
  yearOrSemester: string
  city?: string
  state?: string
  referralCode: string
  referralLink: string
  totalReferrals: number
  validReferralCount: number
  rewardEligible: boolean
  certificateEligible: boolean
  goodiesEligible: boolean
  status: 'pending' | 'approved' | 'rejected'
  rewardStatus?: string
  createdAt: string
  updatedAt: string
  name?: string
  college?: string
  reward?: string
}

export interface AmbassadorProof {
  id: string
  ambassadorId: string
  proofFileUrl?: string
  proofDescription: string
  numberOfStudentsClaimed: number
  referredStudentEmails?: string[]
  status: 'pending' | 'approved' | 'rejected'
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

export interface AdminSettings {
  registrationLink: string
  whatsappCommunityLink: string
  isWhatsappJoinMandatory: boolean
  certificateRulesText: string
  certificateIdPrefix: string
  sponsorCtaWhatsappNumber: string
  sponsorCtaDefaultMessage: string
  sponsorCtaVisible: boolean
  campusAmbassadorEnabled: boolean
  referralThreshold: number
  rewardTitle: string
  rewardDescription: string
  useExternalProofForm: boolean
  externalProofFormLink: string
  leaderboardVisible: boolean
  ambassadorShareMessage: string
}

// Sponsor
export interface Sponsor {
  id: string
  eventId: string
  name: string
  type?: string
  logo?: string
  website?: string
  description?: string
  tier: 'platinum' | 'gold' | 'silver' | 'bronze'
  isVisible?: boolean
  sortOrder?: number
  contact?: string
}

// Certificate
export interface Certificate {
  id: string
  userId: string
  eventId: string
  trackId?: string
  certificateUrl: string
  verificationId: string
  issuedAt: string
  expiresAt?: string
}

// Registration
export interface Registration {
  id: string
  eventId: string
  userId: string
  trackIds: string[]
  registeredAt: string
  status: 'registered' | 'attended' | 'cancelled'
  attendanceVerified: boolean
  checkInTime?: string
  referralCode?: string
  ambassadorId?: string
  validReferral?: boolean
}

// FAQ
export interface FAQ {
  id: string
  eventId: string
  question: string
  answer: string
  category?: string
  order: number
  createdAt: string
}

// Highlight
export interface Highlight {
  id: string
  eventId: string
  title: string
  description: string
  icon?: string
  color?: string
  order: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
