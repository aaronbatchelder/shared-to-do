'use client'

import { Recipe } from '@/lib/supabase/types'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface AddRecipeToWeekModalProps {
  recipes: Recipe[]
  onSelect: (recipeId: string) => void
  onClose: () => void
}

export function AddRecipeToWeekModal({ recipes, onSelect, onClose }: AddRecipeToWeekModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Add Recipe to Week</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-auto max-h-[60vh] p-4">
          {recipes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No recipes in your library yet.</p>
              <Link
                href="/recipes/add"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Add your first recipe
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => onSelect(recipe.id)}
                  className="w-full p-3 bg-gray-50 hover:bg-emerald-50 rounded-lg text-left transition-colors"
                >
                  <p className="font-medium">{recipe.title}</p>
                  <p className="text-sm text-gray-500">
                    {recipe.ingredients.length} ingredients
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
