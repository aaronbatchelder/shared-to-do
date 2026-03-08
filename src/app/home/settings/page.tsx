'use client'

import { useState, useEffect } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'
import { ArrowLeftIcon, ClipboardIcon, CheckIcon, UserGroupIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface HouseholdMember {
  id: string
  display_name: string | null
  email: string | null
}

export default function SettingsPage() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [householdName, setHouseholdName] = useState('')
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [members, setMembers] = useState<HouseholdMember[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [householdId, setHouseholdId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadHouseholdData()
    }
  }, [user])

  const loadHouseholdData = async () => {
    if (!user) return
    const supabase = createClient()

    // Get user's household
    const { data: userData } = await supabase
      .from('users')
      .select('household_id')
      .eq('id', user.id)
      .single()

    if (!userData?.household_id) {
      setLoading(false)
      return
    }

    setHouseholdId(userData.household_id)

    // Get household details
    const { data: household } = await supabase
      .from('households')
      .select('name, invite_code')
      .eq('id', userData.household_id)
      .single()

    if (household) {
      setHouseholdName(household.name)
      setInviteCode(household.invite_code)
    }

    // Get household members
    const { data: membersData } = await supabase
      .from('users')
      .select('id, display_name, email')
      .eq('household_id', userData.household_id)

    if (membersData) {
      setMembers(membersData)
    }

    setLoading(false)
  }

  const generateInviteCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const handleSave = async () => {
    if (!householdId) return
    setSaving(true)

    const supabase = createClient()
    const newInviteCode = inviteCode || generateInviteCode()

    const { error } = await supabase
      .from('households')
      .update({
        name: householdName,
        invite_code: newInviteCode
      })
      .eq('id', householdId)

    if (!error) {
      setInviteCode(newInviteCode)
    }

    setSaving(false)
  }

  const handleCopyInviteLink = async () => {
    if (!inviteCode) return
    const inviteUrl = `${window.location.origin}/sign-up?invite=${inviteCode}`
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSignOut = () => {
    signOut({ redirectUrl: '/sign-in' })
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-zinc-50">
        <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex items-center gap-3 shadow-sm">
          <Link href="/home" className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold">Settings</h1>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 border-t-transparent" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-50">
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex items-center gap-3 shadow-sm">
        <Link href="/home" className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      <main className="flex-1 overflow-auto p-6 pb-24">
        <div className="max-w-lg space-y-6">
          {/* Household Section */}
          <section className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <UserGroupIcon className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-semibold text-zinc-900">Household</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Household Name
                </label>
                <Input
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  placeholder="My Household"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-zinc-900"
                />
              </div>

              {/* Members List */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Members ({members.length})
                </label>
                <div className="space-y-2">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-700 font-medium text-sm">
                          {(member.display_name || member.email || '?')[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 truncate">
                          {member.display_name || 'No name'}
                        </p>
                        {member.email && (
                          <p className="text-xs text-zinc-500 truncate">{member.email}</p>
                        )}
                      </div>
                      {member.id === user?.id && (
                        <span className="text-xs text-emerald-600 font-medium">You</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Invite Section */}
              <div className="pt-2 border-t border-zinc-100">
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Invite Link
                </label>
                {inviteCode ? (
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-3 bg-zinc-50 rounded-xl text-sm text-zinc-600 font-mono truncate">
                      {`${typeof window !== 'undefined' ? window.location.origin : ''}/sign-up?invite=${inviteCode}`}
                    </div>
                    <button
                      onClick={handleCopyInviteLink}
                      className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                    >
                      {copied ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        <ClipboardIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">
                    Save settings to generate an invite link
                  </p>
                )}
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </section>

          {/* Account Section */}
          <section className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900 mb-4">Account</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-700 font-semibold">
                    {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {user?.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
