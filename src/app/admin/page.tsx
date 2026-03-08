'use client'

import { useEffect, useState } from 'react'

interface Stats {
  households: number
  users: number
  recipes: number
  groceryItems: number
  errands: number
  itemsCheckedToday: number
  recentRecipes: { title: string; created_at: string }[]
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    )
  }

  if (!stats) {
    return <div className="p-4">Failed to load stats</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">Sunday Runs Admin</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Households" value={stats.households} />
        <StatCard label="Users" value={stats.users} />
        <StatCard label="Recipes" value={stats.recipes} />
        <StatCard label="Grocery Items" value={stats.groceryItems} />
        <StatCard label="Errands" value={stats.errands} />
        <StatCard label="Checked Today" value={stats.itemsCheckedToday} />
      </div>

      <div className="bg-white rounded-lg border p-4">
        <h2 className="font-semibold mb-3">Recent Recipes</h2>
        {stats.recentRecipes.length === 0 ? (
          <p className="text-gray-500">No recipes yet</p>
        ) : (
          <ul className="space-y-2">
            {stats.recentRecipes.map((recipe, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span>{recipe.title}</span>
                <span className="text-gray-500">
                  {new Date(recipe.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <p className="text-2xl font-bold text-emerald-600">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}
