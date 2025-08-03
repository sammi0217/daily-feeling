"use client"

import { Card, CardContent } from "@/components/ui/card"

interface MoodOption {
  value: number
  label: string
  gradient: string
  pattern: string
  color: string
}

interface MoodCardProps {
  mood: MoodOption
  onClick: () => void
}

export function MoodCard({ mood, onClick }: MoodCardProps) {
  return (
    <Card
      className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${mood.gradient} border-0 group`}
      onClick={onClick}
    >
      <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-300">
        <div className={`mood-pattern ${mood.pattern}`} />
      </div>
      <CardContent className="p-8 text-center relative z-10">
        <h3 className="text-xl font-bold text-white mb-4">{mood.label}</h3>
        <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <div className="w-8 h-8 bg-white/40 rounded-full animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}
