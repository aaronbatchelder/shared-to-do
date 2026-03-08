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

function parseJsonSafely(text: string): ExtractedRecipe {
  // Strip markdown code blocks
  let jsonText = text.trim()
  if (jsonText.startsWith('```json')) jsonText = jsonText.slice(7)
  else if (jsonText.startsWith('```')) jsonText = jsonText.slice(3)
  if (jsonText.endsWith('```')) jsonText = jsonText.slice(0, -3)
  jsonText = jsonText.trim()

  // Try to fix common JSON issues
  // Replace smart quotes with regular quotes
  jsonText = jsonText.replace(/[\u2018\u2019]/g, "'")
  jsonText = jsonText.replace(/[\u201C\u201D]/g, '"')

  // Try parsing
  try {
    return JSON.parse(jsonText)
  } catch {
    // Try to extract JSON object if there's extra text
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('Failed to parse recipe JSON')
  }
}

export async function extractRecipeFromUrl(url: string): Promise<ExtractedRecipe> {
  // Try multiple fetch strategies
  let pageContent = ''

  // Strategy 1: Try direct fetch with browser-like headers
  try {
    const directResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
      }
    })
    pageContent = await directResponse.text()

    // Check if we got blocked or got too little content
    if (pageContent.length < 1000 || pageContent.includes('access issue') || pageContent.includes('blocked')) {
      throw new Error('Blocked by site')
    }
  } catch {
    // Strategy 2: Use Jina Reader as fallback
    try {
      const jinaUrl = `https://r.jina.ai/${url}`
      const jinaResponse = await fetch(jinaUrl, {
        headers: { 'Accept': 'text/plain' }
      })
      const jinaText = await jinaResponse.text()

      // Check if Jina returned an error
      if (jinaText.includes('"code":') || jinaText.includes('SecurityCompromiseError') || jinaText.includes('error')) {
        throw new Error('Jina blocked')
      }
      pageContent = jinaText
    } catch {
      // Strategy 3: Extract recipe name from URL and use Claude to generate typical ingredients
      const urlPath = new URL(url).pathname
      const recipeName = urlPath
        .split('/')
        .filter(Boolean)
        .pop()
        ?.replace(/-/g, ' ')
        .replace(/\d+/g, '')
        .trim() || 'Unknown Recipe'

      // Ask Claude to generate typical recipe based on name
      const fallbackMessage = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `Based on the recipe name "${recipeName}", provide typical ingredients and instructions.

Return ONLY a valid JSON object (no markdown, no explanation):
{"title": "Recipe Name", "ingredients": [{"name": "ingredient", "quantity": 1, "unit": "cup"}], "instructions": "Step by step instructions here", "imageUrl": null}

Use plain ASCII quotes, no smart quotes. Keep instructions as a single string.`,
          },
        ],
      })

      const fallbackContent = fallbackMessage.content[0]
      if (fallbackContent.type !== 'text') {
        throw new Error('Failed to generate recipe')
      }

      return parseJsonSafely(fallbackContent.text)
    }
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `Extract the recipe from this webpage. Return ONLY valid JSON (no markdown):
{"title": "Recipe Name", "ingredients": [{"name": "ingredient", "quantity": 1, "unit": "cup"}], "instructions": "All steps as single string", "imageUrl": null}

Rules:
- Use plain ASCII quotes only
- instructions must be a single string, not an array
- quantity must be a number or null
- Keep ingredient names simple

Content:
${pageContent.slice(0, 30000)}`,
      },
    ],
  })

  const responseContent = message.content[0]
  if (responseContent.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  return parseJsonSafely(responseContent.text)
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

  return parseJsonSafely(content.text)
}
