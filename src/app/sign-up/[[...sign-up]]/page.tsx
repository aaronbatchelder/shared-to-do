'use client'

import { SignUp } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Logo } from '@/components/logo'

function SignUpContent() {
  const searchParams = useSearchParams()
  const inviteCode = searchParams.get('invite')

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF7] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" className="mb-4" />
          <p className="text-[#8B8680] mt-2">Your weekly grocery ritual</p>
          {inviteCode && (
            <div className="mt-4 p-3 bg-[#FEE4D6] border border-[#FEC6A1] rounded-xl">
              <p className="text-sm text-[#E85A50] font-medium">
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
              card: "shadow-xl rounded-2xl border border-[#FEE4D6]",
              headerTitle: "text-xl font-semibold text-[#2D2A26]",
              primaryButton: "bg-[#F97066] hover:bg-[#E85A50]",
              formButtonPrimary: "bg-[#F97066] hover:bg-[#E85A50]",
              footerActionLink: "text-[#F97066] hover:text-[#E85A50]",
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
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF7]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F97066] border-t-transparent" />
      </div>
    }>
      <SignUpContent />
    </Suspense>
  )
}
