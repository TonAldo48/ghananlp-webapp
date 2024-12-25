'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Upload } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Add language options
const LANGUAGES = [
  { value: 'twi', label: 'Twi' },
  { value: 'ewe', label: 'Ewe' },
  { value: 'ga', label: 'Ga' },
] as const

interface TranscriptionResult {
  text: string
  language: string
}

export function AudioTranscriber() {
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null)
  const [translationAudio, setTranslationAudio] = useState<string | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('twi')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAudioFile(file)
    }
  }

  const transcribeAudio = async () => {
    if (!audioFile) return

    setIsTranscribing(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioFile)

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      setTranscription(result)
      
      // After transcription, trigger translation
      if (result.text) {
        await translateText(result.text)
      }
    } catch (error) {
      console.error('Transcription error:', error)
    } finally {
      setIsTranscribing(false)
    }
  }

  const translateText = async (text: string) => {
    try {
      setIsTranslating(true)
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage: selectedLanguage,
        }),
      })

      const result = await response.json()
      if (result.audioData) {
        const audioUrl = `data:${result.contentType};base64,${result.audioData}`
        setTranslationAudio(audioUrl)
      }
    } catch (error) {
      console.error('Translation error:', error)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Audio Transcription</CardTitle>
          <CardDescription>
            Upload an audio file to transcribe and translate to Ghanaian languages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload"
              />
              <label
                htmlFor="audio-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-gray-500 mb-2" />
                <span className="text-sm font-medium text-gray-600">
                  {audioFile ? audioFile.name : 'Click to upload audio file'}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  MP3, WAV, or M4A up to 10MB
                </span>
              </label>
            </div>
            
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Target Language</label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={transcribeAudio}
            disabled={!audioFile || isTranscribing}
            className="w-full"
          >
            {isTranscribing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transcribing...
              </>
            ) : (
              'Transcribe Audio'
            )}
          </Button>
        </CardContent>

        {(transcription || translationAudio) && (
          <CardFooter className="flex flex-col space-y-4">
            {transcription && (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-sm">Transcription</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{transcription.text}</p>
                </CardContent>
              </Card>
            )}
            
            {translationAudio && (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-sm">
                    Translation Audio ({LANGUAGES.find(l => l.value === selectedLanguage)?.label})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <audio 
                    ref={audioRef}
                    controls 
                    className="w-full"
                    src={translationAudio}
                  />
                  <Button
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = translationAudio
                      link.download = `translation-${selectedLanguage}.wav`
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Download Audio
                  </Button>
                </CardContent>
              </Card>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  )
} 