"use client"

import { Button } from "@/components/ui/button"

interface MoodSelectorProps {
  selectedMood: number
  selectedMoodLabel: string
  onMoodChange: (mood: number) => void
  onMoodLabelChange: (label: string) => void
}

const moodOptions = [
  { value: 1, label: "非常低落", emoji: "😢", color: "bg-red-500", description: "感到沮喪、難過或絕望" },
  { value: 2, label: "有些低落", emoji: "😔", color: "bg-orange-500", description: "心情不太好，有些煩躁" },
  { value: 3, label: "平靜", emoji: "😐", color: "bg-yellow-500", description: "情緒穩定，沒有特別的起伏" },
  { value: 4, label: "愉快", emoji: "😊", color: "bg-green-500", description: "心情不錯，感到滿足" },
  { value: 5, label: "非常開心", emoji: "😄", color: "bg-blue-500", description: "充滿活力，非常快樂" },
]

export function MoodSelector({ selectedMood, selectedMoodLabel, onMoodChange, onMoodLabelChange }: MoodSelectorProps) {
  const handleMoodSelect = (mood: number, label: string) => {
    onMoodChange(mood)
    onMoodLabelChange(label)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {moodOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedMood === option.value ? "default" : "outline"}
            className={`h-auto p-4 flex flex-col items-center gap-2 ${
              selectedMood === option.value ? option.color + " text-white" : ""
            }`}
            onClick={() => handleMoodSelect(option.value, option.label)}
          >
            <span className="text-2xl">{option.emoji}</span>
            <span className="font-medium">{option.label}</span>
          </Button>
        ))}
      </div>

      {selectedMood && (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {moodOptions.find((option) => option.value === selectedMood)?.description}
          </p>
        </div>
      )}
    </div>
  )
}
