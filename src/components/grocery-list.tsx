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
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {STORES.map((store) => (
          <button
            key={store}
            onClick={() => setStoreFilter(store)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              storeFilter === store
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            <div className="text-sm text-gray-500 pt-4">
              Checked ({checkedItems.length})
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
        <p className="text-center text-gray-500 py-4">
          No items yet. Add your first grocery item above.
        </p>
      )}
    </div>
  )
}
