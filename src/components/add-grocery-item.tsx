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
        className="w-full p-3 border border-dashed border-zinc-200 rounded-xl text-zinc-400 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all flex items-center justify-center gap-2"
      >
        <PlusIcon className="w-4 h-4" />
        <span className="text-sm">Add item</span>
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-xl p-4 space-y-4 shadow-sm">
      <Input
        autoFocus
        placeholder="What do you need?"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border-zinc-200 focus:border-emerald-500 rounded-lg"
      />

      <div className="flex flex-wrap gap-2">
        {STORES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStore(store === s ? '' : s)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              store === s
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" disabled={loading || !name.trim()} className="rounded-lg">
          {loading ? 'Adding...' : 'Add'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="text-zinc-500"
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
