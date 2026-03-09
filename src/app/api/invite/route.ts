import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: Request) {
  try {
    const { email, inviteUrl, householdName, inviterName } = await request.json()

    if (!email || !inviteUrl) {
      return NextResponse.json({ error: 'Email and invite URL required' }, { status: 400 })
    }

    // If Resend is not configured, just return success (invite link still works via settings)
    if (!resend) {
      console.log('Resend not configured, skipping email. Invite URL:', inviteUrl)
      return NextResponse.json({ success: true, message: 'Email skipped (no API key)' })
    }

    await resend.emails.send({
      from: 'Sunday Run <noreply@thesundayrun.com>',
      to: email,
      subject: `${inviterName} invited you to join ${householdName} on Sunday Run`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FFFBF7; margin: 0; padding: 40px 20px;">
            <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <div style="background: linear-gradient(135deg, #F97066 0%, #FEC6A1 100%); padding: 32px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Sunday Run</h1>
              </div>
              <div style="padding: 32px;">
                <h2 style="color: #2D2A26; margin: 0 0 16px; font-size: 20px;">You're invited!</h2>
                <p style="color: #4A4640; line-height: 1.6; margin: 0 0 24px;">
                  ${inviterName} has invited you to join <strong>${householdName}</strong> on Sunday Run — the app that makes grocery planning together a breeze.
                </p>
                <a href="${inviteUrl}" style="display: inline-block; background: #F97066; color: white; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  Join Household
                </a>
                <p style="color: #8B8680; font-size: 14px; margin: 24px 0 0; line-height: 1.5;">
                  Or copy this link:<br>
                  <a href="${inviteUrl}" style="color: #F97066; word-break: break-all;">${inviteUrl}</a>
                </p>
              </div>
              <div style="padding: 20px 32px; background: #FEE4D6; text-align: center;">
                <p style="color: #8B8680; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} Sunday Run
                </p>
              </div>
            </div>
          </body>
        </html>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending invite:', error)
    return NextResponse.json({ error: 'Failed to send invite' }, { status: 500 })
  }
}
