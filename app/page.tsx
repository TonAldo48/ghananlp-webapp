import { Metadata } from "next"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { AudioTranscriber } from "@/app/components/audio-transcriber"
import { LanguageSelector } from "@/app/components/language-selector"

export const metadata: Metadata = {
  title: "Audio Translation",
  description: "Transcribe and translate audio using GhanaNLP.",
}

export default function HomePage() {
  return (
    <div className="flex h-full flex-col">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="flex items-center justify-between py-4 px-8">
          <h2 className="text-lg font-semibold">Audio Translation</h2>
          <Button variant="ghost" size="sm" className="flex items-center">
            <RotateCcw className="mr-2 h-4 w-4" />
            Clear History
          </Button>
        </div>
        <Separator />
        <div className="grid flex-1 gap-12 md:grid-cols-[1fr_200px] p-8">
          <div className="flex-1 min-h-[600px]">
            <AudioTranscriber />
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Mode</h3>
              <Tabs defaultValue="transcribe">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="transcribe" className="text-sm">
                    Transcribe
                  </TabsTrigger>
                  <TabsTrigger value="history" className="text-sm">
                    History
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="transcribe">
                  <div className="space-y-2 mt-4">
                    <h3 className="text-sm font-medium">Target Language</h3>
                    <LanguageSelector />
                  </div>
                </TabsContent>
                <TabsContent value="history">
                  {/* History content will be added later */}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 