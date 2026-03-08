'use client'

import { useErrands } from '@/hooks/use-errands'
import { ErrandItem } from '@/components/errand-item'
import { AddErrand } from '@/components/add-errand'

interface ErrandsListProps {
  weekId: string | null
  userNames: Record<string, string>
}

export function ErrandsList({ weekId, userNames }: ErrandsListProps) {
  const { errands, loading, addErrand, toggleErrand, deleteErrand } = useErrands(weekId)

  const uncheckedErrands = errands.filter((e) => !e.checked)
  const checkedErrands = errands.filter((e) => e.checked)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#F97066] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {uncheckedErrands.map((errand) => (
        <ErrandItem
          key={errand.id}
          errand={errand}
          onToggle={toggleErrand}
          onDelete={deleteErrand}
          checkedByName={userNames[errand.checked_by_user_id || '']}
        />
      ))}

      <AddErrand onAdd={addErrand} />

      {checkedErrands.length > 0 && (
        <>
          <div className="text-xs font-medium text-[#8B8680] uppercase tracking-wide pt-6 pb-2">
            Completed ({checkedErrands.length})
          </div>
          {checkedErrands.map((errand) => (
            <ErrandItem
              key={errand.id}
              errand={errand}
              onToggle={toggleErrand}
              onDelete={deleteErrand}
              checkedByName={userNames[errand.checked_by_user_id || '']}
            />
          ))}
        </>
      )}

      {errands.length === 0 && (
        <p className="text-center text-[#8B8680] py-4">
          No errands yet. Add your first errand above.
        </p>
      )}
    </div>
  )
}
