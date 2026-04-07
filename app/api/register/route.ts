import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

async function generateReferralStats(ambassadorId: string) {
  const [{ count: totalCount }, { count: validCount }, settingsResponse] = await Promise.all([
    supabaseServer
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('ambassador_id', ambassadorId),
    supabaseServer
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('ambassador_id', ambassadorId)
      .eq('valid_referral', true),
    supabaseServer
      .from('admin_settings')
      .select('referral_threshold')
      .single(),
  ])

  const totalReferrals = totalCount || 0
  const validReferrals = validCount || 0
  const referralThreshold = settingsResponse.data?.referral_threshold ?? 10
  const rewardEligible = validReferrals >= referralThreshold

  await supabaseServer
    .from('ambassadors')
    .update({
      total_referrals: totalReferrals,
      valid_referral_count: validReferrals,
      reward_eligible: rewardEligible,
      certificate_eligible: rewardEligible,
      goodies_eligible: rewardEligible,
      reward_status: rewardEligible ? 'Qualified Campus Ambassador' : 'Campus Ambassador in Progress',
      updated_at: new Date().toISOString(),
    })
    .eq('id', ambassadorId)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { fullName, email, phone, college, stream, eventId, whatsappJoined, referralCode } = body

  if (!fullName || !email || !phone || !college || !eventId) {
    return NextResponse.json({ success: false, error: 'Missing required registration fields.' }, { status: 400 })
  }

  try {
    // Check if admin settings require WhatsApp join
    const { data: settings } = await supabaseServer
      .from('admin_settings')
      .select('is_whatsapp_join_mandatory')
      .single()

    if (settings?.is_whatsapp_join_mandatory && !whatsappJoined) {
      return NextResponse.json({
        success: false,
        error: 'You must join the WhatsApp community to register for this event.'
      }, { status: 400 })
    }

    const validReferral = !settings?.is_whatsapp_join_mandatory || !!whatsappJoined

    // Create or update user
    const { data: user, error: userError } = await supabaseServer
      .from('users')
      .upsert({
        email,
        full_name: fullName,
        phone,
        college,
        stream: stream || 'Not specified',
      }, {
        onConflict: 'email',
      })
      .select()
      .single()

    if (userError || !user) {
      console.error('User creation/update failed:', userError)
      return NextResponse.json({ success: false, error: 'Unable to create user account.' }, { status: 500 })
    }

    // Check if already registered
    const { data: existingReg } = await supabaseServer
      .from('registrations')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .single()

    if (existingReg) {
      return NextResponse.json({ success: false, error: 'You are already registered for this event.' }, { status: 400 })
    }

    let ambassadorId: string | null = null
    if (referralCode) {
      const ambassadorResponse = await supabaseServer
        .from('ambassadors')
        .select('id')
        .eq('referral_code', referralCode)
        .single()

      ambassadorId = ambassadorResponse.data?.id ?? null
    }

    const { data, error } = await supabaseServer
      .from('registrations')
      .insert([
        {
          user_id: user.id,
          event_id: eventId,
          whatsapp_joined: whatsappJoined || false,
          referral_code: referralCode || null,
          ambassador_id: ambassadorId,
          valid_referral: ambassadorId ? validReferral : false,
          status: 'registered',
        },
      ])
      .select()
      .single()

    if (error || !data) {
      console.error('Registration failed:', error)
      return NextResponse.json({ success: false, error: error?.message || 'Unable to register for the event.' }, { status: 500 })
    }

    if (ambassadorId) {
      await supabaseServer
        .from('ambassador_referrals')
        .insert([
          {
            ambassador_id: ambassadorId,
            referred_email: email,
            referred_name: fullName,
            verified: validReferral,
          },
        ])

      await generateReferralStats(ambassadorId)
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 })
  }
}
