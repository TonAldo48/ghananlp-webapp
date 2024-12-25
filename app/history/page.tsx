import { HistoryList } from "@/components/ui/history-list"

export default function HistoryPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Translation History</h1>
      <HistoryList />
    </div>
  )
} 