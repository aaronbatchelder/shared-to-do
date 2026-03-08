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
    <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-[#FEE4D6] px-4 py-3 sticky top-0 z-10">
      <button
        onClick={onPrevWeek}
        className="p-2 hover:bg-[#FEE4D6] rounded-lg text-[#8B8680]"
        aria-label="Previous week"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3">
        <span className="font-semibold text-base text-[#2D2A26]">
          {formatWeekRange(weekStart)}
        </span>
        {!isCurrent && (
          <button
            onClick={onToday}
            className="text-xs text-[#F97066] hover:text-[#E85A50] font-semibold px-2 py-1 bg-[#FEE4D6] rounded-md"
          >
            Today
          </button>
        )}
      </div>

      <button
        onClick={onNextWeek}
        className="p-2 hover:bg-[#FEE4D6] rounded-lg text-[#8B8680]"
        aria-label="Next week"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  )
}
