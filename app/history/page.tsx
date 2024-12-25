"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TranslationHistory } from "@/app/components/translation-history"
import { useTranslationHistory } from "@/app/hooks/use-translation-history"

export default function HistoryPage() {
  const { clearHistory } = useTranslationHistory()

  return (
    <div className="flex h-full flex-col">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Header for larger screens */}
        <div className="hidden md:flex items-center justify-between py-4 px-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Translation History</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearHistory}
          >
            Clear History
          </Button>
        </div>

        {/* Header for mobile screens */}
        <div className="flex md:hidden items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold">Translation History</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearHistory}
          >
            Clear
          </Button>
        </div>

        <Separator />
        
        {/* Main content */}
        <div className="p-4 md:p-8">
          <div className="rounded-lg border bg-card">
            <TranslationHistory />
          </div>
        </div>
      </div>
    </div>
  )
} 