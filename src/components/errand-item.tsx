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
        'flex items-center gap-3 p-3 bg-white border border-[#FEE4D6] rounded-xl transition-all shadow-sm group',
        errand.checked && 'bg-[#F5EDE6]/50 opacity-60'
      )}
    >
      <button
        onClick={() => onToggle(errand.id, !errand.checked, user?.id)}
        className={cn(
          'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
          errand.checked
            ? 'bg-[#9CB686] border-[#9CB686] text-white'
            : 'border-[#FEC6A1] hover:border-[#F97066] hover:bg-[#FEE4D6]'
        )}
      >
        {errand.checked && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium text-[#2D2A26]', errand.checked && 'line-through text-[#8B8680]')}>
          {errand.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {errand.store && (
            <span className="text-xs text-[#8B8680] bg-[#FEE4D6] px-1.5 py-0.5 rounded">{errand.store}</span>
          )}
          {errand.checked && checkedByName && (
            <span className="text-xs text-[#9CB686] font-medium">{checkedByName}</span>
          )}
        </div>
      </div>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 text-[#FEC6A1] hover:text-[#F97066] transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  )
}
