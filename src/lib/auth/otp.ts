import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendEmailOtp(email: string, otp: string): Promise<void> {
  await resend.emails.send({
    from: 'Sunday Runs <noreply@yourdomain.com>',
    to: email,
    subject: 'Your Sunday Runs login code',
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
        <h1 style="color: #059669;">Sunday Runs</h1>
        <p>Your login code is:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #059669;">${otp}</p>
        <p style="color: #666;">This code expires in 10 minutes.</p>
      </div>
    `,
  })
}

export async function sendSmsOtp(phone: string, otp: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_PHONE_NUMBER

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: phone,
        From: fromNumber!,
        Body: `Your Sunday Runs code is: ${otp}`,
      }),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to send SMS')
  }
}
