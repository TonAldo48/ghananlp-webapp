"use client"

import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

export default function GuidePage() {
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
            <h1 className="text-2xl font-bold">User Guide</h1>
          </div>
        </div>
        
        <Separator className="mb-8" />

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>About GhanaNLP Web</CardTitle>
              <CardDescription>
                Powered by GhanaNLP's translation services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                GhanaNLP Web uses <a href="https://ghananlp.org" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">GhanaNLP</a>'s advanced translation services to provide accurate and natural-sounding translations. GhanaNLP is a pioneering project focused on making Ghanaian languages more accessible in the digital age.
              </p>
              <h3 className="font-medium">Two Ways to Translate</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Upload an audio file (MP3, WAV, or M4A)</li>
                <li>Record audio directly in your browser</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>File Upload Method</CardTitle>
              <CardDescription>
                Convert existing audio files to Ghanaian languages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2">
                <li>Click the upload area or drag and drop your audio file</li>
                <li>Select your target language from the dropdown</li>
                <li>Click "Transcribe Audio" to convert speech to text</li>
                <li>Review the transcription for accuracy</li>
                <li>Click "Translate" to convert to your selected language</li>
                <li>Listen to the translated audio or download it</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Recording Method</CardTitle>
              <CardDescription>
                Record and translate in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2">
                <li>Click the "Record Audio" button in the top menu</li>
                <li>Select your target language</li>
                <li>Click the microphone button to start recording</li>
                <li>Click the stop button when finished</li>
                <li>Click "Transcribe & Translate" to process the audio</li>
                <li>Review the results and play the translated audio</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Translation History</CardTitle>
              <CardDescription>
                Access your previous translations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2">
                <li>All translations are automatically saved</li>
                <li>Access history by clicking "View History" in the top menu</li>
                <li>Play both original and translated audio</li>
                <li>View transcriptions and translations</li>
                <li>Clear history or individual items as needed</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supported Languages</CardTitle>
              <CardDescription>
                Currently available Ghanaian languages through GhanaNLP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                GhanaNLP Web leverages GhanaNLP's translation services to support the following languages:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Twi (Akan) - Most widely spoken</li>
                <li>Ewe</li>
                <li>Ga</li>
                <li>Dagbani</li>
                <li>More languages coming soon</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Visit <a href="https://ghananlp.org" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">GhanaNLP's website</a> to learn more about their work in natural language processing for Ghanaian languages.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Best Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Use clear audio with minimal background noise</li>
                <li>Keep audio files under 10MB for optimal processing</li>
                <li>Speak clearly and at a moderate pace</li>
                <li>Use a good quality microphone for recordings</li>
                <li>Review transcriptions before translating</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center space-y-4">
          <a 
            href="https://ghananlp.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            Learn more about GhanaNLP's translation services
            <ExternalLink className="h-4 w-4" />
          </a>

          <div className="pt-4 border-t">
            <a 
              href="https://github.com/tonaldo48" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Created with <span className="text-red-500">❤️</span> by tonaldo48
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 