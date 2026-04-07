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
