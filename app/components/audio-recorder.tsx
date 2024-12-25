"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, Square, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { AudioPlayer } from "@/app/components/audio-player"

interface AudioRecorderProps {
  selectedLanguage: string
}

export function AudioRecorder({ selectedLanguage }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string>("")
  const [transcription, setTranscription] = useState<string>("")
  const [translatedText, setTranslatedText] = useState<string>("")
  const [translatedAudioUrl, setTranslatedAudioUrl] = useState<string>("")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      if (translatedAudioUrl) {
        URL.revokeObjectURL(translatedAudioUrl)
      }
    }
  }, [audioUrl, translatedAudioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast.error("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const handleTranscribe = async () => {
    if (!audioBlob) return

    setIsTranscribing(true)
    const formData = new FormData()
    formData.append("file", audioBlob)

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to transcribe audio")
      }

      const data = await response.json()
      setTranscription(data.text)
    } catch (error) {
      console.error("Transcription error:", error)
      toast.error("Failed to transcribe audio. Please try again.")
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleTranslate = async () => {
    if (!transcription || !selectedLanguage) return

    setIsTranslating(true)
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: transcription,
          targetLanguage: selectedLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to translate text")
      }

      const data = await response.json()
      setTranslatedText(data.translatedText)

      if (data.audioContent) {
        const audioBlob = new Blob([Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))], { type: "audio/mp3" })
        const url = URL.createObjectURL(audioBlob)
        setTranslatedAudioUrl(url)
      }
    } catch (error) {
      console.error("Translation error:", error)
      toast.error("Failed to translate audio. Please try again.")
    } finally {
      setIsTranslating(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleReset = () => {
    setAudioBlob(null)
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioUrl("")
    setTranscription("")
    setTranslatedText("")
    if (translatedAudioUrl) {
      URL.revokeObjectURL(translatedAudioUrl)
    }
    setTranslatedAudioUrl("")
    setRecordingTime(0)
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-medium">Record Audio</h2>
              {isRecording && (
                <p className="text-sm text-muted-foreground">
                  Recording: {formatTime(recordingTime)}
                </p>
              )}
            </div>
            <Button
              variant={isRecording ? "destructive" : "default"}
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isTranscribing || isTranslating}
            >
              {isRecording ? (
                <Square className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </div>

          {audioUrl && (
            <div className="space-y-4">
              <AudioPlayer src={audioUrl} />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isTranscribing || isTranslating}
                >
                  Reset
                </Button>
                <Button
                  onClick={handleTranscribe}
                  disabled={isTranscribing || isTranslating}
                >
                  {isTranscribing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Transcribing...
                    </>
                  ) : (
                    "Transcribe"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {transcription && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-medium">Transcription</h3>
              <Textarea
                value={transcription}
                readOnly
                className="min-h-[100px] resize-none"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleTranslate}
                disabled={isTranslating || !selectedLanguage}
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  "Translate"
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {translatedText && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-medium">Translation</h3>
              <Textarea
                value={translatedText}
                readOnly
                className="min-h-[100px] resize-none"
              />
            </div>
            {translatedAudioUrl && (
              <AudioPlayer src={translatedAudioUrl} />
            )}
          </div>
        </Card>
      )}
    </div>
  )
} 