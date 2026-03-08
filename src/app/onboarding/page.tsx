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
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF7] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-warm mb-4">
            <span className="text-3xl">🏠</span>
          </div>
          <h1 className="text-3xl font-bold text-[#2D2A26]">Welcome to Sunday Run!</h1>
          <p className="text-[#8B8680] mt-2">Let&apos;s set up your household</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#FEE4D6] p-6 shadow-lg">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#4A4640] mb-2">
                Name your household
              </label>
              <Input
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                placeholder={suggestedName}
                className="w-full px-4 py-3 rounded-xl border border-[#FEE4D6] focus:outline-none focus:ring-2 focus:ring-[#F97066]/30 focus:border-[#F97066] text-[#2D2A26] placeholder:text-[#8B8680]"
                autoFocus
              />
              <p className="text-xs text-[#8B8680] mt-2">
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
              className="w-full py-3 bg-[#F97066] hover:bg-[#E85A50] text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Get Started'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
