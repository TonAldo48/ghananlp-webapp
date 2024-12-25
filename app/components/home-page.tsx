"use client"

import Link from "next/link"
import { HelpCircle, History, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function HomePage() {
  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">GhanaNLP Web</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Transcribe and translate audio between English and Ghanaian languages.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/guide">
          <Button variant="outline" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Guide
          </Button>
        </Link>

        <Separator orientation="vertical" className="h-8" />

        <Link href="/record">
          <Button className="gap-2">
            <Mic className="h-4 w-4" />
            Record Audio
          </Button>
        </Link>

        <Link href="/history">
          <Button variant="outline" className="gap-2">
            <History className="h-4 w-4" />
            View History
          </Button>
        </Link>
      </div>
    </div>
  )
} 