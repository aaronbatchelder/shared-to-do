'use client'

import { useState } from 'react'
import { GroceryItem as GroceryItemType } from '@/lib/supabase/types'
import { TrashIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface GroceryItemProps {
  item: GroceryItemType
  onToggle: (id: string, checked: boolean) => void
  onDelete: (id: string) => void
  checkedByName?: string
}

export function GroceryItem({ item, onToggle, onDelete, checkedByName }: GroceryItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(item.id)
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 bg-white border rounded-lg transition-all',
        item.checked && 'bg-gray-50 opacity-60'
      )}
    >
      <button
        onClick={() => onToggle(item.id, !item.checked)}
        className={cn(
          'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0',
          item.checked
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-gray-300 hover:border-emerald-500'
        )}
      >
        {item.checked && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn('font-medium', item.checked && 'line-through text-gray-500')}>
          {item.name}
          {item.quantity && (
            <span className="text-gray-500 font-normal">
              {' '}({item.quantity}{item.unit && ` ${item.unit}`})
            </span>
          )}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {item.store && (
            <span className="bg-gray-100 px-2 py-0.5 rounded">{item.store}</span>
          )}
          {item.checked && checkedByName && (
            <span className="text-emerald-600">✓ {checkedByName}</span>
          )}
        </div>
      </div>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  )
}
