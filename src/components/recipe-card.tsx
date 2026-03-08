'use client'

import { Recipe } from '@/lib/supabase/types'
import { TrashIcon, LinkIcon, PhotoIcon } from '@heroicons/react/24/outline'

interface RecipeCardProps {
  recipe: Recipe
  onDelete: (id: string) => void
  onAddToWeek?: (recipeId: string) => void
}

export function RecipeCard({ recipe, onDelete, onAddToWeek }: RecipeCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#FEE4D6] overflow-hidden shadow-sm">
      {recipe.source_image_url ? (
        <img
          src={recipe.source_image_url}
          alt={recipe.title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-[#FEE4D6]/50 flex items-center justify-center">
          <PhotoIcon className="w-12 h-12 text-[#FEC6A1]" />
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-[#2D2A26]">{recipe.title}</h3>

        <p className="text-sm text-[#8B8680] mb-3">
          {recipe.ingredients.length} ingredients
        </p>

        {recipe.source_url && (
          <a
            href={recipe.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#F97066] hover:text-[#E85A50] flex items-center gap-1 mb-3"
          >
            <LinkIcon className="w-4 h-4" />
            View original
          </a>
        )}

        <div className="flex gap-2">
          {onAddToWeek && (
            <button
              onClick={() => onAddToWeek(recipe.id)}
              className="flex-1 py-2 bg-[#F97066] text-white rounded-xl hover:bg-[#E85A50] transition-colors text-sm font-medium"
            >
              Add to Week
            </button>
          )}
          <button
            onClick={() => onDelete(recipe.id)}
            className="p-2 text-[#FEC6A1] hover:text-red-500 transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
