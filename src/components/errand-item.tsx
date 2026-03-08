'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Errand } from '@/lib/supabase/types'
import { TrashIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface ErrandItemProps {
  errand: Errand
  onToggle: (id: string, checked: boolean, userId?: string) => void
  onDelete: (id: string) => void
  checkedByName?: string
}

export function ErrandItem({ errand, onToggle, onDelete, checkedByName }: ErrandItemProps) {
  const { user } = useUser()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(errand.id)
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 bg-white border rounded-lg transition-all',
        errand.checked && 'bg-gray-50 opacity-60'
      )}
    >
      <button
        onClick={() => onToggle(errand.id, !errand.checked, user?.id)}
        className={cn(
          'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0',
          errand.checked
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-gray-300 hover:border-emerald-500'
        )}
      >
        {errand.checked && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn('font-medium', errand.checked && 'line-through text-gray-500')}>
          {errand.title}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {errand.store && (
            <span className="bg-gray-100 px-2 py-0.5 rounded">{errand.store}</span>
          )}
          {errand.checked && checkedByName && (
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
