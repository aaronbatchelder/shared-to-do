'use client'

import Link from 'next/link'
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useRecipes } from '@/hooks/use-recipes'
import { RecipeCard } from '@/components/recipe-card'

export default function RecipesPage() {
  const { recipes, loading, deleteRecipe } = useRecipes()

  return (
    <div className="flex flex-col h-screen bg-[#FFFBF7]">
      <header className="gradient-warm text-white px-6 py-4 flex items-center gap-3 shadow-lg">
        <Link href="/home" className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold">Recipes</h1>
      </header>

      <main className="flex-1 overflow-auto p-4 pb-24">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#F97066] border-t-transparent" />
          </div>
        ) : (
          <>
            <Link
              href="/home/recipes/add"
              className="mb-4 flex items-center justify-center gap-2 w-full p-4 border border-dashed border-[#FEC6A1] rounded-xl text-[#8B8680] hover:border-[#F97066] hover:text-[#F97066] hover:bg-[#FEE4D6]/50 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              Add Recipe
            </Link>

            {recipes.length === 0 ? (
              <div className="text-center text-[#8B8680] py-8">
                <p>No recipes yet.</p>
                <p className="text-sm">Add your first recipe to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onDelete={deleteRecipe}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
