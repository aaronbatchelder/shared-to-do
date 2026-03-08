'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { formatWeekRange, isCurrentWeek } from '@/lib/utils/date'

interface WeekNavProps {
  weekStart: Date
  onPrevWeek: () => void
  onNextWeek: () => void
  onToday: () => void
}

export function WeekNav({ weekStart, onPrevWeek, onNextWeek, onToday }: WeekNavProps) {
  const isCurrent = isCurrentWeek(weekStart)

  return (
    <div className="flex items-center justify-between bg-white border-b px-4 py-3">
      <button
        onClick={onPrevWeek}
        className="p-2 hover:bg-gray-100 rounded-lg"
        aria-label="Previous week"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3">
        <span className="font-semibold text-lg">
          {formatWeekRange(weekStart)}
        </span>
        {!isCurrent && (
          <button
            onClick={onToday}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Today
          </button>
        )}
      </div>

      <button
        onClick={onNextWeek}
        className="p-2 hover:bg-gray-100 rounded-lg"
        aria-label="Next week"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  )
}
