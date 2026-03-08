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
        className="w-full p-3 border border-dashed border-[#FEC6A1] rounded-xl text-[#8B8680] hover:border-[#F97066] hover:text-[#F97066] hover:bg-[#FEE4D6]/50 transition-all flex items-center justify-center gap-2"
      >
        <PlusIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Add item</span>
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#FEE4D6] rounded-xl p-4 space-y-4 shadow-sm">
      <Input
        autoFocus
        placeholder="What do you need?"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border-[#FEE4D6] focus:border-[#F97066] rounded-lg text-[#2D2A26] placeholder:text-[#8B8680]"
      />

      <div className="flex flex-wrap gap-2">
        {STORES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStore(store === s ? '' : s)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              store === s
                ? 'bg-[#F97066] text-white shadow-sm'
                : 'bg-[#FEE4D6] text-[#4A4640] hover:bg-[#FEC6A1]'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" disabled={loading || !name.trim()} className="rounded-lg bg-[#F97066] hover:bg-[#E85A50] text-white">
          {loading ? 'Adding...' : 'Add'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="text-[#8B8680] hover:text-[#4A4640]"
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
