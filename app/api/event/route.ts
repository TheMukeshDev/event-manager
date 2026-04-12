import { NextResponse } from 'next/server'

const UNSTOP_API_BASE = 'https://unstop.com/api/public/competition'
const COMPETITION_ID = '1670803'

interface UnstopCompetition {
  status: boolean
  competition: {
    id: number
    title: string
    type: string
    region: string
    location: string | null
    status: string
    start_date: string
    end_date: string
    public_url: string
    short_url: string
    registerCount: number
    players_count: number
    logoUrl: string
    details: string
    overall_prizes: string
    display_configs: {
      show_registrations_count: number
      show_impressions: number
      show_rounds_data: number
    }
    regnRequirements: {
      start_regn_dt: string
      end_regn_dt: string
      max_team_size: number
      min_team_size: number
    }
    rounds: Array<{
      id: number
      round_order: number
      details: Array<{
        id: number
        title: string
        duration: string
        start_date: string
        end_date: string
        total_questions: number
        display_text: string
      }>
    }>
    prizes: Array<{
      id: number
      rank: string
      certificate: number
      others: string
    }>
  }
}

function parseAPIDate(dateStr: string): { date: string; time: string } {
  const date = new Date(dateStr)
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  }
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  }
  
  return {
    date: date.toLocaleDateString('en-GB', options),
    time: date.toLocaleTimeString('en-US', timeOptions) + ' IST'
  }
}

function parseDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '20 minutes'
  
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  }
  return `${seconds} second${seconds > 1 ? 's' : ''}`
}

function extractQuestionCount(displayText: string): number {
  const match = displayText.match(/(\d+)\s*MCQs?/i)
  return match ? parseInt(match[1]) : 20
}

function extractDisplayDuration(displayText: string): string {
  const match = displayText.match(/(\d+)\s*Minutes?/i)
  return match ? `${match[1]} minutes` : '20 minutes'
}

export async function GET() {
  try {
    const response = await fetch(
      `${UNSTOP_API_BASE}/${COMPETITION_ID}?round_lang=1`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        next: { revalidate: 300 }
      }
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data: UnstopCompetition = await response.json()
    const competition = data.competition

    const regnStart = parseAPIDate(competition.regnRequirements.start_regn_dt)
    const regnEnd = parseAPIDate(competition.regnRequirements.end_regn_dt)
    
    const firstRound = competition.rounds[0]
    const roundDetails = firstRound?.details[0]
    const roundStart = roundDetails ? parseAPIDate(roundDetails.start_date) : null
    const roundEnd = roundDetails ? parseAPIDate(roundDetails.end_date) : null

    const transformedData = {
      id: competition.id.toString(),
      title: competition.title,
      shortName: 'TechQuiz 2026',
      description: 'Test your C programming and computer awareness skills in this exciting online quiz challenge. Beginner friendly and open to all streams.',
      mode: 'Online',
      status: competition.status,
      eventType: 'Quiz Challenge',
      region: competition.region,
      venue: competition.location || 'Online',
      logoUrl: competition.logoUrl,
      
      registration: {
        opens: regnStart.date,
        opensTime: regnStart.time,
        closes: roundStart?.date || '14 April 2026',
        closesTime: roundStart?.time || '6:00 PM IST',
        deadline: `14 April 2026, 6:00 PM IST`,
      },
      
      rounds: competition.rounds.map((round, index) => ({
        id: round.id.toString(),
        order: round.round_order,
        name: round.details[0]?.title || `Round ${index + 1}`,
        date: roundStart?.date || '',
        time: roundStart?.time || '',
        endTime: roundEnd?.time || '',
        duration: parseDuration(round.details[0]?.duration || 'PT20M'),
        durationDisplay: extractDisplayDuration(round.details[0]?.display_text || ''),
        questions: extractQuestionCount(round.details[0]?.display_text || ''),
        displayText: round.details[0]?.display_text || '',
        difficulty: 'Easy to Moderate',
        totalRounds: competition.rounds.length,
      })),
      
      stats: {
        registeredCount: competition.registerCount,
        playersCount: competition.players_count,
        totalRounds: competition.rounds.length,
        questions: roundDetails ? extractQuestionCount(roundDetails.display_text) : 20,
        duration: parseDuration(roundDetails?.duration || 'PT20M'),
      },
      
      registrationUrl: competition.public_url 
        ? `https://unstop.com/${competition.public_url}` 
        : competition.short_url,
      shortUrl: competition.short_url,
      
      prizes: competition.prizes.map(p => ({
        rank: p.rank,
        reward: p.others,
        hasCertificate: p.certificate === 1,
      })),
      
      teamSize: {
        min: competition.regnRequirements.min_team_size,
        max: competition.regnRequirements.max_team_size,
        display: competition.regnRequirements.max_team_size === 1 
          ? 'Individual' 
          : `Team of ${competition.regnRequirements.min_team_size}-${competition.regnRequirements.max_team_size}`,
      },
      
      showRegistrationsCount: competition.display_configs?.show_registrations_count === 1,
      showImpressions: competition.display_configs?.show_impressions === 1,
      showRoundsData: competition.display_configs?.show_rounds_data === 1,
      
      fetchedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: transformedData
    })

  } catch (error) {
    console.error('Error fetching Unstop data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch competition data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
