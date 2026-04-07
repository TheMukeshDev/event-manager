import { NextResponse } from 'next/server'
import { createAmbassadorApplication } from '@/lib/ambassador-service'

export async function POST(request: Request) {
  const body = await request.json()

  if (
    !body?.full_name ||
    !body?.email ||
    !body?.phone ||
    !body?.college_name ||
    !body?.branch ||
    !body?.why_fit_for_role ||
    body?.consent !== true
  ) {
    return NextResponse.json(
      {
        success: false,
        message: 'Missing required ambassador application fields or consent was not provided.',
      },
      { status: 400 }
    )
  }

  try {
    const application = await createAmbassadorApplication({
      full_name: body.full_name,
      phone: body.phone,
      email: body.email,
      college_name: body.college_name,
      branch: body.branch,
      section: body.section || '',
      year_or_semester: body.year_or_semester || '',
      city: body.city || '',
      state: body.state || '',
      why_fit_for_role: body.why_fit_for_role,
      prior_experience: body.prior_experience || '',
      social_profile_link: body.social_profile_link || '',
      whatsapp_number: body.whatsapp_number || '',
      consent: true,
    })

    return NextResponse.json({ success: true, data: application })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit ambassador application.',
      },
      { status: 500 }
    )
  }
}
