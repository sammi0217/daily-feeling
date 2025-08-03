"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import type { MoodEntry } from "../page"

interface MoodTrendsProps {
  entries: MoodEntry[]
  onBack: () => void
}

export function MoodTrends({ entries, onBack }: MoodTrendsProps) {
  if (entries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold">趨勢分析</h1>
          </div>

          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">需要更多數據來分析趨勢</p>
              <p className="text-sm text-gray-400 mt-2">記錄更多心情後，這裡會顯示你的情緒趨勢</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const averageMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length

  const moodDistribution = entries.reduce(
    (acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    },
    {} as Record<number, number>,
  )

  const moodLabels = {
    1: "非常不愉快",
    2: "不愉快",
    3: "情緒中性",
    4: "愉快",
    5: "非常愉快",
  }

  const moodColors = {
    1: "bg-purple-500",
    2: "bg-blue-500",
    3: "bg-cyan-500",
    4: "bg-orange-500",
    5: "bg-red-500",
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">趨勢分析</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>平均心情</CardTitle>
              <CardDescription>基於 {entries.length} 條記錄</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-blue-600">{averageMood.toFixed(1)}</div>
                <p className="text-gray-600">{moodLabels[Math.round(averageMood) as keyof typeof moodLabels]}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>心情分布</CardTitle>
              <CardDescription>各種心情狀態的出現頻率</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(moodDistribution)
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([mood, count]) => {
                    const percentage = ((count / entries.length) * 100).toFixed(1)
                    return (
                      <div key={mood} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{moodLabels[Number(mood) as keyof typeof moodLabels]}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${moodColors[Number(mood) as keyof typeof moodColors]}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
