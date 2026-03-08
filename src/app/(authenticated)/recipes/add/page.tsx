'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, LinkIcon, CameraIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { Ingredient } from '@/lib/supabase/types'

type AddMethod = 'url' | 'photo' | 'manual' | null

export default function AddRecipePage() {
  const router = useRouter()
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

      if (!res.ok) throw new Error('Failed to extract recipe')

      const data = await res.json()
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
      const supabase = createClient()
      const { data: user } = await supabase.auth.getUser()

      const { data: userData } = await supabase
        .from('users')
        .select('household_id')
        .eq('id', user.user!.id)
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

      router.push('/recipes')
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
      <div className="flex flex-col h-screen">
        <header className="bg-emerald-600 text-white px-4 py-3 flex items-center gap-3">
          <Link href="/recipes" className="p-1 hover:bg-emerald-700 rounded">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Add Recipe</h1>
        </header>

        <main className="flex-1 p-4">
          <p className="text-gray-600 mb-6">How would you like to add a recipe?</p>

          <div className="space-y-3">
            <button
              onClick={() => setMethod('url')}
              className="w-full p-4 bg-white border rounded-lg flex items-center gap-4 hover:border-emerald-500 transition-colors"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <LinkIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="font-medium">From URL</p>
                <p className="text-sm text-gray-500">Paste a recipe link</p>
              </div>
            </button>

            <button
              onClick={() => setMethod('photo')}
              className="w-full p-4 bg-white border rounded-lg flex items-center gap-4 hover:border-emerald-500 transition-colors"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CameraIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="font-medium">From Photo</p>
                <p className="text-sm text-gray-500">Snap a cookbook page</p>
              </div>
            </button>

            <button
              onClick={() => setMethod('manual')}
              className="w-full p-4 bg-white border rounded-lg flex items-center gap-4 hover:border-emerald-500 transition-colors"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <PencilIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="font-medium">Manual Entry</p>
                <p className="text-sm text-gray-500">Type it yourself</p>
              </div>
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (method === 'url' && !title) {
    return (
      <div className="flex flex-col h-screen">
        <header className="bg-emerald-600 text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMethod(null)} className="p-1 hover:bg-emerald-700 rounded">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Add from URL</h1>
        </header>

        <main className="flex-1 p-4">
          <div className="space-y-4">
            <Input
              placeholder="https://example.com/recipe"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button onClick={handleExtractFromUrl} disabled={loading || !url} className="w-full">
              {loading ? 'Extracting...' : 'Extract Recipe'}
            </Button>
          </div>
        </main>
      </div>
    )
  }

  if (method === 'photo' && !title) {
    return (
      <div className="flex flex-col h-screen">
        <header className="bg-emerald-600 text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMethod(null)} className="p-1 hover:bg-emerald-700 rounded">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Add from Photo</h1>
        </header>

        <main className="flex-1 p-4">
          <div className="space-y-4">
            <label className="block">
              <div className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-emerald-500 transition-colors">
                <CameraIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">Tap to take or upload a photo</p>
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
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-emerald-600 text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => setMethod(null)} className="p-1 hover:bg-emerald-700 rounded">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">
          {sourceUrl ? 'Edit Recipe' : 'Add Recipe'}
        </h1>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipe Name
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Grandma's Lasagna"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients
            </label>
            <div className="space-y-2">
              {ingredients.map((ing, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Ingredient name"
                    value={ing.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Qty"
                    type="number"
                    value={ing.quantity || ''}
                    onChange={(e) => updateIngredient(index, 'quantity', e.target.value ? Number(e.target.value) : null)}
                    className="w-20"
                  />
                  <Input
                    placeholder="Unit"
                    value={ing.unit || ''}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value || null)}
                    className="w-20"
                  />
                  <button
                    onClick={() => removeIngredient(index)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                onClick={addIngredient}
                className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                Add ingredient
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructions (optional)
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="How to make this recipe..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[120px]"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? 'Saving...' : 'Save Recipe'}
          </Button>
        </div>
      </main>
    </div>
  )
}
