"use client"

import { useState } from "react"
import Link from "next/link"
import { History, Mic, HelpCircle, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AudioTranscriber } from "@/app/components/audio-transcriber"
import { LanguageSelector } from "@/app/components/language-selector"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function HomePage() {
  const [selectedLanguage, setSelectedLanguage] = useState("tw")

  const NavLinks = () => (
    <>
      <div className="flex items-center gap-2">
        <Link href="/record">
          <Button variant="outline" size="sm" className="flex items-center gap-2 whitespace-nowrap">
            <Mic className="h-4 w-4" />
            Record Audio
          </Button>
        </Link>
        <Link href="/history">
          <Button variant="outline" size="sm" className="flex items-center gap-2 whitespace-nowrap">
            <History className="h-4 w-4" />
            View History
          </Button>
        </Link>
      </div>
      <Separator orientation="vertical" className="mx-2 h-6" />
      <Link href="/guide">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          Guide
        </Button>
      </Link>
    </>
  )

  return (
    <div className="flex h-full flex-col">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Header for larger screens */}
        <div className="hidden md:flex items-center justify-between py-4 px-8">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h2 className="text-xl font-bold">GhanaNLP Web</h2>
          </Link>
          <div className="flex items-center">
            <NavLinks />
          </div>
        </div>

        {/* Header for mobile screens */}
        <div className="flex md:hidden items-center justify-between py-4 px-4">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h2 className="text-lg font-bold">GhanaNLP Web</h2>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-4">
                <Link href="/record">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Mic className="h-4 w-4" />
                    Record Audio
                  </Button>
                </Link>
                <Link href="/history">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <History className="h-4 w-4" />
                    View History
                  </Button>
                </Link>
                <Link href="/guide">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Guide
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Separator />

        {/* Main content */}
        <div className="p-4 md:p-8">
          {/* Language selector for mobile */}
          <div className="block md:hidden mb-6">
            <h3 className="text-sm font-medium mb-2">Target Language</h3>
            <LanguageSelector onValueChange={setSelectedLanguage} />
          </div>

          {/* Main grid layout */}
          <div className="grid gap-6 md:gap-12 md:grid-cols-[1fr_200px]">
            <div className="flex-1 min-h-[500px] md:min-h-[600px]">
              <AudioTranscriber selectedLanguage={selectedLanguage} />
            </div>
            {/* Language selector for desktop */}
            <div className="hidden md:block space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Target Language</h3>
                <LanguageSelector onValueChange={setSelectedLanguage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 