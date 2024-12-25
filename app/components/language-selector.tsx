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

interface LanguageSelectorProps {
  onValueChange?: (value: string) => void
}

export function LanguageSelector({ onValueChange }: LanguageSelectorProps) {
  return (
    <Select 
      defaultValue="tw" 
      onValueChange={onValueChange}
      data-language-selector
    >
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