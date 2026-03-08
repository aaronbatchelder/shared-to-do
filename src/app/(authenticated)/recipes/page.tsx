'use client'

import Link from 'next/link'
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useRecipes } from '@/hooks/use-recipes'
import { RecipeCard } from '@/components/recipe-card'

export default function RecipesPage() {
  const { recipes, loading, deleteRecipe } = useRecipes()

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-emerald-600 text-white px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-1 hover:bg-emerald-700 rounded">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">Recipes</h1>
      </header>

      <main className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
          </div>
        ) : (
          <>
            <Link
              href="/recipes/add"
              className="mb-4 flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Recipe
            </Link>

            {recipes.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
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
