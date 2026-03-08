'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

function JoinContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  const inviteCode = searchParams.get('invite')

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      router.push(`/sign-up${inviteCode ? `?invite=${inviteCode}` : ''}`)
      return
    }

    const syncWithInvite = async () => {
      try {
        const res = await fetch('/api/auth/sync-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inviteCode }),
        })

        if (!res.ok) {
          throw new Error('Failed to join household')
        }

        setStatus('success')
        setMessage('Successfully joined household!')

        // Redirect to home after a brief delay
        setTimeout(() => {
          router.push('/home')
        }, 1500)
      } catch {
        setStatus('error')
        setMessage('Failed to join household. The invite code may be invalid.')

        // Redirect to home anyway after showing error
        setTimeout(() => {
          router.push('/home')
        }, 3000)
      }
    }

    syncWithInvite()
  }, [user, isLoaded, inviteCode, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-emerald-600 mb-4">Sunday Runs</h1>

        {status === 'loading' && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-600 border-t-transparent mx-auto" />
            <p className="text-zinc-600">Joining household...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <p className="text-emerald-700 font-medium">{message}</p>
            <p className="text-emerald-600 text-sm mt-2">Redirecting to home...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-700 font-medium">{message}</p>
            <p className="text-red-600 text-sm mt-2">Redirecting to home...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function JoinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 border-t-transparent" />
      </div>
    }>
      <JoinContent />
    </Suspense>
  )
}
