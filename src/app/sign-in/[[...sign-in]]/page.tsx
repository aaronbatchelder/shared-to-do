import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF7] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-warm mb-4">
            <span className="text-2xl">🌅</span>
          </div>
          <h1 className="text-3xl font-bold text-[#F97066]">Sunday Run</h1>
          <p className="text-[#8B8680] mt-2">Your weekly grocery ritual</p>
        </div>
        <SignIn
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
