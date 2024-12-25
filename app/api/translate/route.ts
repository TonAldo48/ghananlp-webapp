import { NextResponse } from 'next/server'

const GHANA_NLP_API = 'https://translation-api.ghananlp.org/tts/v1/tts'

export async function POST(request: Request) {
  try {
    const { text, targetLanguage } = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const languageCode = getLanguageCode(targetLanguage)

    const response = await fetch(GHANA_NLP_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.GHANA_NLP_API_KEY!,
      },
      body: JSON.stringify({
        text: text,
        language: languageCode,
      }),
    })

    if (!response.ok) {
      console.error('Translation API error:', response.statusText)
      throw new Error(`Translation API error: ${response.statusText}`)
    }

    // Get the audio data as ArrayBuffer
    const audioBuffer = await response.arrayBuffer()
    
    // Convert to Base64 for transmission
    const audioBase64 = Buffer.from(audioBuffer).toString('base64')

    return NextResponse.json({ 
      audioData: audioBase64,
      contentType: response.headers.get('content-type') || 'audio/wav'
    })

  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Error processing audio' },
      { status: 500 }
    )
  }
}

function getLanguageCode(language: string): string {
  const languageMap: Record<string, string> = {
    'twi': 'tw',
    'ewe': 'ee',
    'ga': 'ga',
    // Add more language mappings as needed
  }

  return languageMap[language.toLowerCase()] || language.toLowerCase()
} 