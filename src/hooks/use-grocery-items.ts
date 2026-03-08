'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GroceryItem } from '@/lib/supabase/types'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export function useGroceryItems(weekId: string | null) {
  const [items, setItems] = useState<GroceryItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchItems = useCallback(async () => {
    if (!weekId) return

    const { data, error } = await supabase
      .from('grocery_items')
      .select('*')
      .eq('week_id', weekId)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setItems(data)
    }
    setLoading(false)
  }, [weekId, supabase])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  useEffect(() => {
    if (!weekId) return

    const channel = supabase
      .channel(`grocery_items:${weekId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'grocery_items',
          filter: `week_id=eq.${weekId}`,
        },
        (payload: RealtimePostgresChangesPayload<GroceryItem>) => {
          if (payload.eventType === 'INSERT') {
            setItems((prev) => [...prev, payload.new as GroceryItem])
          } else if (payload.eventType === 'UPDATE') {
            setItems((prev) =>
              prev.map((item) =>
                item.id === (payload.new as GroceryItem).id
                  ? (payload.new as GroceryItem)
                  : item
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setItems((prev) =>
              prev.filter((item) => item.id !== (payload.old as GroceryItem).id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [weekId, supabase])

  const addItem = async (name: string, store?: string) => {
    if (!weekId) return

    await supabase.from('grocery_items').insert({
      week_id: weekId,
      name,
      store: store || null,
    })
  }

  const toggleItem = async (itemId: string, checked: boolean) => {
    const { data: user } = await supabase.auth.getUser()

    await supabase
      .from('grocery_items')
      .update({
        checked,
        checked_by_user_id: checked ? user.user?.id : null,
        checked_at: checked ? new Date().toISOString() : null,
      })
      .eq('id', itemId)
  }

  const deleteItem = async (itemId: string) => {
    await supabase.from('grocery_items').delete().eq('id', itemId)
  }

  return { items, loading, addItem, toggleItem, deleteItem }
}
