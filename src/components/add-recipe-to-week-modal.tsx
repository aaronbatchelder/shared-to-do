'use client'

import { Recipe } from '@/lib/supabase/types'
import { XMarkIcon, PlusIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface AddRecipeToWeekModalProps {
  recipes: Recipe[]
  onSelect: (recipeId: string) => void
  onClose: () => void
}

export function AddRecipeToWeekModal({ recipes, onSelect, onClose }: AddRecipeToWeekModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-[#FFFBF7] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#FEE4D6]">
          <h2 className="text-lg font-semibold text-[#2D2A26]">Add Recipe to Week</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#FEE4D6] rounded-lg transition-colors">
            <XMarkIcon className="w-5 h-5 text-[#8B8680]" />
          </button>
        </div>

        <div className="overflow-auto max-h-[60vh] p-4">
          {/* Add New Recipe Option */}
          <Link
            href="/home/recipes/add"
            className="flex items-center gap-3 p-4 mb-4 bg-[#F97066] hover:bg-[#E85A50] text-white rounded-xl transition-colors"
          >
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <PlusIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium">Add New Recipe</p>
              <p className="text-sm text-white/80">From URL, photo, or manual entry</p>
            </div>
          </Link>

          {/* Library Section */}
          {recipes.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <BookOpenIcon className="w-4 h-4 text-[#8B8680]" />
                <span className="text-sm font-medium text-[#8B8680] uppercase tracking-wide">
                  From Your Library
                </span>
              </div>
              <div className="space-y-2">
                {recipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => onSelect(recipe.id)}
                    className="w-full p-3 bg-white border border-[#FEE4D6] hover:bg-[#FEE4D6]/50 hover:border-[#F97066] rounded-xl text-left transition-colors"
                  >
                    <p className="font-medium text-[#2D2A26]">{recipe.title}</p>
                    <p className="text-sm text-[#8B8680]">
                      {recipe.ingredients.length} ingredient{recipe.ingredients.length !== 1 ? 's' : ''}
                    </p>
                  </button>
                ))}
              </div>
            </>
          )}

          {recipes.length === 0 && (
            <p className="text-center text-[#8B8680] text-sm py-2">
              Your recipe library is empty. Add your first recipe above!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
