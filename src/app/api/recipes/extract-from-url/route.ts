import { NextRequest, NextResponse } from 'next/server'
import { extractRecipeFromUrl } from '@/lib/recipe-extraction'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const recipe = await extractRecipeFromUrl(url)
    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Extract from URL error:', error)
    return NextResponse.json(
      { error: 'Failed to extract recipe' },
      { status: 500 }
    )
  }
}
