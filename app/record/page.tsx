"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AudioRecorder } from "@/app/components/audio-recorder"
import { LanguageSelector } from "@/app/components/language-selector"
import { Card } from "@/components/ui/card"

export default function RecordPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("tw")

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Voice Translation</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Target Language:</span>
            <div className="w-40">
              <LanguageSelector onValueChange={setSelectedLanguage} />
            </div>
          </div>
        </div>
        
        <Separator className="mb-8" />
        
        <Card className="p-6">
          <AudioRecorder selectedLanguage={selectedLanguage} />
        </Card>
      </div>
    </div>
  )
} 