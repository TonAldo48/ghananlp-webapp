import { useState, useEffect } from 'react'

export interface TranslationHistoryItem {
  id: string
  timestamp: string
  originalFileName: string
  originalAudioData: string
  originalAudioType: string
  transcription: string
  translatedText?: string
  translatedAudioData?: string
  translatedAudioType?: string
  targetLanguage?: string
  status: 'transcribing' | 'transcribed' | 'translating' | 'translated'
}

const STORAGE_KEY = 'translation-history'

export function useTranslationHistory() {
  const [history, setHistory] = useState<TranslationHistoryItem[]>([])

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setHistory(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to parse history:', error)
        setHistory([])
      }
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

  const addToHistory = (item: TranslationHistoryItem) => {
    setHistory(prev => [item, ...prev])
  }

  const updateHistory = (id: string, updates: Partial<TranslationHistoryItem>) => {
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }

  return {
    history,
    addToHistory,
    updateHistory,
    clearHistory,
    removeFromHistory,
  }
} 