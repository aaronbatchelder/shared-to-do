'use client'

import { useState } from 'react'
import { Recipe } from '@/lib/supabase/types'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AddRecipeToWeekModal } from './add-recipe-to-week-modal'

interface WeekRecipesProps {
  recipes: Recipe[]
  onAddRecipe: (recipeId: string) => Promise<void>
  onRemoveRecipe: (recipeId: string) => Promise<void>
  allRecipes: Recipe[]
}

export function WeekRecipes({ recipes, onAddRecipe, onRemoveRecipe, allRecipes }: WeekRecipesProps) {
  const [showModal, setShowModal] = useState(false)

  const availableRecipes = allRecipes.filter(
    (r) => !recipes.find((wr) => wr.id === r.id)
  )

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full"
          >
            <span className="text-sm font-medium">{recipe.title}</span>
            <button
              onClick={() => onRemoveRecipe(recipe.id)}
              className="hover:text-emerald-900"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-full hover:border-emerald-500 hover:text-emerald-600 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="text-sm">Add Recipe</span>
        </button>
      </div>

      {showModal && (
        <AddRecipeToWeekModal
          recipes={availableRecipes}
          onSelect={async (recipeId) => {
            await onAddRecipe(recipeId)
            setShowModal(false)
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
