'use client'

import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AddErrandProps {
  onAdd: (title: string, store?: string) => Promise<void>
}

export function AddErrand({ onAdd }: AddErrandProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [store, setStore] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    await onAdd(title.trim(), store || undefined)
    setTitle('')
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
        Add errand
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 space-y-3">
      <Input
        autoFocus
        placeholder="Errand description"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Input
        placeholder="Location (optional)"
        value={store}
        onChange={(e) => setStore(e.target.value)}
      />

      <div className="flex gap-2">
        <Button type="submit" disabled={loading || !title.trim()}>
          {loading ? 'Adding...' : 'Add'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setIsOpen(false)
            setTitle('')
            setStore('')
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
