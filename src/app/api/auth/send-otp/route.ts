import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { method, identifier } = await request.json()

    if (!method || !identifier) {
      return NextResponse.json(
        { error: 'Method and identifier are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    if (method === 'email') {
      const { error } = await supabase.auth.signInWithOtp({
        email: identifier,
        options: {
          shouldCreateUser: true,
        },
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        phone: identifier,
        options: {
          shouldCreateUser: true,
        },
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    )
  }
}
