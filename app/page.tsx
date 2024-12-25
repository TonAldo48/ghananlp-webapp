import { AudioTranscriber } from '@/app/components/audio-transcriber'

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">
          Audio Transcription & Translation
        </h1>
        <p className="text-gray-600">
          Convert your audio to text and translate it to Ghanaian languages
        </p>
      </div>
      <AudioTranscriber />
    </main>
  )
}
