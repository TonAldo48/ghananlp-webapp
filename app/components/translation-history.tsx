"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Play, Pause, Download, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useTranslationHistory, TranslationHistoryItem } from "@/app/hooks/use-translation-history"

const LANGUAGES: Record<string, string> = {
  tw: 'Twi',
  gaa: 'Ga',
  ee: 'Ewe',
  fat: 'Fante',
  dag: 'Dagbani',
  gur: 'Gurene',
}

const STATUS_BADGES: Record<TranslationHistoryItem['status'], { label: string, variant: 'default' | 'secondary' | 'outline' }> = {
  transcribing: { label: 'Transcribing...', variant: 'secondary' },
  transcribed: { label: 'Transcribed', variant: 'outline' },
  translating: { label: 'Translating...', variant: 'secondary' },
  translated: { label: 'Translated', variant: 'default' },
}

export function TranslationHistory() {
  const { history, removeFromHistory } = useTranslationHistory()
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({})

  // Create object URLs for audio data when history changes
  useEffect(() => {
    const urls: Record<string, string> = {}
    
    history.forEach(item => {
      // Create URL for original audio
      const originalBlob = base64ToBlob(item.originalAudioData, item.originalAudioType)
      urls[`${item.id}-original`] = URL.createObjectURL(originalBlob)
      
      // Create URL for translated audio if available
      if (item.translatedAudioData && item.translatedAudioType) {
        const translatedBlob = base64ToBlob(item.translatedAudioData, item.translatedAudioType)
        urls[`${item.id}-translated`] = URL.createObjectURL(translatedBlob)
      }
    })

    setAudioUrls(urls)

    // Cleanup URLs when component unmounts or history changes
    return () => {
      Object.values(urls).forEach(url => URL.revokeObjectURL(url))
    }
  }, [history])

  const base64ToBlob = (base64: string, type: string) => {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type })
  }

  const handlePlay = async (item: TranslationHistoryItem, isOriginal: boolean) => {
    // Stop any currently playing audio
    if (playingId) {
      const audio = document.querySelector(`audio[data-id="${playingId}"]`) as HTMLAudioElement
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }

    // Play the selected audio
    const audioId = `${item.id}-${isOriginal ? 'original' : 'translated'}`
    const audio = document.querySelector(`audio[data-id="${audioId}"]`) as HTMLAudioElement
    if (audio) {
      try {
        await audio.play()
        setPlayingId(audioId)
      } catch (error) {
        console.error('Failed to play audio:', error)
      }
    }
  }

  const handlePause = (id: string) => {
    const audio = document.querySelector(`audio[data-id="${id}"]`) as HTMLAudioElement
    if (audio) {
      audio.pause()
      setPlayingId(null)
    }
  }

  const handleDownload = (item: TranslationHistoryItem, isOriginal: boolean) => {
    const audioId = `${item.id}-${isOriginal ? 'original' : 'translated'}`
    const url = audioUrls[audioId]
    if (url) {
      const a = document.createElement('a')
      a.href = url
      a.download = isOriginal 
        ? `original-${item.originalFileName}`
        : `translation-${item.targetLanguage}-${item.originalFileName}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  if (history.length === 0) {
    return (
      <div className="flex h-[600px] items-center justify-center text-center">
        <div className="space-y-2">
          <p className="text-lg font-medium">No translation history yet</p>
          <p className="text-sm text-muted-foreground">
            Your translation history will appear here after you translate some audio.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {history.map((item) => (
        <div
          key={item.id}
          className="flex flex-col space-y-4 rounded-lg border p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">
                {item.originalFileName}
              </span>
              <Badge variant={STATUS_BADGES[item.status].variant}>
                {item.status === 'transcribing' || item.status === 'translating' ? (
                  <div className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {STATUS_BADGES[item.status].label}
                  </div>
                ) : (
                  STATUS_BADGES[item.status].label
                )}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => removeFromHistory(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Original Audio</span>
                <div className="flex items-center gap-1">
                  <audio
                    data-id={`${item.id}-original`}
                    src={audioUrls[`${item.id}-original`]}
                    onEnded={() => setPlayingId(null)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const audioId = `${item.id}-original`
                      if (playingId === audioId) {
                        handlePause(audioId)
                      } else {
                        handlePlay(item, true)
                      }
                    }}
                  >
                    {playingId === `${item.id}-original` ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDownload(item, true)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm">{item.transcription}</p>
              </div>
            </div>

            {item.translatedText && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {LANGUAGES[item.targetLanguage!]} Translation
                  </span>
                  <div className="flex items-center gap-1">
                    <audio
                      data-id={`${item.id}-translated`}
                      src={audioUrls[`${item.id}-translated`]}
                      onEnded={() => setPlayingId(null)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        const audioId = `${item.id}-translated`
                        if (playingId === audioId) {
                          handlePause(audioId)
                        } else {
                          handlePlay(item, false)
                        }
                      }}
                    >
                      {playingId === `${item.id}-translated` ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDownload(item, false)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm">{item.translatedText}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 