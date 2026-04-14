import { NextResponse } from 'next/server'
import { getSettings, saveSettings, defaultSettings } from '@/lib/admin-settings'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    saveSettings(body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in admin settings API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const settings = getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error in admin settings GET API:', error)
    return NextResponse.json(defaultSettings)
  }
}
