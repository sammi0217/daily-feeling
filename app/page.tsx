"use client"

import { useState, useEffect } from "react"
import { Calendar, BarChart3, Plus, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

export type MoodEntry = {
  id: number
  mood: number
  moodName: string
  date: string
  timestamp: string
  notes?: string
}

const CuteMoodTracker = () => {
  const [currentView, setCurrentView] = useState<"record" | "calendar" | "analytics" | "view">("record")
  const [selectedMood, setSelectedMood] = useState(3)
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [notes, setNotes] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState("週")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [recordingDate, setRecordingDate] = useState(new Date())
  const [viewingEntry, setViewingEntry] = useState<MoodEntry | null>(null)

  // 可愛幾何形狀心情配置
  const moodOptions = [
    {
      id: 1,
      name: "很難過",
      shape: "triangle",
      color: "#8B5CF6",
      gradient: "from-purple-400 via-purple-500 to-purple-600",
      bgGradient: "from-purple-900 via-purple-800 to-purple-700",
    },
    {
      id: 2,
      name: "有點難過",
      shape: "square",
      color: "#3B82F6",
      gradient: "from-blue-400 via-blue-500 to-blue-600",
      bgGradient: "from-blue-900 via-blue-800 to-blue-700",
    },
    {
      id: 3,
      name: "還好",
      shape: "circle",
      color: "#10B981",
      gradient: "from-emerald-400 via-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-900 via-emerald-800 to-emerald-700",
    },
    {
      id: 4,
      name: "開心",
      shape: "heart",
      color: "#F59E0B",
      gradient: "from-amber-400 via-orange-500 to-orange-600",
      bgGradient: "from-orange-900 via-orange-800 to-orange-700",
    },
    {
      id: 5,
      name: "超開心",
      shape: "star",
      color: "#EF4444",
      gradient: "from-pink-400 via-red-500 to-red-600",
      bgGradient: "from-red-900 via-red-800 to-red-700",
    },
  ]

  useEffect(() => {
    const saved = localStorage.getItem("cute-mood-history")
    if (saved) {
      setMoodHistory(JSON.parse(saved))
    }
  }, [])

  // 處理心情變化時的形狀漸變
  const handleMoodChange = (newMood: number) => {
    if (newMood !== selectedMood) {
      setIsTransitioning(true)
      setTimeout(() => {
        setSelectedMood(newMood)
        setIsTransitioning(false)
      }, 300)
    }
  }

  // 滾動到指定日期
  const scrollToDate = (targetDate: Date) => {
    setTimeout(() => {
      const month = targetDate.getMonth()
      const day = targetDate.getDate()

      // 先滾動到對應月份
      const monthElement = document.getElementById(`month-${month}`)
      if (monthElement) {
        monthElement.scrollIntoView({ behavior: "smooth", block: "start" })

        // 然後嘗試滾動到具體日期
        setTimeout(() => {
          const dateElement = document.getElementById(`date-${targetDate.getFullYear()}-${month}-${day}`)
          if (dateElement) {
            dateElement.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 500)
      }
    }, 100)
  }

  const saveMood = () => {
    const moodOption = moodOptions.find((m) => m.id === selectedMood)
    if (!moodOption) return

    setIsAnimating(true)

    setTimeout(() => {
      // 使用本地時間格式化日期，避免時區問題
      const year = recordingDate.getFullYear()
      const month = String(recordingDate.getMonth() + 1).padStart(2, "0")
      const day = String(recordingDate.getDate()).padStart(2, "0")
      const dateStr = `${year}-${month}-${day}`

      const newEntry: MoodEntry = {
        id: Date.now(),
        mood: selectedMood,
        moodName: moodOption.name,
        date: dateStr, // 使用本地時間格式化的日期
        timestamp: new Date().toISOString(),
        notes: notes.trim() || undefined, // 確保空字符串不被保存
      }

      const updated = [...moodHistory.filter((entry) => entry.date !== newEntry.date), newEntry]
      setMoodHistory(updated)
      localStorage.setItem("cute-mood-history", JSON.stringify(updated))

      setNotes("")
      setIsAnimating(false)

      // 跳轉回日曆並滾動到記錄的日期
      setCurrentView("calendar")
      setCurrentDate(new Date(recordingDate)) // 確保 currentDate 也更新
      scrollToDate(recordingDate)
    }, 2000)
  }

  const currentConfig = moodOptions.find((m) => m.id === selectedMood)!

  // 格式化日期顯示
  const formatDateDisplay = (date: Date) => {
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    if (isToday) {
      return "今天感覺如何？"
    } else {
      return `${date.toLocaleDateString("zh-TW", {
        month: "long",
        day: "numeric",
      })}感覺如何？`
    }
  }

  // 可愛幾何形狀組件
  const CuteShape = ({ shape, color, size = 120, animated = false, glowing = false, transitioning = false }) => {
    const baseClasses = `transition-all duration-700 ease-in-out ${animated ? "animate-bounce-cute" : ""} ${
      glowing ? "animate-glow-pulse" : ""
    } ${transitioning ? "animate-morph-transition" : ""}`

    const mobileSize =
      typeof window !== "undefined" ? Math.min(size, window.innerWidth * 0.4) : Math.min(size, 375 * 0.4)

    switch (shape) {
      case "triangle":
        return (
          <div className={`relative ${baseClasses}`} style={{ width: mobileSize, height: mobileSize }}>
            <div
              className="absolute inset-0 animate-float-gentle transition-all duration-700"
              style={{
                width: 0,
                height: 0,
                borderLeft: `${mobileSize / 2}px solid transparent`,
                borderRight: `${mobileSize / 2}px solid transparent`,
                borderBottom: `${mobileSize}px solid ${color}`,
                filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
                margin: "auto",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center" style={{ top: "60%" }}>
              <div className="flex space-x-1.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-blink" />
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-blink" style={{ animationDelay: "0.1s" }} />
              </div>
            </div>
          </div>
        )

      case "square":
        return (
          <div className={`relative ${baseClasses}`} style={{ width: mobileSize, height: mobileSize }}>
            <div
              className="rounded-2xl animate-wiggle transition-all duration-700"
              style={{
                width: mobileSize,
                height: mobileSize,
                backgroundColor: color,
                filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex space-x-2 mb-1">
                <div className="w-2 h-2 bg-white rounded-full animate-blink" />
                <div className="w-2 h-2 bg-white rounded-full animate-blink" style={{ animationDelay: "0.2s" }} />
              </div>
              <div className="w-4 h-2 bg-white rounded-full opacity-80" />
            </div>
          </div>
        )

      case "circle":
        return (
          <div className={`relative ${baseClasses}`} style={{ width: mobileSize, height: mobileSize }}>
            <div
              className="rounded-full animate-breathe transition-all duration-700"
              style={{
                width: mobileSize,
                height: mobileSize,
                backgroundColor: color,
                filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex space-x-2 mb-1">
                <div className="w-1.5 h-0.5 bg-white rounded-full" />
                <div className="w-1.5 h-0.5 bg-white rounded-full" />
              </div>
              <div className="w-3 h-1.5 bg-white rounded-full opacity-60" />
            </div>
          </div>
        )

      case "heart":
        return (
          <div className={`relative ${baseClasses}`} style={{ width: mobileSize, height: mobileSize }}>
            <div className="animate-heart-beat transition-all duration-700">
              <div
                className="absolute transition-all duration-700"
                style={{
                  width: mobileSize * 0.6,
                  height: mobileSize * 0.5,
                  backgroundColor: color,
                  borderRadius: `${mobileSize * 0.3}px ${mobileSize * 0.3}px 0 0`,
                  transform: "rotate(-45deg)",
                  transformOrigin: "0 100%",
                  left: "50%",
                  top: "25%",
                  marginLeft: `-${mobileSize * 0.15}px`,
                  filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
                }}
              />
              <div
                className="absolute transition-all duration-700"
                style={{
                  width: mobileSize * 0.6,
                  height: mobileSize * 0.5,
                  backgroundColor: color,
                  borderRadius: `${mobileSize * 0.3}px ${mobileSize * 0.3}px 0 0`,
                  transform: "rotate(45deg)",
                  transformOrigin: "100% 100%",
                  left: "50%",
                  top: "25%",
                  marginLeft: `-${mobileSize * 0.45}px`,
                  filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center" style={{ top: "45%" }}>
              <div className="flex space-x-1.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-sparkle" />
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-sparkle" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          </div>
        )

      case "star":
        return (
          <div className={`relative ${baseClasses}`} style={{ width: mobileSize, height: mobileSize }}>
            <div className="animate-star-twinkle transition-all duration-700">
              <svg
                width={mobileSize}
                height={mobileSize}
                viewBox="0 0 24 24"
                fill={color}
                style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))" }}
                className="transition-all duration-700"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex space-x-1.5 mb-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              </div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // 查看記錄頁面
  if (currentView === "view" && viewingEntry) {
    const entryConfig = moodOptions.find((m) => m.id === viewingEntry.mood)!
    const entryDate = new Date(viewingEntry.date)

    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${entryConfig.bgGradient} text-white transition-all duration-1000 safe-area-inset`}
      >
        <div className="flex flex-col items-center justify-center px-6 space-y-8 py-20 min-h-screen">
          {/* 返回按鈕 */}
          <button
            onClick={() => setCurrentView("calendar")}
            className="absolute top-8 left-4 p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h2 className="text-xl font-bold">
              {entryDate.toLocaleDateString("zh-TW", {
                month: "long",
                day: "numeric",
              })}
              的心情記錄
            </h2>
            <p className="text-white/70 text-sm mt-1">
              {entryDate.toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </p>
            <p className="text-white/50 text-xs mt-1">
              記錄於 {new Date(viewingEntry.timestamp).toLocaleString("zh-TW")}
            </p>
          </div>

          <div className="relative">
            <CuteShape shape={entryConfig.shape} color={entryConfig.color} size={140} glowing={true} />

            <div className="absolute -inset-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-white/30 rounded-full animate-float-particles"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${10 + (i % 3) * 30}%`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <h3 className="text-2xl font-bold">{entryConfig.name}</h3>

          {/* 顯示筆記 */}
          {viewingEntry.notes && (
            <div className="w-full max-w-xs">
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  
                  
                </div>
                <p className="text-white text-sm leading-relaxed">{viewingEntry.notes}</p>
              </div>
            </div>
          )}

          {!viewingEntry.notes && (
            <div className="w-full max-w-xs">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-white/50 text-sm">當時沒有留下文字記錄</p>
              </div>
            </div>
          )}

          <Button
            onClick={() => setCurrentView("calendar")}
            className="w-full max-w-xs py-3 bg-white/20 hover:bg-white/30 text-white font-medium text-base rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
          >
            返回日曆
          </Button>
        </div>
      </div>
    )
  }

  // 記錄心情頁面
  if (currentView === "record") {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${currentConfig.bgGradient} text-white transition-all duration-1000 safe-area-inset`}
      >
        {isAnimating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl p-8 text-center w-full max-w-sm mx-auto transform animate-scale-in">
              <div className="flex justify-center mb-6">
                <CuteShape shape={currentConfig.shape} color={currentConfig.color} size={80} animated={true} />
              </div>
              <p className="text-gray-700 font-medium text-lg">正在保存你的心情...</p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center px-6 space-y-8 py-20 min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-bold">{formatDateDisplay(recordingDate)}</h2>
            <p className="text-white/70 text-sm mt-1">
              {recordingDate.toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </p>
          </div>

          <div className="relative">
            <CuteShape
              shape={currentConfig.shape}
              color={currentConfig.color}
              size={140}
              glowing={true}
              transitioning={isTransitioning}
            />

            <div className="absolute -inset-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-white/30 rounded-full animate-float-particles"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${10 + (i % 3) * 30}%`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <h3 className="text-2xl font-bold">{currentConfig.name}</h3>

          <div className="w-full max-w-xs space-y-5">
            <div className="relative">
              <input
                type="range"
                min="1"
                max="5"
                value={selectedMood}
                onChange={(e) => handleMoodChange(Number(e.target.value))}
                className="cute-slider w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2 px-1">
                {moodOptions.map((mood, index) => (
                  <div key={mood.id} className="flex flex-col items-center">
                    <div
                      className="w-3 h-3 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: selectedMood === mood.id ? mood.color : "rgba(255,255,255,0.3)",
                        transform: selectedMood === mood.id ? "scale(1.2)" : "scale(1)",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="想說些什麼嗎？"
              className="w-full h-16 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
            />

            <Button
              onClick={saveMood}
              className="w-full py-3 bg-white/20 hover:bg-white/30 text-white font-medium text-base rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
            >
              記錄心情
            </Button>
          </div>
        </div>

        {/* 底部導航 */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md p-4 safe-area-bottom">
          <div className="flex justify-center space-x-16">
            <button
              onClick={() => setCurrentView("calendar")}
              className="flex flex-col items-center space-y-1 text-white/60"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-xs">日曆</span>
            </button>
            <button
              onClick={() => setCurrentView("record")}
              className="flex flex-col items-center space-y-1 text-white"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs">記錄</span>
            </button>
            <button
              onClick={() => setCurrentView("analytics")}
              className="flex flex-col items-center space-y-1 text-white/60"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">分析</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 替換日曆頁面部分
  if (currentView === "calendar") {
    return (
      <div className="min-h-screen bg-gray-900 text-white safe-area-inset">
        {/* Apple Health風格年度視圖組件 - 手機優化版 */}
        {/* Apple Health風格年度視圖組件 - 圓角方形設計 */}
        <AppleHealthYearlyView
          moodHistory={moodHistory}
          moodOptions={moodOptions}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          onDateSelect={(selectedDate) => {
            setRecordingDate(selectedDate)
            setCurrentView("record")
          }}
          onEntryView={(entry) => {
            setViewingEntry(entry)
            setCurrentView("view")
          }}
        />

        {/* 底部導航 */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 safe-area-bottom">
          <div className="flex justify-center space-x-16">
            <button
              onClick={() => setCurrentView("calendar")}
              className="flex flex-col items-center space-y-1 text-white"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-xs">日曆</span>
            </button>
            <button
              onClick={() => setCurrentView("record")}
              className="flex flex-col items-center space-y-1 text-gray-400"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs">記錄</span>
            </button>
            <button
              onClick={() => setCurrentView("analytics")}
              className="flex flex-col items-center space-y-1 text-gray-400"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">分析</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 分析頁面
  return (
    <div className="min-h-screen bg-gray-900 text-white safe-area-inset">
      <div className="flex justify-between items-center p-4 pt-12">
        <button className="text-transparent">返回</button>
        <h1 className="text-lg font-medium">心理狀態</h1>
        <button className="text-blue-400">完成</button>
      </div>

      <AnalyticsView
        moodHistory={moodHistory}
        moodOptions={moodOptions}
        selectedTimeRange={selectedTimeRange}
        setSelectedTimeRange={setSelectedTimeRange}
      />

      {/* 底部導航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 safe-area-bottom">
        <div className="flex justify-center space-x-16">
          <button
            onClick={() => setCurrentView("calendar")}
            className="flex flex-col items-center space-y-1 text-gray-400"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">日曆</span>
          </button>
          <button
            onClick={() => setCurrentView("record")}
            className="flex flex-col items-center space-y-1 text-gray-400"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs">記錄</span>
          </button>
          <button
            onClick={() => setCurrentView("analytics")}
            className="flex flex-col items-center space-y-1 text-white"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">分析</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// 可愛小人物組件
const CuteCharacter = ({ mood, size = 32, isToday = false }) => {
  const characterConfig = {
    1: { color: "#8B5CF6", animation: "animate-character-sad" }, // 很難過 - 紫色
    2: { color: "#3B82F6", animation: "animate-character-down" }, // 有點難過 - 藍色
    3: { color: "#10B981", animation: "animate-character-neutral" }, // 還好 - 綠色
    4: { color: "#F59E0B", animation: "animate-character-happy" }, // 開心 - 橙色
    5: { color: "#EF4444", animation: "animate-character-excited" }, // 超開心 - 紅色
  }

  const config = characterConfig[mood] || characterConfig[3]

  return (
    <div className={`relative ${config.animation} transition-all duration-300`} style={{ width: size, height: size }}>
      {/* 小人物身體 */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full transition-all duration-300"
        style={{
          width: size * 0.6,
          height: size * 0.4,
          backgroundColor: config.color,
          boxShadow: isToday ? `0 0 8px ${config.color}` : "none",
        }}
      />

      {/* 小人物頭部 */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 rounded-full transition-all duration-300"
        style={{
          width: size * 0.5,
          height: size * 0.5,
          backgroundColor: config.color,
          boxShadow: isToday ? `0 0 6px ${config.color}` : "none",
        }}
      />

      {/* 小人物表情 */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center"
        style={{ width: size * 0.5, height: size * 0.5 }}
      >
        {/* 眼睛 */}
        <div className="flex space-x-1 mb-0.5">
          <div
            className="bg-white rounded-full"
            style={{
              width: size * 0.08,
              height: size * 0.08,
              ...(mood === 1 && { transform: "scaleY(0.5)" }), // 難過時眼睛變小
            }}
          />
          <div
            className="bg-white rounded-full"
            style={{
              width: size * 0.08,
              height: size * 0.08,
              ...(mood === 1 && { transform: "scaleY(0.5)" }),
            }}
          />
        </div>

        {/* 嘴巴 */}
        <div
          className="bg-white rounded-full transition-all duration-300"
          style={{
            width: size * (mood === 5 ? 0.15 : mood >= 4 ? 0.12 : mood === 3 ? 0.06 : 0.08),
            height: size * (mood === 1 ? 0.04 : mood === 2 ? 0.03 : 0.04),
            ...(mood === 1 && { transform: "rotate(180deg)" }), // 難過時嘴巴倒轉
            ...(mood === 2 && { opacity: 0.7 }), // 有點難過時嘴巴淡一點
            ...(mood >= 4 && { borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }), // 開心時嘴巴彎曲
          }}
        />
      </div>

      {/* 小人物手臂 */}
      <div className="absolute top-1/3 left-0 right-0">
        <div
          className="absolute rounded-full transition-all duration-300"
          style={{
            width: size * 0.15,
            height: size * 0.08,
            backgroundColor: config.color,
            left: size * 0.1,
            transform: mood >= 4 ? "rotate(-20deg)" : mood === 1 ? "rotate(20deg)" : "rotate(0deg)",
          }}
        />
        <div
          className="absolute rounded-full transition-all duration-300"
          style={{
            width: size * 0.15,
            height: size * 0.08,
            backgroundColor: config.color,
            right: size * 0.1,
            transform: mood >= 4 ? "rotate(20deg)" : mood === 1 ? "rotate(-20deg)" : "rotate(0deg)",
          }}
        />
      </div>

      {/* 小人物腿部 */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <div
          className="absolute rounded-full transition-all duration-300"
          style={{
            width: size * 0.08,
            height: size * 0.2,
            backgroundColor: config.color,
            left: size * 0.05,
            transform: mood === 5 ? "rotate(-10deg)" : "rotate(0deg)",
          }}
        />
        <div
          className="absolute rounded-full transition-all duration-300"
          style={{
            width: size * 0.08,
            height: size * 0.2,
            backgroundColor: config.color,
            right: size * 0.05,
            transform: mood === 5 ? "rotate(10deg)" : "rotate(0deg)",
          }}
        />
      </div>

      {/* 特殊效果 */}
      {mood === 5 && (
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-sparkle"
              style={{
                left: `${-8 + i * 8}px`,
                top: `${-2 + (i % 2) * 4}px`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}

      {mood === 1 && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
          <div
            className="w-0.5 h-3 bg-blue-300 rounded-full animate-tear-drop opacity-60"
            style={{ marginLeft: size * 0.1 }}
          />
        </div>
      )}
    </div>
  )
}

// Apple Health風格年度視圖組件 - 手機優化版
// Apple Health風格年度視圖組件 - 圓角方形設計
const AppleHealthYearlyView = ({
  moodHistory,
  moodOptions,
  currentDate,
  setCurrentDate,
  onDateSelect,
  onEntryView,
}) => {
  const today = new Date()
  const currentYear = currentDate.getFullYear()

  const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"]

  const getMoodForDate = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return moodHistory.find((entry) => entry.date === dateStr)
  }

  const isToday = (day, month, year) => {
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
  }

  const generateMonthDays = (year, month) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // 添加空白日期以對齊週開始
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // 添加當月所有日期
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        month,
        year,
        isToday: isToday(day, month, year),
      })
    }

    return days
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setTimeout(() => {
      const todayMonth = today.getMonth()
      const monthElement = document.getElementById(`month-${todayMonth}`)
      if (monthElement) {
        monthElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }

  return (
    <div className="h-full bg-gray-900 text-white apple-health-yearly">
      {/* 週標題 */}
      <div className="week-days-mobile bg-gray-900 sticky top-0 z-20">
        <div className="grid grid-cols-7 gap-x-3 px-4">
          {weekDays.map((day) => (
            <div key={day} className="text-center">
              <span className="text-sm font-medium text-gray-400 week-header-mobile">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 滾動內容區域 */}
      <div className="yearly-scroll-container" style={{ paddingBottom: "calc(96px + env(safe-area-inset-bottom))" }}>
        {Array.from({ length: 12 }, (_, monthIndex) => {
          const days = generateMonthDays(currentYear, monthIndex)

          return (
            <div key={monthIndex} id={`month-${monthIndex}`} className="month-section-mobile">
              {/* 月份標題 */}
              <div className="text-center py-6">
                <h2 className="month-title-mobile text-white">{monthNames[monthIndex]}</h2>
              </div>

              {/* 日期網格 - 小人物設計 */}
              <div className="date-grid-mobile">
                <div className="grid grid-cols-7 gap-x-3 gap-y-4">
                  {days.map((dayInfo, index) => {
                    if (!dayInfo) {
                      return <div key={index} className="h-20" />
                    }

                    const moodEntry = getMoodForDate(dayInfo.year, dayInfo.month, dayInfo.day)
                    const moodOption = moodEntry ? moodOptions.find((m) => m.id === moodEntry.mood) : null

                    return (
                      <button
                        key={index}
                        id={`date-${dayInfo.year}-${dayInfo.month}-${dayInfo.day}`}
                        onClick={() => {
                          if (moodEntry) {
                            // 如果已有記錄，顯示查看頁面
                            onEntryView(moodEntry)
                          } else {
                            // 如果沒有記錄，進入記錄頁面
                            onDateSelect(new Date(dayInfo.year, dayInfo.month, dayInfo.day))
                          }
                        }}
                        className="flex flex-col items-center space-y-2 date-button-mobile group"
                      >
                        {/* 日期數字 */}
                        <span
                          className={`text-sm font-medium ${
                            dayInfo.isToday ? "text-white font-semibold" : "text-gray-400"
                          }`}
                        >
                          {dayInfo.day}
                        </span>

                        {/* 心情指示器和筆記預覽 */}
                        <div className="relative">
                          {moodEntry ? (
                            <div className="flex flex-col items-center space-y-1">
                              <CuteCharacter mood={moodEntry.mood} size={40} isToday={dayInfo.isToday} />

                              {/* 筆記指示器 */}
                              {moodEntry.notes && (
                                <div className="w-full max-w-[60px]">
                                  <div className="bg-gray-700 rounded-md px-2 py-1 text-xs text-gray-300 truncate group-hover:bg-gray-600 transition-colors">
                                    {moodEntry.notes.length > 8
                                      ? `${moodEntry.notes.substring(0, 8)}...`
                                      : moodEntry.notes}
                                  </div>
                                </div>
                              )}

                              {/* 心情標籤 */}
                              <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                {moodOption?.name}
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-xl border-2 transition-all duration-200 group-hover:border-gray-500 ${
                                dayInfo.isToday ? "border-white border-4" : "border-gray-600"
                              }`}
                              style={{
                                backgroundColor: "transparent",
                                borderColor: dayInfo.isToday ? "white" : "#4B5563",
                              }}
                            />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 浮動今天按鈕 */}
      <button
        onClick={goToToday}
        className="fixed bottom-24 right-4 z-30 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-6 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
        style={{
          bottom: `calc(96px + env(safe-area-inset-bottom) + 16px)`,
          boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)",
        }}
      >
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>今天</span>
        </div>
      </button>
    </div>
  )
}

// 分析頁面組件 - 個人化數據展示
const AnalyticsView = ({ moodHistory, moodOptions, selectedTimeRange, setSelectedTimeRange }) => {
  const timeRanges = ["週", "月", "6個月", "年"]

  // 計算統計數據
  const getFilteredData = () => {
    const now = new Date()
    const startDate = new Date()

    switch (selectedTimeRange) {
      case "週":
        startDate.setDate(now.getDate() - 7)
        break
      case "月":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "6個月":
        startDate.setMonth(now.getMonth() - 6)
        break
      case "年":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    return moodHistory.filter((entry) => new Date(entry.date) >= startDate)
  }

  const filteredData = getFilteredData()
  const hasData = filteredData.length > 0

  // 計算平均心情
  const averageMood = hasData ? filteredData.reduce((sum, entry) => sum + entry.mood, 0) / filteredData.length : 0

  // 計算心情分布
  const moodDistribution = filteredData.reduce(
    (acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    },
    {} as Record<number, number>,
  )

  // 計算筆記統計
  const notesStats = {
    totalWithNotes: filteredData.filter((entry) => entry.notes && entry.notes.trim()).length,
    totalEntries: filteredData.length,
    averageNoteLength:
      filteredData
        .filter((entry) => entry.notes && entry.notes.trim())
        .reduce((sum, entry) => sum + (entry.notes?.length || 0), 0) /
      Math.max(filteredData.filter((entry) => entry.notes && entry.notes.trim()).length, 1),
  }

  // 最常見的心情
  const mostCommonMood = Object.entries(moodDistribution).sort(([, a], [, b]) => b - a)[0]

  // 心情趨勢（最近7天）
  const recentTrend = filteredData.slice(-7).map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("zh-TW", { month: "short", day: "numeric" }),
    mood: entry.mood,
    hasNotes: !!(entry.notes && entry.notes.trim()),
  }))

  const moodLabels = {
    1: "很難過",
    2: "有點難過",
    3: "還好",
    4: "開心",
    5: "超開心",
  }

  const moodColors = {
    1: "#8B5CF6", // 紫色
    2: "#3B82F6", // 藍色
    3: "#10B981", // 綠色
    4: "#F59E0B", // 橙色
    5: "#EF4444", // 紅色
  }

  if (!hasData) {
    return (
      <div className="p-4 space-y-6 pb-20">
        <div className="flex bg-gray-700 rounded-xl p-1">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-all ${
                selectedTimeRange === range ? "bg-gray-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold">沒有資料</h2>
          <p className="text-gray-400 text-sm">開始記錄你的心情來查看個人化分析</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-400">記錄更多心情後，這裡會顯示你的個人化圖表和洞察</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* 時間範圍選擇器 */}
      <div className="flex bg-gray-700 rounded-xl p-1">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setSelectedTimeRange(range)}
            className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-all ${
              selectedTimeRange === range ? "bg-gray-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* 概覽統計 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{averageMood.toFixed(1)}</div>
            <div className="text-sm text-gray-400">平均心情</div>
            <div className="text-xs text-gray-500 mt-1">
              {mostCommonMood ? moodLabels[Number(mostCommonMood[0]) as keyof typeof moodLabels] : ""}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{filteredData.length}</div>
            <div className="text-sm text-gray-400">記錄天數</div>
            <div className="text-xs text-gray-500 mt-1">{notesStats.totalWithNotes} 天有筆記</div>
          </div>
        </div>
      </div>

      {/* 心情分布圖 */}
      <div className="bg-gray-800 rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-4">心情分布</h3>
        <div className="space-y-3">
          {Object.entries(moodDistribution)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([mood, count]) => {
              const percentage = ((count / filteredData.length) * 100).toFixed(1)
              const moodNum = Number(mood) as keyof typeof moodLabels
              return (
                <div key={mood} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: moodColors[moodNum] }} />
                      {moodLabels[moodNum]}
                    </span>
                    <span>
                      {count} 天 ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: moodColors[moodNum],
                      }}
                    />
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* 最近趨勢 */}
      {recentTrend.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4">最近趨勢</h3>
          <div className="space-y-3">
            {recentTrend.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{day.date}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: moodColors[day.mood as keyof typeof moodColors] }}
                  />
                  <span className="text-sm">{moodLabels[day.mood as keyof typeof moodLabels]}</span>
                  {day.hasNotes && <div className="w-2 h-2 bg-yellow-400 rounded-full" title="有筆記" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 筆記統計 */}
      <div className="bg-gray-800 rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-4">筆記統計</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-400">
              {((notesStats.totalWithNotes / notesStats.totalEntries) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-400">記錄率</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-400">{Math.round(notesStats.averageNoteLength)}</div>
            <div className="text-sm text-gray-400">平均字數</div>
          </div>
        </div>
      </div>

      {/* 洞察建議 */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-4 border border-blue-800/30">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <span>💡</span>
          個人洞察
        </h3>
        <div className="text-sm text-gray-300 space-y-2">
          {averageMood >= 4 && <p>• 你的整體心情很不錯！繼續保持積極的生活態度。</p>}
          {averageMood < 3 && <p>• 最近心情似乎不太好，記得照顧好自己，必要時尋求支持。</p>}
          {notesStats.totalWithNotes / notesStats.totalEntries > 0.7 && (
            <p>• 你很善於記錄想法，這有助於更好地了解自己的情緒模式。</p>
          )}
          {mostCommonMood && (
            <p>
              • 你最常感到「{moodLabels[Number(mostCommonMood[0]) as keyof typeof moodLabels]}」，這反映了你的整體狀態。
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CuteMoodTracker
