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
            className="flex items-center gap-2 bg-[#FEE4D6] text-[#E85A50] px-3 py-1.5 rounded-full"
          >
            <span className="text-sm font-medium">{recipe.title}</span>
            <button
              onClick={() => onRemoveRecipe(recipe.id)}
              className="hover:text-[#F97066]"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 border border-dashed border-[#FEC6A1] text-[#8B8680] rounded-full hover:border-[#F97066] hover:text-[#F97066] transition-colors"
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
