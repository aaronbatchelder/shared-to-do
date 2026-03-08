import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  // If user is already logged in, redirect to home
  if (userId) {
    redirect('/home')
  }

  return <>{children}</>
}
