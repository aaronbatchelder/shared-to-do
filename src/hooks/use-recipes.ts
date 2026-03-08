'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Recipe } from '@/lib/supabase/types'

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchRecipes = useCallback(async () => {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return

    const { data: userData } = await supabase
      .from('users')
      .select('household_id')
      .eq('id', user.user.id)
      .single()

    if (!userData?.household_id) return

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('household_id', userData.household_id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setRecipes(data)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  const deleteRecipe = async (recipeId: string) => {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId)

    if (!error) {
      setRecipes((prev) => prev.filter((r) => r.id !== recipeId))
    }
  }

  return { recipes, loading, deleteRecipe, refetch: fetchRecipes }
}
