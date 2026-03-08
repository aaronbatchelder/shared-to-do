'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useUser()
  const [householdName, setHouseholdName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!householdName.trim() || !user) return

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Get user's household
      const { data: userData } = await supabase
        .from('users')
        .select('household_id')
        .eq('id', user.id)
        .single()

      if (!userData?.household_id) {
        throw new Error('No household found')
      }

      // Update household name and mark as onboarded
      const { error: updateError } = await supabase
        .from('households')
        .update({
          name: householdName.trim(),
          invite_code: generateInviteCode()
        })
        .eq('id', userData.household_id)

      if (updateError) throw updateError

      router.push('/home')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create household')
      setLoading(false)
    }
  }

  const generateInviteCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const suggestedName = user?.firstName
    ? `${user.firstName}'s Household`
    : 'My Household'

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600">Welcome to Sunday Runs!</h1>
          <p className="text-zinc-600 mt-2">Let's set up your household</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Name your household
              </label>
              <Input
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                placeholder={suggestedName}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-zinc-900"
                autoFocus
              />
              <p className="text-xs text-zinc-500 mt-2">
                This is what you and your household members will see
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !householdName.trim()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Get Started'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
