"\"use client"

import { useEffect, useState } from "react"

interface LoadingContext {
  timeOfDay: "morning" | "afternoon" | "evening" | "night"
  mood?: number
  message: string
}

interface VibeLoadingProps {
  context: LoadingContext
}

const VibeLoading = ({ context }: VibeLoadingProps) => {
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 4)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getGradientForTimeAndMood = () => {
    if (context.timeOfDay === "morning") {
      return "from-orange-200 via-yellow-300 to-orange-400"
    } else if (context.mood && context.mood <= 2) {
      return "from-blue-200 via-cyan-300 to-blue-400"
    } else if (context.timeOfDay === "evening") {
      return "from-purple-300 via-pink-300 to-orange-300"
    } else if (context.timeOfDay === "night") {
      return "from-indigo-400 via-purple-400 to-indigo-600"
    }
    return "from-green-200 via-blue-300 to-green-400"
  }

  const renderAnimation = () => {
    if (context.timeOfDay === "morning") {
      return <SunriseAnimation phase={animationPhase} />
    } else if (context.mood && context.mood <= 2) {
      return <BreathingAnimation phase={animationPhase} />
    } else if (context.timeOfDay === "evening") {
      return <SunsetAnimation phase={animationPhase} />
    } else if (context.timeOfDay === "night") {
      return <StarsAnimation phase={animationPhase} />
    }
    return <DefaultAnimation phase={animationPhase} />
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${getGradientForTimeAndMood()} transition-all duration-1000`}
    >
      <div className="text-center space-y-8 p-8">
        <div className="relative w-32 h-32 mx-auto">{renderAnimation()}</div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">{context.message}</h2>

          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full bg-white/60 transition-all duration-500 ${
                  animationPhase === i ? "scale-125 bg-white" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {context.mood && context.mood <= 2 && (
          <div className="text-white/80 text-sm space-y-2">
            <p>跟著節奏深呼吸</p>
            <div className="text-xs">{animationPhase % 2 === 0 ? "吸氣..." : "呼氣..."}</div>
          </div>
        )}
      </div>
    </div>
  )
}

function SunriseAnimation({ phase }: { phase: number }) {
  return (
    <div className="relative w-full h-full">
      {/* Sun */}
      <div
        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-yellow-300 rounded-full transition-all duration-1000 ${
          phase >= 2 ? "translate-y-[-2rem] scale-110" : "translate-y-0"
        }`}
        style={{
          boxShadow: `0 0 ${20 + phase * 10}px rgba(255, 255, 0, 0.6)`,
        }}
      />

      {/* Rays */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`absolute top-1/2 left-1/2 w-1 bg-yellow-200 origin-bottom transition-all duration-1000 ${
            phase >= 1 ? "h-8 opacity-100" : "h-4 opacity-50"
          }`}
          style={{
            transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
            transformOrigin: "50% 100%",
          }}
        />
      ))}

      {/* Clouds */}
      <div
        className={`absolute top-4 left-4 w-8 h-4 bg-white/40 rounded-full transition-all duration-1000 ${
          phase >= 3 ? "translate-x-2" : ""
        }`}
      />
      <div
        className={`absolute top-6 right-6 w-6 h-3 bg-white/30 rounded-full transition-all duration-1000 ${
          phase >= 2 ? "translate-x-[-0.5rem]" : ""
        }`}
      />
    </div>
  )
}

function BreathingAnimation({ phase }: { phase: number }) {
  const isInhaling = phase % 2 === 0

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main breathing circle */}
      <div
        className={`w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm transition-all duration-1000 ease-in-out ${
          isInhaling ? "scale-125" : "scale-100"
        }`}
        style={{
          boxShadow: `0 0 ${isInhaling ? 40 : 20}px rgba(255, 255, 255, 0.5)`,
        }}
      />

      {/* Outer rings */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-24 h-24 rounded-full border-2 border-white/20 transition-all duration-1000 ease-in-out ${
            isInhaling ? `scale-${120 + i * 10}` : `scale-${100 + i * 5}`
          }`}
          style={{
            animationDelay: `${i * 200}ms`,
          }}
        />
      ))}

      {/* Center dot */}
      <div
        className={`absolute w-4 h-4 rounded-full bg-white transition-all duration-1000 ${
          isInhaling ? "scale-150" : "scale-100"
        }`}
      />
    </div>
  )
}

function SunsetAnimation({ phase }: { phase: number }) {
  return (
    <div className="relative w-full h-full">
      {/* Sun setting */}
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-orange-400 rounded-full transition-all duration-1000 ${
          phase >= 2 ? "translate-y-4 scale-90" : ""
        }`}
        style={{
          boxShadow: `0 0 ${30 - phase * 5}px rgba(255, 165, 0, 0.8)`,
        }}
      />

      {/* Horizon line */}
      <div className="absolute bottom-8 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      {/* Reflection */}
      <div
        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-orange-300/30 rounded-full transition-all duration-1000 ${
          phase >= 3 ? "opacity-80" : "opacity-40"
        }`}
        style={{
          filter: "blur(2px)",
        }}
      />
    </div>
  )
}

function StarsAnimation({ phase }: { phase: number }) {
  return (
    <div className="relative w-full h-full">
      {/* Moon */}
      <div
        className={`absolute top-4 right-4 w-12 h-12 bg-gray-100 rounded-full transition-all duration-1000 ${
          phase >= 2 ? "scale-110" : "scale-100"
        }`}
        style={{
          boxShadow: `0 0 ${15 + phase * 5}px rgba(255, 255, 255, 0.6)`,
        }}
      />

      {/* Stars */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 bg-white rounded-full transition-all duration-1000 ${
            phase >= (i % 4) ? "opacity-100 scale-100" : "opacity-50 scale-75"
          }`}
          style={{
            top: `${20 + ((i * 15) % 60)}%`,
            left: `${10 + ((i * 25) % 80)}%`,
            animationDelay: `${i * 300}ms`,
          }}
        />
      ))}

      {/* Twinkling effect */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-white rounded-full transition-all duration-500 ${
              (phase + i) % 4 === 0 ? "opacity-100" : "opacity-30"
            }`}
            style={{
              top: `${30 + ((i * 20) % 40)}%`,
              left: `${20 + ((i * 30) % 60)}%`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function DefaultAnimation({ phase }: { phase: number }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className={`w-16 h-16 rounded-full bg-white/40 backdrop-blur-sm transition-all duration-1000 ${
          phase % 2 === 0 ? "scale-110" : "scale-100"
        }`}
        style={{
          boxShadow: `0 0 ${20 + phase * 5}px rgba(255, 255, 255, 0.4)`,
        }}
      />

      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-20 h-20 rounded-full border border-white/20 transition-all duration-1000 ${
            phase === i ? "scale-125 opacity-100" : "scale-100 opacity-50"
          }`}
        />
      ))}
    </div>
  )
}

export default VibeLoading
