/**
 * Mock Data Service
 * Replace these functions with actual API calls when Supabase is integrated
 */

import { EventTrack, TimelineItem, Prize, TeamMember, Sponsor, FAQ, Highlight } from './types'

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
  {
    id: '1',
    eventId: '1',
    time: '11 Apr 26, 12:00 AM IST',
    title: 'Registration Deadline',
    type: 'registration',
    description: 'Team Size: Individual Participation',
  },
  {
    id: '2',
    eventId: '1',
    time: 'Saturday 11 April 2026, 7:00 PM IST',
    title: 'Technical Session',
    type: 'session',
    description: 'Google Meet session for event briefing and rules.',
  },
  {
    id: '3',
    eventId: '1',
    time: '12 Apr 26, 06:00 PM IST',
    title: 'Quiz Time',
    type: 'session',
    description: 'Live TechQuiz challenge begins on time.',
  },
  {
    id: '4',
    eventId: '1',
    time: 'Within 3 days after quiz',
    title: 'Certificate Time',

    type: 'award',
    description: 'Digital certificates issued to all participants after the quiz.',
  },
]

export const mockPrizes: Prize[] = [
  {
    id: '1',
    eventId: '1',
    title: '🥇 1st Place',
    rank: 1,
    amount: 0,
    currency: '',
    label: 'Dairy  + Stickers + Pen',
    description: 'Premium dairy hamper, exclusive Google premium stickers, quality pen + Certificate of Achievement.',
  },
  {
    id: '2',
    eventId: '1',
    title: '🥈 2nd Place',
    rank: 2,
    amount: 0,
    currency: '',
    label: 'Pen + Stickers',
    description: 'High-quality pen,Google premium sticker collection + Certificate of Achievement.',
  },
  {
    id: '3',
    eventId: '1',
    title: '🥉 3rd Place',
    rank: 3,
    amount: 0,
    currency: '',
    label: 'Premium Stickers',
    description: 'Exclusive Google sticker collection + Certificate of Achievement.',
  },
  {
    id: '4',
    eventId: '1',
    title: 'All Participants',
    rank: 4,
    amount: 0,
    currency: '',
    label: '🎖️ Participation Certificate',
    description: 'Certificate of Participation for all who complete the quiz on Unstop - issued without delay.',
  },
]

export const mockTeam: TeamMember[] = [
  {
    id: '1',
    eventId: '1',
    name: 'Mukesh Kumar',
    role: 'Lead Organizer',
    bio: 'Passionate about creating memorable tech events and fostering innovation',
    linkedin: 'https://www.linkedin.com/in/themukeshdev',
    instagram: 'https://instagram.com/themukeshdev',
  },
  {
    id: '2',
    eventId: '1',
    name: 'Aryaman Patel',
    role: 'Technical Lead',
    bio: 'Expert in event technology infrastructure and digital solutions',
    linkedin: 'https://www.linkedin.com/in/aryaman-patel-248b453a3',
    instagram: 'https://www.instagram.com/aryan_patelxyz',
  },
  {
    id: '3',
    eventId: '1',
    name: 'Deepa Tiwari',
    role: 'Operations Manager',
    bio: 'Ensuring smooth event execution and participant experience',
    linkedin: 'https://www.linkedin.com/in/deepa-tiwari-1565753a3',
  },
  {
    id: '4',
    eventId: '1',
    name: 'Shweta Tiwari',
    role: 'Community Manager',
    bio: 'Building and nurturing our tech community',
    linkedin: 'https://www.linkedin.com/in/shweta-tiwari448',
  },
]

export const mockSponsors: Sponsor[] = [
  {
    id: '1',
    eventId: '1',
    name: 'BBS Coding Club',
    type: 'Official Sponsor',
    tier: 'gold',
    isVisible: true,
    sortOrder: 1,
    description: 'Official coding community partner supporting Tech Hub BBS initiatives.',
    website: 'https://bbsodingclub.example.com',
  },
]

export const mockFAQs: FAQ[] = [
  {
    id: '1',
    eventId: '1',
    question: 'What is the registration deadline?',
    answer: 'The registration deadline is 11 April 2026 at 12:00 AM IST. Register before this date to participate in the quiz challenge.',
    category: 'Registration',
    order: 1,
    createdAt: '2026-04-01',
  },
  {
    id: '2',
    eventId: '1',
    question: 'How long is the quiz? ',
    answer: 'The quiz is 20 minutes long and consists of 20 multiple-choice questions on Computer Awareness and C Programming.',
    category: 'Quiz',
    order: 2,
    createdAt: '2026-04-01',
  },
  {
    id: '3',
    eventId: '1',
    question: 'Is this an individual quiz or a team event?',
    answer: 'This is an individual quiz challenge. Each participant competes independently to earn rankings and rewards.',
    category: 'Quiz',
    order: 3,
    createdAt: '2026-04-01',
  },
  {
    id: '4',
    eventId: '1',
    question: 'Who is eligible to take part?',
    answer: 'The quiz is open to students from all streams, including Engineering, Management, Medical, Law, Arts, Commerce, and Sciences.',
    category: 'Eligibility',
    order: 4,
    createdAt: '2026-04-01',
  },
  {
    id: '5',
    eventId: '1',
    question: 'How are winners selected?',
    answer: 'Winners are selected based on their quiz score and the time taken to complete the quiz. Higher scores and faster completion times rank higher.',
    category: 'Quiz',
    order: 5,
    createdAt: '2026-04-01',
  },
  {
    id: '6',
    eventId: '1',
    question: 'When will certificates be issued?',
    answer: 'Certificates will be issued within 3 days after the quiz ends to all registered participants who complete the event.',
    category: 'Certificate',
    order: 6,
    createdAt: '2026-04-01',
  },
  {
    id: '7',
    eventId: '1',
    question: 'Can I use external help during the quiz?',
    answer: 'No, participants must complete the quiz independently. Any unfair means may disqualify your submission.',
    category: 'Rules',
    order: 7,
    createdAt: '2026-04-01',
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
