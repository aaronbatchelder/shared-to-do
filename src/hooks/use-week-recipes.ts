'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Recipe } from '@/lib/supabase/types'

export function useWeekRecipes(weekId: string | null) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchRecipes = useCallback(async () => {
    if (!weekId) return

    const { data, error } = await supabase
      .from('week_recipes')
      .select('recipe_id, recipes(*)')
      .eq('week_id', weekId)

    if (!error && data) {
      setRecipes(data.map((wr: any) => wr.recipes))
    }
    setLoading(false)
  }, [weekId, supabase])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  const addRecipeToWeek = async (recipeId: string) => {
    if (!weekId) return

    const { error: linkError } = await supabase.from('week_recipes').insert({
      week_id: weekId,
      recipe_id: recipeId,
    })

    if (linkError) {
      console.error('Error adding recipe to week:', linkError)
      return
    }

    const { data: recipe } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single()

    if (!recipe) return

    for (const ingredient of recipe.ingredients) {
      await supabase.from('grocery_items').insert({
        week_id: weekId,
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        recipe_id: recipeId,
      })
    }

    fetchRecipes()
  }

  const removeRecipeFromWeek = async (recipeId: string) => {
    if (!weekId) return

    await supabase
      .from('week_recipes')
      .delete()
      .eq('week_id', weekId)
      .eq('recipe_id', recipeId)

    await supabase
      .from('grocery_items')
      .delete()
      .eq('week_id', weekId)
      .eq('recipe_id', recipeId)

    fetchRecipes()
  }

  return { recipes, loading, addRecipeToWeek, removeRecipeFromWeek, refetch: fetchRecipes }
}
