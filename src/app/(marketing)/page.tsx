'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpenIcon,
  ShoppingCartIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFBF7]/80 backdrop-blur-md border-b border-[#FEE4D6]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-full px-4 py-1.5 shadow-sm">
              <Image
                src="/logo.png"
                alt="Sunday Run"
                width={120}
                height={38}
                priority
                className="h-8 w-auto"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-[#4A4640] hover:text-[#F97066] font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-5 py-2.5 bg-[#F97066] hover:bg-[#E85A50] text-white font-semibold rounded-full transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2D2A26] leading-tight mb-6">
            Your weekly grocery ritual,{' '}
            <span className="text-[#F97066]">together.</span>
          </h1>

          <p className="text-xl text-[#8B8680] max-w-2xl mx-auto mb-10">
            Plan meals, build your list, conquer the store — as a team.
            No more "did you get the milk?" texts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto px-8 py-4 bg-[#F97066] hover:bg-[#E85A50] text-white font-semibold rounded-full text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#FEE4D6] text-[#4A4640] font-semibold rounded-full text-lg transition-colors border border-[#FEE4D6]"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2A26] mb-4">
              Everything you need for stress-free grocery runs
            </h2>
            <p className="text-lg text-[#8B8680] max-w-2xl mx-auto">
              Built for couples and households who want to stay in sync
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#FFFBF7] rounded-2xl p-8 border border-[#FEE4D6]">
              <div className="w-14 h-14 bg-[#FEE4D6] rounded-2xl flex items-center justify-center mb-6">
                <BookOpenIcon className="w-7 h-7 text-[#F97066]" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D2A26] mb-3">
                Plan Recipes Together
              </h3>
              <p className="text-[#8B8680]">
                Add recipes from any URL, snap a photo of a cookbook, or type them in.
                Pick what you're cooking this week and ingredients auto-populate your list.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#FFFBF7] rounded-2xl p-8 border border-[#FEE4D6]">
              <div className="w-14 h-14 bg-[#FEE4D6] rounded-2xl flex items-center justify-center mb-6">
                <ShoppingCartIcon className="w-7 h-7 text-[#F97066]" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D2A26] mb-3">
                Smart Grocery Lists
              </h3>
              <p className="text-[#8B8680]">
                Your list builds itself from recipes. Check items off in real-time,
                synced between you and your partner. Filter by store for efficient trips.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#FFFBF7] rounded-2xl p-8 border border-[#FEE4D6]">
              <div className="w-14 h-14 bg-[#FEE4D6] rounded-2xl flex items-center justify-center mb-6">
                <ClipboardDocumentCheckIcon className="w-7 h-7 text-[#F97066]" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D2A26] mb-3">
                Never Forget Errands
              </h3>
              <p className="text-[#8B8680]">
                Add errands alongside your groceries. See who completed what.
                Everything in one place for your weekly run.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2A26] mb-4">
              How It Works
            </h2>
            <p className="text-lg text-[#8B8680]">
              Get started in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F97066] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <UserGroupIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm font-semibold text-[#F97066] mb-2">Step 1</div>
              <h3 className="text-xl font-semibold text-[#2D2A26] mb-3">
                Create Your Household
              </h3>
              <p className="text-[#8B8680]">
                Sign up and invite your partner with a simple link.
                You're connected in seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F97066] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CalendarDaysIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm font-semibold text-[#F97066] mb-2">Step 2</div>
              <h3 className="text-xl font-semibold text-[#2D2A26] mb-3">
                Plan Your Week
              </h3>
              <p className="text-[#8B8680]">
                Add recipes to your week. The app automatically creates
                your grocery list from ingredients.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F97066] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircleIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm font-semibold text-[#F97066] mb-2">Step 3</div>
              <h3 className="text-xl font-semibold text-[#2D2A26] mb-3">
                Shop Together
              </h3>
              <p className="text-[#8B8680]">
                Hit the store together or divide and conquer.
                Check off items and see progress in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="gradient-warm rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Stop texting grocery lists back and forth
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join hundreds of couples who've made their Sunday runs smoother.
            </p>
            <Link
              href="/sign-up"
              className="inline-block px-8 py-4 bg-white hover:bg-[#FEE4D6] text-[#F97066] font-semibold rounded-full text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#FEE4D6]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-full px-3 py-1 shadow-sm border border-[#FEE4D6]">
              <Image
                src="/logo.png"
                alt="Sunday Run"
                width={100}
                height={32}
                className="h-6 w-auto"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-[#8B8680]">
            <Link href="/sign-in" className="hover:text-[#F97066] transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="hover:text-[#F97066] transition-colors">
              Sign Up
            </Link>
          </div>

          <p className="text-sm text-[#8B8680]">
            © {new Date().getFullYear()} Sunday Run
          </p>
        </div>
      </footer>
    </div>
  )
}
