"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const LANGUAGES = [
  { value: 'tw', label: 'Twi' },
  { value: 'gaa', label: 'Ga' },
  { value: 'ee', label: 'Ewe' },
  { value: 'fat', label: 'Fante' },
  { value: 'dag', label: 'Dagbani' },
  { value: 'gur', label: 'Gurene' },
] as const

export function LanguageSelector() {
  return (
    <Select defaultValue="tw">
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((language) => (
          <SelectItem key={language.value} value={language.value}>
            {language.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 