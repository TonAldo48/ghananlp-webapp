"use client"

import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslationHistory } from "@/app/hooks/use-translation-history"
import { AudioPlayer } from "@/app/components/audio-player"
import { Textarea } from "@/components/ui/textarea"

interface TranslationHistoryProps {
  onClearHistory?: () => void
}

export function TranslationHistory({ onClearHistory }: TranslationHistoryProps) {
  const { history, removeFromHistory } = useTranslationHistory()
  const [audioUrls, setAudioUrls] = useState<{ [key: string]: string }>({})

  // Create audio URLs from base64 data
  useEffect(() => {
    const urls: { [key: string]: string } = {}
    
    history.forEach((item) => {
      if (item.originalAudioData && item.originalAudioType) {
        const blob = base64ToBlob(item.originalAudioData, item.originalAudioType)
        urls[`original-${item.id}`] = URL.createObjectURL(blob)
      }
      if (item.translatedAudioData && item.translatedAudioType) {
        const blob = base64ToBlob(item.translatedAudioData, item.translatedAudioType)
        urls[`translated-${item.id}`] = URL.createObjectURL(blob)
      }
    })

    setAudioUrls(urls)

    // Cleanup URLs on unmount
    return () => {
      Object.values(urls).forEach(url => URL.revokeObjectURL(url))
    }
  }, [history])

  const base64ToBlob = (base64: string, type: string): Blob => {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type })
  }

  const handleRemove = (id: string) => {
    // Clean up audio URLs
    URL.revokeObjectURL(audioUrls[`original-${id}`])
    URL.revokeObjectURL(audioUrls[`translated-${id}`])
    
    // Remove from state
    const newUrls = { ...audioUrls }
    delete newUrls[`original-${id}`]
    delete newUrls[`translated-${id}`]
    setAudioUrls(newUrls)
    
    // Remove from history
    removeFromHistory(id)
  }

  if (history.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No translations yet
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {history.map((item) => (
        <Card key={item.id}>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {item.originalFileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {audioUrls[`original-${item.id}`] && (
              <div className="rounded-lg border p-4">
                <AudioPlayer src={audioUrls[`original-${item.id}`]} />
              </div>
            )}

            {item.transcription && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Transcription</h3>
                <Textarea
                  value={item.transcription}
                  readOnly
                  className="min-h-[100px] resize-none"
                />
              </div>
            )}

            {item.translatedText && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Translation</h3>
                  <Textarea
                    value={item.translatedText}
                    readOnly
                    className="min-h-[100px] resize-none"
                  />
                </div>

                {audioUrls[`translated-${item.id}`] && (
                  <div className="rounded-lg border p-4">
                    <AudioPlayer src={audioUrls[`translated-${item.id}`]} />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 