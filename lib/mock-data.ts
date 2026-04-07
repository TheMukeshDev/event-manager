/**
 * Mock Data Service
 * Replace these functions with actual API calls when Supabase is integrated
 */

import { Event, EventTrack, TimelineItem, Prize, TeamMember, Sponsor, FAQ, Highlight } from './types'

export const mockEvent: Event = {
  id: '1',
  title: 'TechFest 2024',
  description: 'Experience the future of technology with cutting-edge innovations',
  date: '2024-06-15',
  time: '09:00',
  location: 'College Campus, City',
  capacity: 500,
  registeredCount: 342,
  status: 'upcoming',
  createdAt: '2024-01-15',
  updatedAt: '2024-03-01',
}

export const mockEventTracks: EventTrack[] = [
  {
    id: '1',
    eventId: '1',
    name: 'Web Development',
    description: 'Build modern web applications with latest technologies',
    difficulty: 'intermediate',
    maxParticipants: 100,
    registeredCount: 85,
    schedule: { startTime: '09:00', endTime: '12:00' },
  },
  {
    id: '2',
    eventId: '1',
    name: 'AI & Machine Learning',
    description: 'Explore artificial intelligence and machine learning applications',
    difficulty: 'advanced',
    maxParticipants: 80,
    registeredCount: 72,
    schedule: { startTime: '13:00', endTime: '16:00' },
  },
  {
    id: '3',
    eventId: '1',
    name: 'Mobile App Development',
    description: 'Create powerful mobile applications for iOS and Android',
    difficulty: 'intermediate',
    maxParticipants: 90,
    registeredCount: 78,
    schedule: { startTime: '09:00', endTime: '12:00' },
  },
  {
    id: '4',
    eventId: '1',
    name: 'Cloud & DevOps',
    description: 'Master cloud technologies and deployment strategies',
    difficulty: 'advanced',
    maxParticipants: 75,
    registeredCount: 65,
    schedule: { startTime: '13:00', endTime: '16:00' },
  },
  {
    id: '5',
    eventId: '1',
    name: 'Cybersecurity',
    description: 'Learn about securing systems and protecting data',
    difficulty: 'beginner',
    maxParticipants: 70,
    registeredCount: 60,
    schedule: { startTime: '09:00', endTime: '12:00' },
  },
  {
    id: '6',
    eventId: '1',
    name: 'Blockchain & Web3',
    description: 'Dive into blockchain technology and decentralized applications',
    difficulty: 'advanced',
    maxParticipants: 60,
    registeredCount: 50,
    schedule: { startTime: '13:00', endTime: '16:00' },
  },
]

export const mockTimeline: TimelineItem[] = [
  { id: '1', eventId: '1', time: '9:00 AM', title: 'Registration & Breakfast', type: 'registration', duration: '1 hour' },
  { id: '2', eventId: '1', time: '10:00 AM', title: 'Opening Keynote', type: 'session', duration: '1 hour' },
  { id: '3', eventId: '1', time: '11:15 AM', title: 'Track Sessions Begin', type: 'session', duration: '2 hours' },
  { id: '4', eventId: '1', time: '1:30 PM', title: 'Lunch Break', type: 'break', duration: '1 hour' },
  { id: '5', eventId: '1', time: '2:30 PM', title: 'Workshops & Hands-on Labs', type: 'session', duration: '2 hours' },
  { id: '6', eventId: '1', time: '4:45 PM', title: 'Networking Session', type: 'session', duration: '1.5 hours' },
  { id: '7', eventId: '1', time: '6:15 PM', title: 'Awards & Closing Ceremony', type: 'award', duration: '1 hour' },
]

export const mockPrizes: Prize[] = [
  {
    id: '1',
    eventId: '1',
    rank: 1,
    title: '1st Prize',
    amount: 50000,
    currency: 'INR',
    description: 'Plus mentorship and investment opportunity',
  },
  {
    id: '2',
    eventId: '1',
    rank: 2,
    title: '2nd Prize',
    amount: 30000,
    currency: 'INR',
    description: 'Plus 6 months free premium access',
  },
  {
    id: '3',
    eventId: '1',
    rank: 3,
    title: '3rd Prize',
    amount: 15000,
    currency: 'INR',
    description: 'Plus featured project showcase',
  },
]

export const mockTeam: TeamMember[] = [
  {
    id: '1',
    eventId: '1',
    name: 'Alice Johnson',
    role: 'Event Director',
    bio: 'Passionate about creating memorable tech events',
  },
  {
    id: '2',
    eventId: '1',
    name: 'Bob Smith',
    role: 'Technical Lead',
    bio: 'Expert in event technology infrastructure',
  },
  {
    id: '3',
    eventId: '1',
    name: 'Carol White',
    role: 'Marketing Head',
    bio: 'Driving engagement and community growth',
  },
  {
    id: '4',
    eventId: '1',
    name: 'David Lee',
    role: 'Operations Manager',
    bio: 'Ensuring smooth event execution',
  },
  {
    id: '5',
    eventId: '1',
    name: 'Emma Brown',
    role: 'Designer',
    bio: 'Creating stunning visual experiences',
  },
  {
    id: '6',
    eventId: '1',
    name: 'Frank Wilson',
    role: 'Community Manager',
    bio: 'Building and nurturing our community',
  },
]

export const mockSponsors: Sponsor[] = [
  {
    id: '1',
    eventId: '1',
    name: 'TechCorp Industries',
    tier: 'platinum',
    description: 'Leading technology corporation',
  },
  {
    id: '2',
    eventId: '1',
    name: 'Digital Innovations Inc',
    tier: 'platinum',
    description: 'Innovation-driven tech company',
  },
  {
    id: '3',
    eventId: '1',
    name: 'Cloud Solutions Ltd',
    tier: 'gold',
    description: 'Cloud infrastructure provider',
  },
  {
    id: '4',
    eventId: '1',
    name: 'Data Systems Pro',
    tier: 'gold',
    description: 'Big data solutions',
  },
]

export const mockFAQs: FAQ[] = [
  {
    id: '1',
    eventId: '1',
    question: 'Who can participate in the event?',
    answer:
      'The event is open to students, professionals, and enthusiasts from all backgrounds. You just need to register on our platform and select your preferred tracks.',
    category: 'Registration',
    order: 1,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    eventId: '1',
    question: 'What is the registration fee?',
    answer: 'Registration is completely free! We want to make this event accessible to everyone.',
    category: 'Registration',
    order: 2,
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    eventId: '1',
    question: 'Can I change my tracks after registration?',
    answer: 'Yes, you can update your track selection up to 48 hours before the event.',
    category: 'Tracks',
    order: 3,
    createdAt: '2024-01-15',
  },
  {
    id: '4',
    eventId: '1',
    question: 'Will the event be recorded?',
    answer: 'Selected sessions and keynotes will be recorded and made available to registered participants within 7 days.',
    category: 'General',
    order: 4,
    createdAt: '2024-01-15',
  },
  {
    id: '5',
    eventId: '1',
    question: 'How will I receive my certificate?',
    answer: 'Your digital certificate will be issued immediately after the event concludes.',
    category: 'Certificate',
    order: 5,
    createdAt: '2024-01-15',
  },
  {
    id: '6',
    eventId: '1',
    question: 'What should I bring to the event?',
    answer: 'Please bring a valid ID and your registration confirmation. For technical workshops, bring a laptop if possible.',
    category: 'General',
    order: 6,
    createdAt: '2024-01-15',
  },
]

export const mockHighlights: Highlight[] = [
  {
    id: '1',
    eventId: '1',
    title: 'Lightning Fast',
    description: 'Experience blazing fast performance with our optimized infrastructure',
    color: 'cyan',
    order: 1,
  },
  {
    id: '2',
    eventId: '1',
    title: 'Community Driven',
    description: 'Connect with thousands of event enthusiasts and organizers worldwide',
    color: 'green',
    order: 2,
  },
  {
    id: '3',
    eventId: '1',
    title: 'Real-time Updates',
    description: 'Stay informed with instant notifications and live event updates',
    color: 'blue',
    order: 3,
  },
  {
    id: '4',
    eventId: '1',
    title: 'Secure & Trusted',
    description: 'Your data is protected with enterprise-grade security measures',
    color: 'cyan',
    order: 4,
  },
]

/**
 * API Service Functions
 * These are placeholder functions that return mock data
 * Replace these with actual API calls when integrating with Supabase
 */

export async function getEvent(): Promise<Event> {
  // TODO: Replace with: const { data } = await supabase.from('events').select().single()
  return mockEvent
}

export async function getEventTracks(): Promise<EventTrack[]> {
  // TODO: Replace with: const { data } = await supabase.from('event_tracks').select()
  return mockEventTracks
}

export async function getTimeline(): Promise<TimelineItem[]> {
  // TODO: Replace with: const { data } = await supabase.from('timeline_items').select()
  return mockTimeline
}

export async function getPrizes(): Promise<Prize[]> {
  // TODO: Replace with: const { data } = await supabase.from('prizes').select()
  return mockPrizes
}

export async function getTeam(): Promise<TeamMember[]> {
  // TODO: Replace with: const { data } = await supabase.from('team_members').select()
  return mockTeam
}

export async function getSponsors(): Promise<Sponsor[]> {
  // TODO: Replace with: const { data } = await supabase.from('sponsors').select()
  return mockSponsors
}

export async function getFAQs(): Promise<FAQ[]> {
  // TODO: Replace with: const { data } = await supabase.from('faqs').select('*').order('order')
  return mockFAQs
}

export async function getHighlights(): Promise<Highlight[]> {
  // TODO: Replace with: const { data } = await supabase.from('highlights').select('*').order('order')
  return mockHighlights
}
