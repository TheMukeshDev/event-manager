'use client'

import { createContext, useContext, ReactNode } from 'react'
import { EventData } from '@/lib/event-data'

interface ApiEventData {
  id: string
  title: string
  shortName: string
  description: string
  mode: string
  status: string
  eventType: string
  region: string
  venue: string
  logoUrl?: string
  registration: {
    opens: string
    opensTime: string
    closes: string
    closesTime: string
    deadline: string
  }
  rounds: Array<{
    id: string
    order: number
    name: string
    date: string
    time: string
    endTime: string
    duration: string
    durationDisplay: string
    questions: number
    displayText: string
    difficulty: string
    totalRounds: number
  }>
  stats: {
    registeredCount: number
    playersCount: number
    totalRounds: number
    questions: number
    duration: string
  }
  registrationUrl: string
  shortUrl: string
  prizes: Array<{
    rank: string
    reward: string
    hasCertificate: boolean
  }>
  teamSize: {
    min: number
    max: number
    display: string
  }
  showRegistrationsCount: boolean
  showImpressions: boolean
  showRoundsData: boolean
  fetchedAt: string
}

interface EventDataContextType {
  apiData: ApiEventData | null
  mergedData: EventData | null
}

const EventDataContext = createContext<EventDataContextType>({
  apiData: null,
  mergedData: null,
})

export function useEventData() {
  return useContext(EventDataContext)
}

interface EventDataProviderProps {
  children: ReactNode
  apiData: ApiEventData | null
  fallbackData: EventData
}

export function EventDataProvider({ children, apiData, fallbackData }: EventDataProviderProps) {
  const mergedData = apiData ? {
    ...fallbackData,
    id: apiData.id,
    title: apiData.title,
    shortName: apiData.shortName,
    description: apiData.description,
    mode: apiData.mode,
    status: apiData.status,
    eventType: apiData.eventType,
    region: apiData.region,
    venue: apiData.venue,
    registeredCount: apiData.stats.registeredCount,
    questions: apiData.stats.questions,
    duration: apiData.stats.duration,
    date: apiData.rounds[0]?.date || fallbackData.date,
    time: apiData.rounds[0]?.time || fallbackData.time,
    registrationDeadline: apiData.registration.deadline,
    registrationOpens: apiData.registration.opens,
    teamSize: apiData.teamSize.display,
    capacity: null,
    rounds: apiData.rounds.map(r => ({
      id: r.id,
      name: r.name,
      displayText: r.displayText,
      date: r.date,
      time: r.time,
      endTime: r.endTime,
      duration: r.durationDisplay,
      questions: r.questions,
      difficulty: r.difficulty,
      topics: 'Computer Awareness + C Programming',
      scoring: 'Ranking based on score + time',
      totalRounds: r.totalRounds,
    })),
  } : fallbackData

  return (
    <EventDataContext.Provider value={{ apiData, mergedData }}>
      {children}
    </EventDataContext.Provider>
  )
}
