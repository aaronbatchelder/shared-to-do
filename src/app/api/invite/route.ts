import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  try {
    const { email, inviteUrl } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const client = await clerkClient()

    // Use Clerk's invitation API - it sends the email automatically
    await client.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: inviteUrl,
      ignoreExisting: true, // Allow re-inviting existing emails
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending invite:', error)
    // Don't fail the onboarding if invite fails
    return NextResponse.json({ success: true, warning: 'Invite email may not have sent' })
  }
}
