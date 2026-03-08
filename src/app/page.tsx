import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

export default async function Home() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // User is authenticated, show the main app
  // We need to render the authenticated content here or redirect to it
  redirect('/home')
}
