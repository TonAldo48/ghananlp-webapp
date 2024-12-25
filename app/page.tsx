import { Metadata } from "next"
import { HomePage } from "@/app/components/home-page"

export const metadata: Metadata = {
  title: "Audio Translation",
  description: "Transcribe and translate audio using GhanaNLP.",
}

export default function Page() {
  return <HomePage />
} 