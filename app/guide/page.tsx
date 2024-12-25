"use client"

import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function GuidePage() {
  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold">About GhanaNLP Web</h1>
        <p className="text-lg text-muted-foreground">
          GhanaNLP Web is a web application that allows you to transcribe and translate audio between English and Ghanaian languages.
        </p>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
            <div className="space-y-4">
              <p>
                You can use GhanaNLP Web in two ways:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Upload an audio file for transcription and translation</li>
                <li>Record audio directly in your browser</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">File Upload</h2>
            <div className="space-y-4">
              <p>
                To upload an audio file:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Click the upload button or drag and drop a file</li>
                <li>Select your target language</li>
                <li>Click "Transcribe" to start the process</li>
                <li>Review the transcription and click "Translate"</li>
              </ol>
              <p>
                Supported file formats: WAV, MP3, M4A
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Live Recording</h2>
            <div className="space-y-4">
              <p>
                To record audio directly:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Click the "Record Audio" button</li>
                <li>Allow microphone access when prompted</li>
                <li>Click the microphone icon to start recording</li>
                <li>Click the stop button when finished</li>
                <li>Follow the same steps as file upload for transcription and translation</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Translation History</h2>
            <div className="space-y-4">
              <p>
                Your translation history is saved automatically and can be accessed by clicking the "View History" button. Each entry includes:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Original audio</li>
                <li>Transcription</li>
                <li>Translation</li>
                <li>Translated audio (when available)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Supported Languages</h2>
            <div className="space-y-4">
              <p>
                Currently supported Ghanaian languages:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Twi (Akan)</li>
                <li>Ga</li>
                <li>Ewe</li>
                <li>Dagbani</li>
                <li>Gurene</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Tips for Best Results</h2>
            <div className="space-y-4">
              <ul className="list-disc list-inside space-y-2">
                <li>Use clear audio with minimal background noise</li>
                <li>Speak at a normal pace and volume</li>
                <li>Keep recordings under 5 minutes for optimal performance</li>
                <li>Use headphones when playing back translations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <a
              href="https://ghananlp.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline inline-flex items-center"
            >
              GhanaNLP
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Want to use our translation services in your own application?{" "}
            <a
              href="https://ghananlp.org/services"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline inline-flex items-center"
            >
              Learn more
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 