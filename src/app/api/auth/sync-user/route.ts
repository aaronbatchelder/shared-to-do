import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { syncUserToSupabase } from '@/lib/sync-user'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { inviteCode } = await request.json()

    const result = await syncUserToSupabase(user, inviteCode)

    return NextResponse.json({ success: true, householdId: result?.householdId })
  } catch (error) {
    console.error('Sync user error:', error)
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 })
  }
}
