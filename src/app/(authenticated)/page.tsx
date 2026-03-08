'use client'

import { useState, useEffect } from 'react'
import { WeekNav } from '@/components/week-nav'
import { GroceryList } from '@/components/grocery-list'
import { ErrandsList } from '@/components/errands-list'
import { WeekRecipes } from '@/components/week-recipes'
import { getWeekStart, getNextWeek, getPrevWeek, formatDateForDb } from '@/lib/utils/date'
import { createClient } from '@/lib/supabase/client'
import { useWeekRecipes } from '@/hooks/use-week-recipes'
import { useRecipes } from '@/hooks/use-recipes'

export default function HomePage() {
  const [weekStart, setWeekStart] = useState(() => getWeekStart())
  const [weekId, setWeekId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [userNames, setUserNames] = useState<Record<string, string>>({})

  const { recipes: weekRecipes, addRecipeToWeek, removeRecipeFromWeek } = useWeekRecipes(weekId)
  const { recipes: allRecipes } = useRecipes()

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

      let { data: week } = await supabase
        .from('weeks')
        .select('id')
        .eq('household_id', userData.household_id)
        .eq('start_date', startDate)
        .single()

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

      // Fetch household users for "checked by" display
      const { data: users } = await supabase
        .from('users')
        .select('id, display_name, email, phone')
        .eq('household_id', userData.household_id)

      if (users) {
        const names: Record<string, string> = {}
        users.forEach((u) => {
          names[u.id] = u.display_name || u.email || u.phone || 'User'
        })
        setUserNames(names)
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
              <WeekRecipes
                recipes={weekRecipes}
                allRecipes={allRecipes}
                onAddRecipe={addRecipeToWeek}
                onRemoveRecipe={removeRecipeFromWeek}
              />
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Grocery List</h2>
              <GroceryList weekId={weekId} userNames={userNames} />
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Errands</h2>
              <ErrandsList weekId={weekId} userNames={userNames} />
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
