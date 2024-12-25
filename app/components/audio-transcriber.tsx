"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Upload, Loader2, RefreshCw } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useTranslationHistory } from "@/app/hooks/use-translation-history"
import { AudioPlayer } from "@/app/components/audio-player"

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
  const transcriptionRef = useRef<HTMLTextAreaElement>(null)
  const translationRef = useRef<HTMLTextAreaElement>(null)
  const { addToHistory, updateHistory } = useTranslationHistory()

  // Cleanup function for URLs and state
  const cleanup = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioFile(null)
    setTranscription("")
    setTranslatedText("")
    setAudioUrl("")
    setIsPlaying(false)
    setCurrentItemId(null)
    setIsTranscribing(false)
    setIsTranslating(false)
  }, [audioUrl])

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  // Auto-resize textareas when content changes
  useEffect(() => {
    if (transcriptionRef.current) {
      transcriptionRef.current.style.height = 'auto'
      transcriptionRef.current.style.height = `${Math.max(200, transcriptionRef.current.scrollHeight)}px`
    }
  }, [transcription])

  useEffect(() => {
    if (translationRef.current) {
      translationRef.current.style.height = 'auto'
      translationRef.current.style.height = `${Math.max(200, translationRef.current.scrollHeight)}px`
    }
  }, [translatedText])

  const fileToBase64 = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        resolve(base64.split(',')[1]) // Remove data URL prefix
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File size must be less than 10MB")
        return
      }

      console.log('Processing new file:', file.name)
      const base64 = await fileToBase64(file)

      // Create initial history item
      const id = crypto.randomUUID()
      console.log('Creating history item:', id)
      
      const historyItem = {
        id,
        timestamp: new Date().toISOString(),
        originalFileName: file.name,
        originalAudioData: base64,
        originalAudioType: file.type,
        transcription: "",
        status: 'transcribing' as const
      }
      
      addToHistory(historyItem)
      setCurrentItemId(id)
      setAudioFile(file)
      console.log('File processed successfully')
    } catch (error) {
      console.error('Failed to process file:', error)
      toast.error("Failed to process file")
    }

    // Clear the input value to allow uploading the same file again
    event.target.value = ''
  }

  const handleTranscribe = async () => {
    if (!audioFile || !currentItemId) return

    setIsTranscribing(true)
    try {
      console.log('Starting transcription for:', currentItemId)
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

      console.log('Transcription successful, updating history')
      setTranscription(result.text)
      updateHistory(currentItemId, {
        transcription: result.text,
        status: 'transcribed'
      })
      toast.success("Audio transcribed successfully")
    } catch (error) {
      console.error('Transcription error:', error)
      toast.error("Failed to transcribe audio")
      // Update history to show failure
      updateHistory(currentItemId, { status: 'transcribing' })
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
    console.log('Starting translation for:', currentItemId)
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

      console.log('Translation successful, updating history')
      setTranslatedText(result.translatedText)
      toast.success("Text translated successfully")

      // Create audio URL from base64 data
      if (result.audioData) {
        // Clean up previous audio URL if it exists
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl)
        }

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
      // Update history to show failure
      updateHistory(currentItemId, { status: 'transcribed' })
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Audio Translation</h2>
        {(audioFile || transcription || translatedText) && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => {
              if (isTranscribing || isTranslating) {
                toast.error("Please wait for the current process to complete")
                return
              }
              cleanup()
              toast.success("Started new translation")
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Start New
          </Button>
        )}
      </div>

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
          ref={transcriptionRef}
          placeholder="Transcription will appear here..."
          value={transcription}
          onChange={(e) => {
            setTranscription(e.target.value)
            if (currentItemId) {
              updateHistory(currentItemId, { transcription: e.target.value })
            }
          }}
          className="min-h-[200px] resize-none p-4 transition-all duration-200"
          style={{ overflow: 'hidden' }}
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
              ref={translationRef}
              placeholder="Translation will appear here..."
              value={translatedText}
              readOnly
              className="min-h-[200px] resize-none p-4 transition-all duration-200"
              style={{ overflow: 'hidden' }}
            />
            
            {audioUrl && (
              <div className="rounded-lg border p-4">
                <AudioPlayer 
                  src={audioUrl}
                  onPlayStateChange={setIsPlaying}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 