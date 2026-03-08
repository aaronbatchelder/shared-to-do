'use client'

import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const STORES = ['Costco', "Trader Joe's", 'Whole Foods', 'Target', 'Other']

interface AddGroceryItemProps {
  onAdd: (name: string, store?: string) => Promise<void>
}

export function AddGroceryItem({ onAdd }: AddGroceryItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [store, setStore] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    await onAdd(name.trim(), store || undefined)
    setName('')
    setStore('')
    setLoading(false)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
      >
        <PlusIcon className="w-5 h-5" />
        Add item
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 space-y-3">
      <Input
        autoFocus
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        {STORES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStore(store === s ? '' : s)}
            className={cn(
              'px-3 py-1 rounded-full text-sm transition-colors',
              store === s
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading || !name.trim()}>
          {loading ? 'Adding...' : 'Add'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setIsOpen(false)
            setName('')
            setStore('')
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
