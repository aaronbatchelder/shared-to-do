'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/logo'
import { createClient } from '@/lib/supabase/client'
import { EnvelopeIcon, UserPlusIcon } from '@heroicons/react/24/outline'

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useUser()
  const [householdName, setHouseholdName] = useState('')
  const [partnerEmail, setPartnerEmail] = useState('')
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

      const inviteCode = generateInviteCode()

      // Update household name and mark as onboarded
      const { error: updateError } = await supabase
        .from('households')
        .update({
          name: householdName.trim(),
          invite_code: inviteCode
        })
        .eq('id', userData.household_id)

      if (updateError) throw updateError

      // If partner email provided, send invite
      if (partnerEmail.trim()) {
        const inviteUrl = `${window.location.origin}/sign-up?invite=${inviteCode}`

        // Send invite email via API
        await fetch('/api/invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: partnerEmail.trim(),
            inviteUrl,
            householdName: householdName.trim(),
            inviterName: user.firstName || 'Your partner'
          })
        })
      }

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
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF7] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-2xl font-bold text-[#2D2A26] mt-4">Welcome!</h1>
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
            </div>

            <div className="pt-2 border-t border-[#FEE4D6]">
              <div className="flex items-center gap-2 mb-2">
                <UserPlusIcon className="w-4 h-4 text-[#F97066]" />
                <label className="text-sm font-semibold text-[#4A4640]">
                  Invite your partner
                </label>
                <span className="text-xs text-[#8B8680]">(optional)</span>
              </div>
              <div className="relative">
                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B8680]" />
                <Input
                  type="email"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  placeholder="partner@email.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#FEE4D6] focus:outline-none focus:ring-2 focus:ring-[#F97066]/30 focus:border-[#F97066] text-[#2D2A26] placeholder:text-[#8B8680]"
                />
              </div>
              <p className="text-xs text-[#8B8680] mt-2">
                We&apos;ll send them an invite to join your household
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
              {loading ? 'Setting up...' : 'Get Started'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
