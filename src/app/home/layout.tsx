import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { BottomNav } from '@/components/bottom-nav'
import { syncUserToSupabase } from '@/lib/sync-user'
import { createServiceClient } from '@/lib/supabase/service'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()
  if (user) {
    await syncUserToSupabase(user)

    // Check if user needs onboarding (household has no invite_code = not set up)
    const supabase = createServiceClient()
    const { data: userData } = await supabase
      .from('users')
      .select('household_id')
      .eq('id', user.id)
      .single()

    if (userData?.household_id) {
      const { data: household } = await supabase
        .from('households')
        .select('invite_code')
        .eq('id', userData.household_id)
        .single()

      // If no invite_code, household wasn't set up - needs onboarding
      if (household && !household.invite_code) {
        redirect('/onboarding')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {children}
      <BottomNav />
    </div>
  )
}
