"use client"

import { useState, useRef } from "react"
import { Upload, Loader2, Play, Pause, Download } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useTranslationHistory } from "@/app/hooks/use-translation-history"

interface AudioTranscriberProps {
  selectedLanguage: string
}

export function AudioTranscriber({ selectedLanguage }: AudioTranscriberProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [transcription, setTranscription] = useState<string>("")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedText, setTranslatedText] = useState<string>("")
  const [audioUrl, setAudioUrl] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentItemId, setCurrentItemId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { addToHistory, updateHistory } = useTranslationHistory()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File size must be less than 10MB")
        return
      }

      // Convert file to base64 immediately
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = reader.result as string
          resolve(base64.split(',')[1]) // Remove data URL prefix
        }
        reader.readAsDataURL(file)
      })

      // Create initial history item
      const id = crypto.randomUUID()
      addToHistory({
        id,
        timestamp: new Date().toISOString(),
        originalFileName: file.name,
        originalAudioData: base64,
        originalAudioType: file.type,
        transcription: "",
        status: 'transcribing'
      })
      setCurrentItemId(id)

      const url = URL.createObjectURL(file)
      setAudioFile(file)
      setTranscription("") // Clear previous transcription
      setTranslatedText("") // Clear previous translation
      setAudioUrl("") // Clear previous audio URL
      setIsPlaying(false)
    }
  }

  const handleTranscribe = async () => {
    if (!audioFile || !currentItemId) return

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
      updateHistory(currentItemId, {
        transcription: result.text,
        status: 'transcribed'
      })
      toast.success("Audio transcribed successfully")
    } catch (error) {
      console.error('Transcription error:', error)
      toast.error("Failed to transcribe audio")
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleTranslate = async () => {
    if (!transcription || !selectedLanguage || !audioFile || !currentItemId) {
      toast.error("Please select a target language")
      return
    }

    setIsTranslating(true)
    updateHistory(currentItemId, { status: 'translating' })

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

      // Create audio URL from base64 data
      if (result.audioData) {
        const audioBlob = await fetch(`data:${result.contentType};base64,${result.audioData}`).then(res => res.blob())
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)

        // Update history with translation results
        updateHistory(currentItemId, {
          translatedText: result.translatedText,
          translatedAudioData: result.audioData,
          translatedAudioType: result.contentType,
          targetLanguage: selectedLanguage,
          status: 'translated'
        })
      }
    } catch (error) {
      console.error('Translation error:', error)
      toast.error("Failed to translate text")
    } finally {
      setIsTranslating(false)
    }
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement('a')
      a.href = audioUrl
      a.download = `translation-${selectedLanguage}.wav` // or appropriate extension
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
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
          onChange={(e) => {
            setTranscription(e.target.value)
            if (currentItemId) {
              updateHistory(currentItemId, { transcription: e.target.value })
            }
          }}
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
          <div className="space-y-4">
            <Textarea
              placeholder="Translation will appear here..."
              value={translatedText}
              readOnly
              className="min-h-[200px] resize-none p-4"
            />
            
            {audioUrl && (
              <div className="flex items-center gap-2">
                <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePlayPause}
                  className="h-8 w-8"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDownload}
                  className="h-8 w-8"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 