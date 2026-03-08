'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { ArrowLeftIcon, LinkIcon, CameraIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { Ingredient } from '@/lib/supabase/types'

type AddMethod = 'url' | 'photo' | 'manual' | null

export default function AddRecipePage() {
  const router = useRouter()
  const { user } = useUser()
  const [method, setMethod] = useState<AddMethod>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [instructions, setInstructions] = useState('')
  const [sourceUrl, setSourceUrl] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleExtractFromUrl = async () => {
    if (!url) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/recipes/extract-from-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to extract recipe')
      }

      if (!data.title || !data.ingredients || data.ingredients.length === 0) {
        throw new Error('Could not extract recipe from this URL. Try a different link.')
      }

      setTitle(data.title)
      setIngredients(data.ingredients)
      setInstructions(data.instructions || '')
      setSourceUrl(url)
      setImageUrl(data.imageUrl)
      setMethod('manual')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract recipe')
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1]

        const res = await fetch('/api/recipes/extract-from-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, mimeType: file.type }),
        })

        if (!res.ok) throw new Error('Failed to extract recipe')

        const data = await res.json()
        setTitle(data.title)
        setIngredients(data.ingredients)
        setInstructions(data.instructions || '')
        setMethod('manual')
        setLoading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract recipe')
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title || ingredients.length === 0) {
      setError('Title and at least one ingredient are required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (!user) throw new Error('Not authenticated')

      const supabase = createClient()

      const { data: userData } = await supabase
        .from('users')
        .select('household_id')
        .eq('id', user.id)
        .single()

      const { error } = await supabase.from('recipes').insert({
        household_id: userData!.household_id,
        title,
        ingredients,
        instructions: instructions || null,
        source_url: sourceUrl,
        source_image_url: imageUrl,
      })

      if (error) throw error

      router.push('/home/recipes')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save recipe')
      setLoading(false)
    }
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: null, unit: null }])
  }

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number | null) => {
    const updated = [...ingredients]
    updated[index] = { ...updated[index], [field]: value }
    setIngredients(updated)
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  if (!method) {
    return (
      <div className="flex flex-col h-screen bg-zinc-50">
        <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex items-center gap-3 shadow-sm">
          <Link href="/home/recipes" className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold">Add Recipe</h1>
        </header>

        <main className="flex-1 p-6">
          <p className="text-zinc-500 text-sm mb-6">How would you like to add a recipe?</p>

          <div className="space-y-3 max-w-md">
            <button
              onClick={() => setMethod('url')}
              className="w-full p-4 bg-white border border-zinc-200 rounded-xl flex items-center gap-4 hover:border-emerald-400 hover:shadow-sm transition-all"
            >
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-zinc-900 text-sm">From URL</p>
                <p className="text-xs text-zinc-500">Paste a recipe link</p>
              </div>
            </button>

            <button
              onClick={() => setMethod('photo')}
              className="w-full p-4 bg-white border border-zinc-200 rounded-xl flex items-center gap-4 hover:border-emerald-400 hover:shadow-sm transition-all"
            >
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CameraIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-zinc-900 text-sm">From Photo</p>
                <p className="text-xs text-zinc-500">Snap a cookbook page</p>
              </div>
            </button>

            <button
              onClick={() => setMethod('manual')}
              className="w-full p-4 bg-white border border-zinc-200 rounded-xl flex items-center gap-4 hover:border-emerald-400 hover:shadow-sm transition-all"
            >
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center">
                <PencilIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-zinc-900 text-sm">Manual Entry</p>
                <p className="text-xs text-zinc-500">Type it yourself</p>
              </div>
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (method === 'url' && !title) {
    return (
      <div className="flex flex-col h-screen bg-zinc-50">
        <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex items-center gap-3 shadow-sm">
          <button onClick={() => setMethod(null)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Add from URL</h1>
        </header>

        <main className="flex-1 p-6">
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Recipe URL
              </label>
              <Input
                placeholder="https://example.com/recipe"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-zinc-900 placeholder:text-zinc-400"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleExtractFromUrl}
              disabled={loading || !url}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Extracting...' : 'Extract Recipe'}
            </Button>
          </div>
        </main>
      </div>
    )
  }

  if (method === 'photo' && !title) {
    return (
      <div className="flex flex-col h-screen bg-zinc-50">
        <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex items-center gap-3 shadow-sm">
          <button onClick={() => setMethod(null)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Add from Photo</h1>
        </header>

        <main className="flex-1 p-6">
          <div className="space-y-4 max-w-md">
            <label className="block cursor-pointer">
              <div className="w-full p-10 border-2 border-dashed border-zinc-300 rounded-2xl text-center hover:border-emerald-500 hover:bg-emerald-50/50 transition-all">
                <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CameraIcon className="w-8 h-8 text-zinc-400" />
                </div>
                <p className="text-zinc-700 font-medium">Tap to take or upload a photo</p>
                <p className="text-zinc-500 text-sm mt-1">Supports JPG, PNG, HEIC</p>
              </div>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>

            {loading && (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="animate-spin rounded-full h-10 w-10 border-3 border-emerald-600 border-t-transparent" />
                <p className="text-zinc-600 text-sm mt-3">Extracting recipe...</p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-50">
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex items-center gap-3 shadow-sm">
        <button onClick={() => setMethod(null)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">
          {sourceUrl ? 'Edit Recipe' : 'Add Recipe'}
        </h1>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-5 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Recipe Name
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Grandma's Lasagna"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-zinc-900 placeholder:text-zinc-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Ingredients
            </label>
            <div className="space-y-2">
              {ingredients.map((ing, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder="Ingredient name"
                    value={ing.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-zinc-900 placeholder:text-zinc-400 text-sm"
                  />
                  <Input
                    placeholder="Qty"
                    type="number"
                    value={ing.quantity || ''}
                    onChange={(e) => updateIngredient(index, 'quantity', e.target.value ? Number(e.target.value) : null)}
                    className="w-16 px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-zinc-900 placeholder:text-zinc-400 text-sm text-center"
                  />
                  <Input
                    placeholder="Unit"
                    value={ing.unit || ''}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value || null)}
                    className="w-20 px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-zinc-900 placeholder:text-zinc-400 text-sm"
                  />
                  <button
                    onClick={() => removeIngredient(index)}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                onClick={addIngredient}
                className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-sm font-medium mt-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add ingredient
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Instructions (optional)
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="How to make this recipe..."
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[120px] text-zinc-900 placeholder:text-zinc-400"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Recipe'}
          </Button>
        </div>
      </main>
    </div>
  )
}
