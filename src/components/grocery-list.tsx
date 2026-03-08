'use client'

import { useState } from 'react'
import { useGroceryItems } from '@/hooks/use-grocery-items'
import { GroceryItem } from '@/components/grocery-item'
import { AddGroceryItem } from '@/components/add-grocery-item'

const STORES = ['All', 'Costco', "Trader Joe's", 'Whole Foods', 'Target', 'Other', 'Unassigned']

interface GroceryListProps {
  weekId: string | null
  userNames: Record<string, string>
}

export function GroceryList({ weekId, userNames }: GroceryListProps) {
  const { items, loading, addItem, toggleItem, deleteItem } = useGroceryItems(weekId)
  const [storeFilter, setStoreFilter] = useState('All')

  const filteredItems = items.filter((item) => {
    if (storeFilter === 'All') return true
    if (storeFilter === 'Unassigned') return !item.store
    return item.store === storeFilter
  })

  const uncheckedItems = filteredItems.filter((item) => !item.checked)
  const checkedItems = filteredItems.filter((item) => item.checked)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#F97066] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {STORES.map((store) => (
          <button
            key={store}
            onClick={() => setStoreFilter(store)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              storeFilter === store
                ? 'bg-[#F97066] text-white shadow-sm'
                : 'bg-white text-[#4A4640] hover:bg-[#FEE4D6] border border-[#FEE4D6]'
            }`}
          >
            {store}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {uncheckedItems.map((item) => (
          <GroceryItem
            key={item.id}
            item={item}
            onToggle={toggleItem}
            onDelete={deleteItem}
            checkedByName={userNames[item.checked_by_user_id || '']}
          />
        ))}

        <AddGroceryItem onAdd={addItem} />

        {checkedItems.length > 0 && (
          <>
            <div className="text-xs font-medium text-[#8B8680] uppercase tracking-wide pt-6 pb-2">
              Completed ({checkedItems.length})
            </div>
            {checkedItems.map((item) => (
              <GroceryItem
                key={item.id}
                item={item}
                onToggle={toggleItem}
                onDelete={deleteItem}
                checkedByName={userNames[item.checked_by_user_id || '']}
              />
            ))}
          </>
        )}
      </div>

      {items.length === 0 && (
        <p className="text-center text-[#8B8680] py-6 text-sm">
          No items yet
        </p>
      )}
    </div>
  )
}
