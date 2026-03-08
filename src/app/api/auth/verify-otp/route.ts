import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { method, identifier, otp } = await request.json()

    if (!method || !identifier || !otp) {
      return NextResponse.json(
        { error: 'Method, identifier, and OTP are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    if (method === 'email') {
      const { data, error } = await supabase.auth.verifyOtp({
        email: identifier,
        token: otp,
        type: 'email',
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      await ensureUserHasHousehold(supabase, data.user!.id, identifier, 'email')
    } else {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: identifier,
        token: otp,
        type: 'sms',
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      await ensureUserHasHousehold(supabase, data.user!.id, identifier, 'phone')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    )
  }
}

async function ensureUserHasHousehold(
  supabase: any,
  userId: string,
  identifier: string,
  method: 'email' | 'phone'
) {
  const { data: existingUser } = await supabase
    .from('users')
    .select('id, household_id')
    .eq('id', userId)
    .single()

  if (!existingUser) {
    const { data: household } = await supabase
      .from('households')
      .insert({ name: 'My Household' })
      .select()
      .single()

    await supabase.from('users').insert({
      id: userId,
      [method]: identifier,
      household_id: household.id,
    })
  }
}
