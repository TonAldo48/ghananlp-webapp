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

// Helper function to safely parse JSON with a fallback
const safeJSONParse = (str: string | null): TranslationHistoryItem[] => {
  if (!str) return []
  try {
    const parsed = JSON.parse(str)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Failed to parse history:', error)
    return []
  }
}

// Helper function to safely stringify JSON
const safeJSONStringify = (data: TranslationHistoryItem[]): string => {
  try {
    return JSON.stringify(data)
  } catch (error) {
    console.error('Failed to stringify history:', error)
    return '[]'
  }
}

export function useTranslationHistory() {
  const [history, setHistory] = useState<TranslationHistoryItem[]>(() => {
    // Initialize from localStorage during hook initialization
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      return safeJSONParse(stored)
    }
    return []
  })

  // Save to localStorage whenever history changes
  useEffect(() => {
    try {
      const serialized = safeJSONStringify(history)
      localStorage.setItem(STORAGE_KEY, serialized)
      console.log('Saved history to localStorage:', history.length, 'items')
    } catch (error) {
      console.error('Failed to save history to localStorage:', error)
    }
  }, [history])

  const addToHistory = (item: TranslationHistoryItem) => {
    console.log('Adding item to history:', item)
    setHistory(prev => {
      const newHistory = [item, ...prev]
      return newHistory
    })
  }

  const updateHistory = (id: string, updates: Partial<TranslationHistoryItem>) => {
    console.log('Updating history item:', id, updates)
    setHistory(prev => {
      const newHistory = prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
      return newHistory
    })
  }

  const clearHistory = () => {
    console.log('Clearing history')
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const removeFromHistory = (id: string) => {
    console.log('Removing item from history:', id)
    setHistory(prev => {
      const newHistory = prev.filter(item => item.id !== id)
      return newHistory
    })
  }

  return {
    history,
    addToHistory,
    updateHistory,
    clearHistory,
    removeFromHistory,
  }
} 