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
            <h1 className="text-xl font-bold">Voice Translation</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Target Language:</span>
            <div className="w-40">
              <LanguageSelector onValueChange={setSelectedLanguage} />
            </div>
          </div>
        </div>

        {/* Header for mobile screens */}
        <div className="flex md:hidden flex-col gap-4 py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-lg font-bold">Voice Translation</h1>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Target Language</span>
            <LanguageSelector onValueChange={setSelectedLanguage} />
          </div>
        </div>

        <Separator />
        
        {/* Main content */}
        <div className="p-4 md:p-8">
          <Card className="p-4 md:p-6">
            <AudioRecorder selectedLanguage={selectedLanguage} />
          </Card>
        </div>
      </div>
    </div>
  )
} 