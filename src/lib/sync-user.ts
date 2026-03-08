import { createServiceClient } from '@/lib/supabase/service'
import type { User } from '@clerk/nextjs/server'

export async function syncUserToSupabase(clerkUser: User, inviteCode?: string) {
  const supabase = createServiceClient()

  const email = clerkUser.emailAddresses[0]?.emailAddress
  const phone = clerkUser.phoneNumbers[0]?.phoneNumber
  const displayName = clerkUser.firstName
    ? `${clerkUser.firstName}${clerkUser.lastName ? ' ' + clerkUser.lastName : ''}`
    : email || phone || 'User'

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id, household_id')
    .eq('id', clerkUser.id)
    .single()

  if (existingUser) {
    // Update existing user
    await supabase
      .from('users')
      .update({
        email,
        phone,
        display_name: displayName,
      })
      .eq('id', clerkUser.id)
    return { householdId: existingUser.household_id }
  }

  let householdId: string | null = null

  // Check if there's an invite code to join existing household
  if (inviteCode) {
    const { data: existingHousehold } = await supabase
      .from('households')
      .select('id')
      .eq('invite_code', inviteCode.toUpperCase())
      .single()

    if (existingHousehold) {
      householdId = existingHousehold.id
    }
  }

  // If no invite code or invalid code, create new household
  if (!householdId) {
    const { data: household } = await supabase
      .from('households')
      .insert({ name: `${displayName}'s Household` })
      .select()
      .single()

    if (!household) {
      console.error('Failed to create household')
      return { householdId: null }
    }
    householdId = household.id
  }

  // Create user with household
  await supabase.from('users').insert({
    id: clerkUser.id,
    email,
    phone,
    display_name: displayName,
    household_id: householdId,
  })

  return { householdId }
}
