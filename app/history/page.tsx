"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TranslationHistory } from "@/app/components/translation-history"
import { useTranslationHistory } from "@/app/hooks/use-translation-history"

export default function HistoryPage() {
  const { clearHistory } = useTranslationHistory()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Translation History</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearHistory}
          >
            Clear History
          </Button>
        </div>
        
        <div className="bg-card rounded-lg border p-6">
          <TranslationHistory />
        </div>
      </div>
    </div>
  )
} 