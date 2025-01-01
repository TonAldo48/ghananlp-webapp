import { useState, useEffect } from 'react'

const USAGE_LIMIT = 10
const STORAGE_KEY = 'translation-usage-count'

export function useTranslationLimit() {
  const [usageCount, setUsageCount] = useState<number>(() => {
    // Initialize from localStorage during hook initialization
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? parseInt(stored, 10) : 0
    }
    return 0
  })

  // Save to localStorage whenever count changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, usageCount.toString())
    } catch (error) {
      console.error('Failed to save usage count to localStorage:', error)
    }
  }, [usageCount])

  const incrementUsage = () => {
    setUsageCount(prev => prev + 1)
  }

  const resetUsage = () => {
    setUsageCount(0)
    localStorage.setItem(STORAGE_KEY, '0')
  }

  const remainingUsage = USAGE_LIMIT - usageCount
  const hasReachedLimit = usageCount >= USAGE_LIMIT

  return {
    usageCount,
    remainingUsage,
    hasReachedLimit,
    incrementUsage,
    resetUsage,
  }
} 