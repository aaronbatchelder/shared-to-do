'use client'

import { useState, useEffect } from 'react'
import { WeekNav } from '@/components/week-nav'
import { getWeekStart, getNextWeek, getPrevWeek, formatDateForDb } from '@/lib/utils/date'
import { createClient } from '@/lib/supabase/client'

export default function HomePage() {
  const [weekStart, setWeekStart] = useState(() => getWeekStart())
  const [weekId, setWeekId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const handlePrevWeek = () => setWeekStart(getPrevWeek(weekStart))
  const handleNextWeek = () => setWeekStart(getNextWeek(weekStart))
  const handleToday = () => setWeekStart(getWeekStart())

  useEffect(() => {
    async function ensureWeek() {
      setLoading(true)
      const supabase = createClient()
      const { data: user } = await supabase.auth.getUser()

      if (!user.user) return

      const { data: userData } = await supabase
        .from('users')
        .select('household_id')
        .eq('id', user.user.id)
        .single()

      if (!userData?.household_id) return

      const startDate = formatDateForDb(weekStart)

      // Try to get existing week
      let { data: week } = await supabase
        .from('weeks')
        .select('id')
        .eq('household_id', userData.household_id)
        .eq('start_date', startDate)
        .single()

      // Create if doesn't exist
      if (!week) {
        const { data: newWeek } = await supabase
          .from('weeks')
          .insert({
            household_id: userData.household_id,
            start_date: startDate,
          })
          .select('id')
          .single()
        week = newWeek
      }

      setWeekId(week?.id || null)
      setLoading(false)
    }

    ensureWeek()
  }, [weekStart])

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-emerald-600 text-white px-4 py-3">
        <h1 className="text-xl font-bold">Sunday Runs</h1>
      </header>

      <WeekNav
        weekStart={weekStart}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
      />

      <main className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
          </div>
        ) : (
          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3">Recipes This Week</h2>
              <div className="bg-white rounded-lg border p-4 text-center text-gray-500">
                No recipes added yet
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Grocery List</h2>
              <div className="bg-white rounded-lg border p-4 text-center text-gray-500">
                No items yet
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Errands</h2>
              <div className="bg-white rounded-lg border p-4 text-center text-gray-500">
                No errands yet
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
