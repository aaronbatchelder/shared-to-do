'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { GroceryItem as GroceryItemType } from '@/lib/supabase/types'
import { TrashIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface GroceryItemProps {
  item: GroceryItemType
  onToggle: (id: string, checked: boolean, userId?: string) => void
  onDelete: (id: string) => void
  checkedByName?: string
}

export function GroceryItem({ item, onToggle, onDelete, checkedByName }: GroceryItemProps) {
  const { user } = useUser()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(item.id)
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 bg-white border border-zinc-100 rounded-xl transition-all shadow-sm',
        item.checked && 'bg-zinc-50/50 opacity-50'
      )}
    >
      <button
        onClick={() => onToggle(item.id, !item.checked, user?.id)}
        className={cn(
          'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0',
          item.checked
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-zinc-300 hover:border-emerald-500 hover:bg-emerald-50'
        )}
      >
        {item.checked && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium text-zinc-800', item.checked && 'line-through text-zinc-400')}>
          {item.name}
          {item.quantity && (
            <span className="text-zinc-400 font-normal ml-1">
              ({item.quantity}{item.unit && ` ${item.unit}`})
            </span>
          )}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {item.store && (
            <span className="text-xs text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">{item.store}</span>
          )}
          {item.checked && checkedByName && (
            <span className="text-xs text-emerald-600">{checkedByName}</span>
          )}
        </div>
      </div>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 text-zinc-300 hover:text-red-500 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  )
}
