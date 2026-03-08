import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600">Sunday Runs</h1>
          <p className="text-gray-600 mt-2">Plan your weekly grocery runs together</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg",
              headerTitle: "text-xl font-semibold",
              primaryButton: "bg-emerald-600 hover:bg-emerald-700",
            }
          }}
        />
      </div>
    </div>
  )
}
