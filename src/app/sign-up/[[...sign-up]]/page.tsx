'use client'

import { SignUp } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SignUpContent() {
  const searchParams = useSearchParams()
  const inviteCode = searchParams.get('invite')

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600">Sunday Runs</h1>
          <p className="text-zinc-600 mt-2">Plan your weekly grocery runs together</p>
          {inviteCode && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-sm text-emerald-700">
                You&apos;ve been invited to join a household!
              </p>
            </div>
          )}
        </div>
        <SignUp
          forceRedirectUrl={inviteCode ? `/join?invite=${inviteCode}` : '/home'}
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg rounded-2xl",
              headerTitle: "text-xl font-semibold",
              primaryButton: "bg-emerald-600 hover:bg-emerald-700",
              formButtonPrimary: "bg-emerald-600 hover:bg-emerald-700",
            }
          }}
        />
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 border-t-transparent" />
      </div>
    }>
      <SignUpContent />
    </Suspense>
  )
}
