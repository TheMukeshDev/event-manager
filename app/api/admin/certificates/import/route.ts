import { NextRequest, NextResponse } from 'next/server'
import Papa from 'papaparse'

interface ParsedRecord {
  name: string
  email: string
  rank: number | null
  rawScore: string | null
  normalizedScore: number | null
  bestTime: string | null
  event: string
  certificateType: string
  date?: string | null
}

interface ImportResult {
  total: number
  valid: number
  invalid: number
  records: ParsedRecord[]
  errors: string[]
}

function normalizeScore(rawScore: string): number | null {
  if (!rawScore) return null
  
  // Handle '95/20' -> 95
  const match = rawScore.match(/^(\d+(?:\.\d+)?)\s*\/?\s*\d*(?:\.\d+)?\s*$/)
  if (match) {
    const num = parseFloat(match[1])
    return isNaN(num) ? null : num
  }
  
  // Direct float
  const num = parseFloat(rawScore)
  return isNaN(num) ? null : num
}

function findHeaderIndex(headers: string[], keywords: string[]): number {
  for (const keyword of keywords) {
    const index = headers.findIndex(h => 
      h.toLowerCase().includes(keyword.toLowerCase())
    )
    if (index !== -1) return index
  }
  return -1
}

function parseCSV(csvText: string): ParsedRecord[] {
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    transform: (value) => value.trim().replace(/"/g, '')
  })

  if (parsed.errors.length > 0) {
    console.error('PapaParse errors:', parsed.errors)
  }

  const headers = Object.keys(parsed.data[0] || {})
  
  // Flexible header matching
  const nameIndex = findHeaderIndex(headers, ["name", "candidate's name", "candidate name"])
  const emailIndex = findHeaderIndex(headers, ["email", "candidate's email", "candidate email"])
  const rankIndex = findHeaderIndex(headers, ["rank", "#", "position"])
  const scoreIndex = findHeaderIndex(headers, ["effective score", "score", "marks", "95/20"])
  const bestTimeIndex = findHeaderIndex(headers, ["best time", "time"])
  const eventIndex = findHeaderIndex(headers, ["event", "quiz", "competition"])
  const dateIndex = findHeaderIndex(headers, ["date", "exam date"])

  if (nameIndex === -1 || emailIndex === -1) {
    throw new Error('Required columns not found: Name, Email')
  }

  const records: ParsedRecord[] = []

  for (let i = 0; i < parsed.data.length; i++) {
    const row = parsed.data[i] as any
    const name = row[headers[nameIndex]] || ''
    const email = row[headers[emailIndex]] || ''
    const rankStr = rankIndex !== -1 ? row[headers[rankIndex]] : null
    const scoreStr = scoreIndex !== -1 ? row[headers[scoreIndex]] : null
    const bestTime = bestTimeIndex !== -1 ? row[headers[bestTimeIndex]] : null
    const eventName = eventIndex !== -1 ? row[headers[eventIndex]] : 'TechQuiz 2026'
    const date = dateIndex !== -1 ? row[headers[dateIndex]] : null

    const rank = rankStr ? parseInt(rankStr, 10) : null
    const normalizedScore = scoreStr ? normalizeScore(scoreStr) : null

    records.push({
      name,
      email: email.toLowerCase(),
      rank: !isNaN(rank as number) ? rank as number : null,
      rawScore: scoreStr || null,
      normalizedScore,
      bestTime: bestTime || null,
      event: eventName,
      certificateType: 'participation'
    })
  }

  return records
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateScore(score: number | null): boolean {
  return score !== null && score >= 0 && score <= 100 // Flexible max
}

function validateRecords(records: ParsedRecord[]): ImportResult {
  const errors: string[] = []
  const validRecords: ParsedRecord[] = []
  const seenEmails = new Set<string>()

  for (let i = 0; i < records.length; i++) {
    const record = records[i]
    const rowNum = i + 1

    if (!record.name || record.name.trim() === '') {
      errors.push(`Row ${rowNum}: Name is missing`)
      continue
    }

    if (!record.email || record.email.trim() === '') {
      errors.push(`Row ${rowNum}: Email is missing`)
      continue
    }

    if (!validateEmail(record.email)) {
      errors.push(`Row ${rowNum}: Invalid email - ${record.email}`)
      continue
    }

    if (seenEmails.has(record.email)) {
      errors.push(`Row ${rowNum}: Duplicate email - ${record.email}`)
      continue
    }
    seenEmails.add(record.email)

    // Warn on invalid score but still allow
    if (record.normalizedScore === null && record.rawScore) {
      errors.push(`Row ${rowNum}: Invalid score format "${record.rawScore}" (used null)`)
    } else if (!validateScore(record.normalizedScore)) {
      errors.push(`Row ${rowNum}: Score out of range ${record.normalizedScore}`)
    }

    let certificateType = 'participation'
    if (record.rank === 1) certificateType = 'winner'
    else if (record.rank === 2) certificateType = 'runner-up'
    else if (record.rank === 3) certificateType = 'second-runner-up'

    validRecords.push({
      ...record,
      name: record.name.trim(),
      certificateType
    })
  }

  return {
    total: records.length,
    valid: validRecords.length,
    invalid: records.length - validRecords.length,
    records: validRecords,
    errors
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json({ success: false, error: 'Only CSV files are allowed' }, { status: 400 })
    }

    const csvText = await file.text()
    if (!csvText || csvText.trim() === '') {
      return NextResponse.json({ success: false, error: 'CSV file is empty' }, { status: 400 })
    }

    const parsedRecords = parseCSV(csvText)
    if (parsedRecords.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid data found in CSV' }, { status: 400 })
    }

    const validationResult = validateRecords(parsedRecords)

    return NextResponse.json({
      success: true,
      preview: validationResult
    })
  } catch (error: any) {
    console.error('Error parsing CSV:', error)
    return NextResponse.json({ success: false, error: error.message || 'Failed to parse CSV' }, { status: 400 })
  }
}
