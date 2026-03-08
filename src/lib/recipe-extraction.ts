import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface ExtractedRecipe {
  title: string
  ingredients: { name: string; quantity: number | null; unit: string | null }[]
  instructions: string | null
  imageUrl: string | null
}

export async function extractRecipeFromUrl(url: string): Promise<ExtractedRecipe> {
  const response = await fetch(url)
  const html = await response.text()

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `Extract the recipe from this webpage HTML. Return a JSON object with:
- title: string (the recipe name)
- ingredients: array of {name: string, quantity: number or null, unit: string or null}
- instructions: string (the cooking instructions, can be null if not found)
- imageUrl: string or null (the main recipe image URL if found)

Only return valid JSON, no other text.

HTML:
${html.slice(0, 50000)}`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  return JSON.parse(content.text)
}

export async function extractRecipeFromImage(base64Image: string, mimeType: string): Promise<ExtractedRecipe> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: `Extract the recipe from this image. Return a JSON object with:
- title: string (the recipe name, infer if not explicit)
- ingredients: array of {name: string, quantity: number or null, unit: string or null}
- instructions: string (the cooking instructions, can be null if not visible)
- imageUrl: null

Only return valid JSON, no other text.`,
          },
        ],
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  return JSON.parse(content.text)
}
