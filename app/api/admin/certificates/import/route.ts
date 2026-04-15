import { NextRequest, NextResponse } from 'next/server'

interface ParsedRecord {
  name: string
  email: string
  rank: number | null
  score: number | null
  bestTime: string | null
  event: string
  certificateType: string
}

interface ImportResult {
  total: number
  valid: number
  invalid: number
  records: ParsedRecord[]
  errors: string[]
}

function parseCSV(csvText: string): ParsedRecord[] {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  
  const nameIndex = headers.findIndex(h => h.toLowerCase().includes("candidate's name"))
  const emailIndex = headers.findIndex(h => h.toLowerCase().includes("candidate's email"))
  const rankIndex = headers.findIndex(h => h.toLowerCase().includes('rank'))
  const scoreIndex = headers.findIndex(h => h.toLowerCase().includes('effective score'))
  const bestTimeIndex = headers.findIndex(h => h.toLowerCase().includes('best time'))

  if (nameIndex === -1 || emailIndex === -1) {
    throw new Error('Required columns not found: Candidate\'s Name, Candidate\'s Email')
  }

  const records: ParsedRecord[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
    
    const name = values[nameIndex] || ''
    const email = values[emailIndex] || ''
    const rankStr = rankIndex !== -1 ? values[rankIndex] : null
    const scoreStr = scoreIndex !== -1 ? values[scoreIndex] : null
    const bestTime = bestTimeIndex !== -1 ? values[bestTimeIndex] : null

    const rank = rankStr ? parseInt(rankStr, 10) : null
    const score = scoreStr ? parseFloat(scoreStr) : null

    records.push({
      name,
      email,
      rank: !isNaN(rank as number) ? rank as number : null,
      score: !isNaN(score as number) ? score as number : null,
      bestTime: bestTime || null,
      event: 'TechQuiz 2026',
      certificateType: 'participation'
    })
  }

  return records
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateRecords(records: ParsedRecord[]): ImportResult {
  const errors: string[] = []
  const validRecords: ParsedRecord[] = []
  const seenEmails = new Set<string>()

  for (let i = 0; i < records.length; i++) {
    const record = records[i]
    const rowNum = i + 2

    if (!record.name || record.name.trim() === '') {
      errors.push(`Row ${rowNum}: Name is missing`)
      continue
    }

    if (!record.email || record.email.trim() === '') {
      errors.push(`Row ${rowNum}: Email is missing`)
      continue
    }

    if (!validateEmail(record.email)) {
      errors.push(`Row ${rowNum}: Invalid email format - ${record.email}`)
      continue
    }

    if (seenEmails.has(record.email.toLowerCase())) {
      errors.push(`Row ${rowNum}: Duplicate email - ${record.email}`)
      continue
    }

    seenEmails.add(record.email.toLowerCase())

    let certificateType = 'participation'
    if (record.rank === 1) certificateType = 'winner'
    else if (record.rank === 2) certificateType = 'runner-up'
    else if (record.rank === 3) certificateType = 'second-runner-up'

    validRecords.push({
      ...record,
      name: record.name.trim(),
      email: record.email.trim().toLowerCase(),
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
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json(
        { success: false, error: 'Only CSV files are allowed' },
        { status: 400 }
      )
    }

    const csvText = await file.text()

    if (!csvText || csvText.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'CSV file is empty' },
        { status: 400 }
      )
    }

    const parsedRecords = parseCSV(csvText)

    if (parsedRecords.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid data found in CSV' },
        { status: 400 }
      )
    }

    const validationResult = validateRecords(parsedRecords)

    return NextResponse.json({
      success: true,
      preview: {
        total: validationResult.total,
        valid: validationResult.valid,
        invalid: validationResult.invalid,
        records: validationResult.records,
        errors: validationResult.errors
      }
    })
  } catch (error: any) {
    console.error('Error parsing CSV:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to parse CSV' },
      { status: 400 }
    )
  }
}