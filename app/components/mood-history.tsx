"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import type { MoodEntry } from "../page"

interface MoodHistoryProps {
  entries: MoodEntry[]
  onBack: () => void
}

const moodColors = {
  1: "from-purple-400 to-purple-600",
  2: "from-blue-400 to-indigo-500",
  3: "from-cyan-300 to-blue-400",
  4: "from-yellow-400 to-orange-500",
  5: "from-orange-400 to-red-400",
}

export function MoodHistory({ entries, onBack }: MoodHistoryProps) {
  if (entries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold">歷史記錄</h1>
          </div>

          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">還沒有任何情緒記錄</p>
              <p className="text-sm text-gray-400 mt-2">開始記錄你的第一個心情吧！</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">歷史記錄</h1>
        </div>

        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${moodColors[entry.mood as keyof typeof moodColors]}`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{entry.moodLabel}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString("zh-TW", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "long",
                      })}
                    </p>
                    {entry.notes && <p className="text-gray-700 mt-3 p-3 bg-gray-50 rounded-lg">{entry.notes}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
