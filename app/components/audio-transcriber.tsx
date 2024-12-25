"use client"

import { useState } from "react"
import { Upload, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface AudioTranscriberProps {
  selectedLanguage: string
}

export function AudioTranscriber({ selectedLanguage }: AudioTranscriberProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [transcription, setTranscription] = useState<string>("")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedText, setTranslatedText] = useState<string>("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File size must be less than 10MB")
        return
      }
      setAudioFile(file)
      setTranscription("") // Clear previous transcription
      setTranslatedText("") // Clear previous translation
    }
  }

  const handleTranscribe = async () => {
    if (!audioFile) return

    setIsTranscribing(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioFile)

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Transcription failed')
      }

      const result = await response.json()
      if (result.error) {
        throw new Error(result.error)
      }

      setTranscription(result.text)
      toast.success("Audio transcribed successfully")
    } catch (error) {
      console.error('Transcription error:', error)
      toast.error("Failed to transcribe audio")
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleTranslate = async () => {
    if (!transcription || !selectedLanguage) {
      toast.error("Please select a target language")
      return
    }

    setIsTranslating(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: transcription,
          targetLanguage: selectedLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      const result = await response.json()
      if (result.error) {
        throw new Error(result.error)
      }

      setTranslatedText(result.translatedText)
      toast.success("Text translated successfully")

      // Play audio if available
      if (result.audioData) {
        const audio = new Audio(`data:${result.contentType};base64,${result.audioData}`)
        await audio.play()
      }
    } catch (error) {
      console.error('Translation error:', error)
      toast.error("Failed to translate text")
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 hover:border-foreground/50 transition-colors">
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
            <Upload className="h-8 w-8 mb-4" />
            <span className="text-sm font-medium">
              {audioFile ? audioFile.name : "Click to upload audio file"}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              MP3, WAV, or M4A up to 10MB
            </span>
          </label>
        </div>

        <Button 
          onClick={handleTranscribe} 
          disabled={!audioFile || isTranscribing}
          size="lg"
          className="w-full"
        >
          {isTranscribing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Transcribing...
            </>
          ) : audioFile ? (
            'Transcribe Audio'
          ) : (
            'Upload an audio file to transcribe'
          )}
        </Button>
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder="Transcription will appear here..."
          value={transcription}
          onChange={(e) => setTranscription(e.target.value)}
          className="min-h-[200px] resize-none p-4"
        />

        {transcription && (
          <Button 
            size="lg"
            className="w-full"
            onClick={handleTranslate}
            disabled={isTranslating}
          >
            {isTranslating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Translating...
              </>
            ) : (
              'Translate'
            )}
          </Button>
        )}

        {translatedText && (
          <Textarea
            placeholder="Translation will appear here..."
            value={translatedText}
            readOnly
            className="min-h-[200px] resize-none p-4"
          />
        )}
      </div>
    </div>
  )
} 