'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Errand } from '@/lib/supabase/types'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export function useErrands(weekId: string | null) {
  const [errands, setErrands] = useState<Errand[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchErrands = useCallback(async () => {
    if (!weekId) return

    const { data, error } = await supabase
      .from('errands')
      .select('*')
      .eq('week_id', weekId)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setErrands(data)
    }
    setLoading(false)
  }, [weekId, supabase])

  useEffect(() => {
    fetchErrands()
  }, [fetchErrands])

  useEffect(() => {
    if (!weekId) return

    const channel = supabase
      .channel(`errands:${weekId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'errands',
          filter: `week_id=eq.${weekId}`,
        },
        (payload: RealtimePostgresChangesPayload<Errand>) => {
          if (payload.eventType === 'INSERT') {
            setErrands((prev) => [...prev, payload.new as Errand])
          } else if (payload.eventType === 'UPDATE') {
            setErrands((prev) =>
              prev.map((errand) =>
                errand.id === (payload.new as Errand).id
                  ? (payload.new as Errand)
                  : errand
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setErrands((prev) =>
              prev.filter((errand) => errand.id !== (payload.old as Errand).id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [weekId, supabase])

  const addErrand = async (title: string, store?: string) => {
    if (!weekId) return

    await supabase.from('errands').insert({
      week_id: weekId,
      title,
      store: store || null,
    })
  }

  const toggleErrand = async (errandId: string, checked: boolean) => {
    const { data: user } = await supabase.auth.getUser()

    await supabase
      .from('errands')
      .update({
        checked,
        checked_by_user_id: checked ? user.user?.id : null,
        checked_at: checked ? new Date().toISOString() : null,
      })
      .eq('id', errandId)
  }

  const deleteErrand = async (errandId: string) => {
    await supabase.from('errands').delete().eq('id', errandId)
  }

  return { errands, loading, addErrand, toggleErrand, deleteErrand }
}
