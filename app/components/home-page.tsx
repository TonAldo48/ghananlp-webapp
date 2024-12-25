"use client"

import { useState } from "react"
import Link from "next/link"
import { History, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AudioTranscriber } from "@/app/components/audio-transcriber"
import { LanguageSelector } from "@/app/components/language-selector"

export function HomePage() {
  const [selectedLanguage, setSelectedLanguage] = useState("tw")

  return (
    <div className="flex h-full flex-col">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="flex items-center justify-between py-4 px-8">
          <h2 className="text-lg font-semibold">Audio Translation</h2>
          <div className="flex items-center gap-2">
            <Link href="/record">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Record Audio
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                View History
              </Button>
            </Link>
          </div>
        </div>
        <Separator />
        <div className="grid flex-1 gap-12 md:grid-cols-[1fr_200px] p-8">
          <div className="flex-1 min-h-[600px]">
            <AudioTranscriber selectedLanguage={selectedLanguage} />
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Target Language</h3>
              <LanguageSelector onValueChange={setSelectedLanguage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 