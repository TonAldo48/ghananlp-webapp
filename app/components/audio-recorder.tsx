"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Mic, Square, Loader2, RotateCcw, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useTranslationHistory } from "@/app/hooks/use-translation-history"
import { AudioPlayer } from "@/app/components/audio-player"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AudioRecorderProps {
  selectedLanguage: string
}

export function AudioRecorder({ selectedLanguage }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string>("")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [transcription, setTranscription] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [translatedAudioUrl, setTranslatedAudioUrl] = useState("")
  const [currentItemId, setCurrentItemId] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout>()
  const { addToHistory, updateHistory } = useTranslationHistory()

  // Cleanup function
  const cleanup = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    if (translatedAudioUrl) URL.revokeObjectURL(translatedAudioUrl)
    setAudioBlob(null)
    setAudioUrl("")
    setTranscription("")
    setTranslatedText("")
    setTranslatedAudioUrl("")
    setCurrentItemId(null)
    setRecordingTime(0)
  }, [audioUrl, translatedAudioUrl])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (translatedAudioUrl) URL.revokeObjectURL(translatedAudioUrl)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [audioUrl, translatedAudioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' })
        const url = URL.createObjectURL(blob)
        setAudioBlob(blob)
        setAudioUrl(url)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Failed to start recording:', error)
      toast.error("Failed to access microphone")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleTranscribeAndTranslate = async () => {
    if (!audioBlob) return

    // First transcribe
    setIsTranscribing(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)

      const id = crypto.randomUUID()
      setCurrentItemId(id)

      // Save initial state to history
      addToHistory({
        id,
        timestamp: new Date().toISOString(),
        originalFileName: `recording-${formatTime(recordingTime)}.wav`,
        originalAudioData: await blobToBase64(audioBlob),
        originalAudioType: audioBlob.type,
        transcription: "",
        status: 'transcribing'
      })

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Transcription failed')
      const result = await response.json()
      if (result.error) throw new Error(result.error)

      setTranscription(result.text)
      updateHistory(id, {
        transcription: result.text,
        status: 'translating'
      })

      // Then translate
      setIsTranslating(true)
      const translateResponse = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: result.text,
          targetLanguage: selectedLanguage,
        }),
      })

      if (!translateResponse.ok) throw new Error('Translation failed')
      const translateResult = await translateResponse.json()
      if (translateResult.error) throw new Error(translateResult.error)

      setTranslatedText(translateResult.translatedText)

      if (translateResult.audioData) {
        const audioBlob = await fetch(
          `data:${translateResult.contentType};base64,${translateResult.audioData}`
        ).then(res => res.blob())
        const url = URL.createObjectURL(audioBlob)
        setTranslatedAudioUrl(url)

        updateHistory(id, {
          translatedText: translateResult.translatedText,
          translatedAudioData: translateResult.audioData,
          translatedAudioType: translateResult.contentType,
          targetLanguage: selectedLanguage,
          status: 'translated'
        })
      }

      toast.success("Audio transcribed and translated successfully")
    } catch (error) {
      console.error('Processing error:', error)
      toast.error("Failed to process audio")
      if (currentItemId) {
        updateHistory(currentItemId, { status: 'transcribing' })
      }
    } finally {
      setIsTranscribing(false)
      setIsTranslating(false)
    }
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        resolve(base64.split(',')[1])
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex h-10 md:h-12 w-10 md:w-12 items-center justify-center rounded-full transition-colors",
            isRecording ? "bg-red-100 text-red-600 animate-pulse" : "bg-slate-100"
          )}>
            <Mic className="h-5 md:h-6 w-5 md:w-6" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-medium">Voice Recorder</h2>
            <p className="text-sm text-muted-foreground">
              {isRecording ? "Recording in progress..." : "Ready to record"}
            </p>
          </div>
        </div>
        <span className="text-xl md:text-2xl font-mono font-medium tracking-wider">
          {formatTime(recordingTime)}
        </span>
      </div>

      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            onClick={isRecording ? stopRecording : startRecording}
            className="h-14 md:h-16 w-14 md:w-16 rounded-full p-0"
          >
            {isRecording ? (
              <Square className="h-5 md:h-6 w-5 md:w-6" />
            ) : (
              <Mic className="h-5 md:h-6 w-5 md:w-6" />
            )}
          </Button>
        </div>

        {audioUrl && (
          <Card className="w-full">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                <AudioPlayer src={audioUrl} />

                <div className="flex flex-col md:flex-row gap-2">
                  <Button
                    className="flex-1"
                    onClick={handleTranscribeAndTranslate}
                    disabled={isTranscribing || isTranslating}
                  >
                    {isTranscribing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Transcribing...
                      </>
                    ) : isTranslating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      "Transcribe & Translate"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={cleanup}
                    disabled={isTranscribing || isTranslating}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Record Again
                  </Button>
                </div>

                {transcription && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Transcription</h3>
                    <Textarea
                      value={transcription}
                      readOnly
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                )}

                {translatedText && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Translation</h3>
                      <Textarea
                        value={translatedText}
                        readOnly
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                    {translatedAudioUrl && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Translated Audio</h3>
                        <AudioPlayer src={translatedAudioUrl} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 