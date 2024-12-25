import { NextResponse } from 'next/server'

const GHANA_NLP_TRANSLATE_API = 'https://translation-api.ghananlp.org/v1/translate'
const GHANA_NLP_TTS_API = 'https://translation-api.ghananlp.org/tts/v1/tts'

export async function POST(request: Request) {
  try {
    const { text, targetLanguage } = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Step 1: Translate text to local language
    const translateResponse = await fetch(GHANA_NLP_TRANSLATE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.GHANA_NLP_API_KEY!,
      },
      body: JSON.stringify({
        "in": text,
        "lang": `en-${targetLanguage}` // e.g., "en-tw" for English to Twi
      }),
    })

    if (!translateResponse.ok) {
      throw new Error(`Translation API error: ${translateResponse.statusText}`)
    }

    const translatedText = await translateResponse.text()

    // Step 2: Convert translated text to speech
    const ttsResponse = await fetch(GHANA_NLP_TTS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.GHANA_NLP_API_KEY!,
      },
      body: JSON.stringify({
        text: translatedText,
        language: targetLanguage,
      }),
    })

    if (!ttsResponse.ok) {
      throw new Error(`TTS API error: ${ttsResponse.statusText}`)
    }

    // Get the audio data
    const audioBuffer = await ttsResponse.arrayBuffer()
    const audioBase64 = Buffer.from(audioBuffer).toString('base64')

    return NextResponse.json({ 
      translatedText,
      audioData: audioBase64,
      contentType: ttsResponse.headers.get('content-type') || 'audio/wav'
    })

  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Error processing translation' },
      { status: 500 }
    )
  }
}


  return languageMap[language.toLowerCase()] || language.toLowerCase()
} 