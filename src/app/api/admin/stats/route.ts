import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const [
      { count: householdCount },
      { count: userCount },
      { count: recipeCount },
      { count: groceryItemCount },
      { count: errandCount },
    ] = await Promise.all([
      supabase.from('households').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('recipes').select('*', { count: 'exact', head: true }),
      supabase.from('grocery_items').select('*', { count: 'exact', head: true }),
      supabase.from('errands').select('*', { count: 'exact', head: true }),
    ])

    const today = new Date().toISOString().split('T')[0]
    const { count: itemsCheckedToday } = await supabase
      .from('grocery_items')
      .select('*', { count: 'exact', head: true })
      .gte('checked_at', today)

    const { data: recentRecipes } = await supabase
      .from('recipes')
      .select('title, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      households: householdCount || 0,
      users: userCount || 0,
      recipes: recipeCount || 0,
      groceryItems: groceryItemCount || 0,
      errands: errandCount || 0,
      itemsCheckedToday: itemsCheckedToday || 0,
      recentRecipes: recentRecipes || [],
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
