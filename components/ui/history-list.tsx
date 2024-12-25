import { ScrollArea } from "@/components/ui/scroll-area"

interface HistoryItem {
  id: string
  timestamp: string
  text: string
  language: string
}

interface HistoryListProps {
  items?: HistoryItem[]
}

export function HistoryList({ items = [] }: HistoryListProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-[450px] items-center justify-center text-sm text-muted-foreground">
        No transcription history yet
      </div>
    )
  }

  return (
    <ScrollArea className="h-[450px] pr-4">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col space-y-2 rounded-lg border p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {item.timestamp}
              </span>
              <span className="text-xs font-medium">{item.language}</span>
            </div>
            <p className="text-sm">{item.text}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
} 