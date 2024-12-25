"use client"

import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { Play, Pause, Download, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useTranslationHistory, TranslationHistoryItem } from "@/app/hooks/use-translation-history"
import { AudioPlayer } from "@/app/components/audio-player"

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

interface HistoryItemTextProps {
  text: string
}

function HistoryItemText({ text }: HistoryItemTextProps) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = 'auto'
      textRef.current.style.height = `${Math.max(80, textRef.current.scrollHeight)}px`
    }
  }, [text])

  return (
    <div 
      ref={textRef}
      className="rounded-lg border p-3 md:p-4 overflow-y-auto whitespace-pre-wrap break-words"
      style={{ maxHeight: '300px' }}
    >
      <p className="text-sm">{text}</p>
    </div>
  )
}

export function TranslationHistory() {
  const { history, removeFromHistory } = useTranslationHistory()
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({})

  // Create object URLs for audio data when history changes
  useEffect(() => {
    console.log('Creating audio URLs for', history.length, 'items')
    const urls: Record<string, string> = {}
    
    history.forEach(item => {
      try {
        // Create URL for original audio
        const originalBlob = base64ToBlob(item.originalAudioData, item.originalAudioType)
        urls[`${item.id}-original`] = URL.createObjectURL(originalBlob)
        console.log('Created URL for original audio:', item.id)
        
        // Create URL for translated audio if available
        if (item.translatedAudioData && item.translatedAudioType) {
          const translatedBlob = base64ToBlob(item.translatedAudioData, item.translatedAudioType)
          urls[`${item.id}-translated`] = URL.createObjectURL(translatedBlob)
          console.log('Created URL for translated audio:', item.id)
        }
      } catch (error) {
        console.error('Failed to create audio URL for item:', item.id, error)
      }
    })

    // Clean up old URLs before setting new ones
    Object.values(audioUrls).forEach(url => {
      try {
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Failed to revoke URL:', url, error)
      }
    })

    setAudioUrls(urls)

    // Cleanup URLs when component unmounts or history changes
    return () => {
      Object.values(urls).forEach(url => {
        try {
          URL.revokeObjectURL(url)
        } catch (error) {
          console.error('Failed to revoke URL during cleanup:', url, error)
        }
      })
    }
  }, [history])

  const base64ToBlob = (base64: string, type: string) => {
    try {
      const byteCharacters = atob(base64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      return new Blob([byteArray], { type })
    } catch (error) {
      console.error('Failed to convert base64 to blob:', error)
      throw error
    }
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
      <div className="flex h-[400px] md:h-[600px] items-center justify-center text-center p-4">
        <div className="space-y-2">
          <p className="text-base md:text-lg font-medium">No translation history yet</p>
          <p className="text-sm text-muted-foreground">
            Your translation history will appear here after you translate some audio.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {history.map((item) => (
        <div
          key={item.id}
          className="flex flex-col space-y-4 rounded-lg border p-4 md:p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <span className="text-base md:text-lg font-medium truncate">
                {item.originalFileName}
              </span>
              <Badge variant={STATUS_BADGES[item.status].variant} className="w-fit">
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
            <div className="flex items-center justify-between md:justify-end gap-2">
              <span className="text-xs md:text-sm text-muted-foreground">
                {format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive shrink-0"
                onClick={() => removeFromHistory(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Original Audio</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDownload(item, true)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="rounded-lg border p-3 md:p-4 space-y-3 md:space-y-4">
                <AudioPlayer 
                  src={audioUrls[`${item.id}-original`]}
                  onPlayStateChange={(isPlaying) => {
                    if (isPlaying) {
                      setPlayingId(`${item.id}-original`)
                    } else if (playingId === `${item.id}-original`) {
                      setPlayingId(null)
                    }
                  }}
                />
                <HistoryItemText text={item.transcription} />
              </div>
            </div>

            {item.translatedText && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {LANGUAGES[item.targetLanguage!]} Translation
                  </span>
                  {item.translatedAudioData && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDownload(item, false)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="rounded-lg border p-3 md:p-4 space-y-3 md:space-y-4">
                  {item.translatedAudioData && (
                    <AudioPlayer 
                      src={audioUrls[`${item.id}-translated`]}
                      onPlayStateChange={(isPlaying) => {
                        if (isPlaying) {
                          setPlayingId(`${item.id}-translated`)
                        } else if (playingId === `${item.id}-translated`) {
                          setPlayingId(null)
                        }
                      }}
                    />
                  )}
                  <HistoryItemText text={item.translatedText} />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 