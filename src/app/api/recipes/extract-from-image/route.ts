import { NextRequest, NextResponse } from 'next/server'
import { extractRecipeFromImage } from '@/lib/recipe-extraction'

export async function POST(request: NextRequest) {
  try {
    const { image, mimeType } = await request.json()

    if (!image || !mimeType) {
      return NextResponse.json(
        { error: 'Image and mimeType are required' },
        { status: 400 }
      )
    }

    const recipe = await extractRecipeFromImage(image, mimeType)
    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Extract from image error:', error)
    return NextResponse.json(
      { error: 'Failed to extract recipe' },
      { status: 500 }
    )
  }
}
