'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type AuthMethod = 'email' | 'phone'
type AuthStep = 'input' | 'verify'

export default function LoginPage() {
  const [method, setMethod] = useState<AuthMethod>('email')
  const [step, setStep] = useState<AuthStep>('input')
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, identifier }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send code')
      }

      setStep('verify')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, identifier, otp }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Invalid code')
      }

      window.location.href = '/'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-700 mb-2">Sunday Runs</h1>
          <p className="text-gray-600">Plan your week together</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          {step === 'input' ? (
            <>
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setMethod('email')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    method === 'email'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('phone')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    method === 'phone'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Phone
                </button>
              </div>

              <form onSubmit={handleSendOtp}>
                <Input
                  type={method === 'email' ? 'email' : 'tel'}
                  placeholder={method === 'email' ? 'you@example.com' : '+1 (555) 123-4567'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="mb-4"
                />

                {error && (
                  <p className="text-red-500 text-sm mb-4">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Code'}
                </Button>
              </form>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-4 text-center">
                Enter the 6-digit code sent to{' '}
                <span className="font-medium">{identifier}</span>
              </p>

              <form onSubmit={handleVerifyOtp}>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                  className="mb-4 text-center text-2xl tracking-widest"
                />

                {error && (
                  <p className="text-red-500 text-sm mb-4">{error}</p>
                )}

                <Button type="submit" className="w-full mb-3" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify'}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('input')
                    setOtp('')
                    setError(null)
                  }}
                  className="w-full text-gray-500 hover:text-gray-700"
                >
                  Use a different {method}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
