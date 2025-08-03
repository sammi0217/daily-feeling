"use client"

import { Badge } from "@/components/ui/badge"

interface FactorSelectorProps {
  selectedFactors: string[]
  onFactorsChange: (factors: string[]) => void
}

const factorCategories = {
  "工作/學習": ["工作壓力", "學習壓力", "工作成就", "學習進步", "同事關係", "老師互動"],
  人際關係: ["家人關係", "朋友聚會", "戀愛關係", "社交活動", "人際衝突", "孤獨感"],
  健康: ["身體健康", "運動", "睡眠品質", "飲食", "生病", "疲勞"],
  生活: ["天氣", "音樂", "電影", "閱讀", "旅行", "購物", "金錢壓力"],
  情緒: ["焦慮", "興奮", "感恩", "失望", "成就感", "壓力"],
}

export function FactorSelector({ selectedFactors, onFactorsChange }: FactorSelectorProps) {
  const toggleFactor = (factor: string) => {
    if (selectedFactors.includes(factor)) {
      onFactorsChange(selectedFactors.filter((f) => f !== factor))
    } else {
      onFactorsChange([...selectedFactors, factor])
    }
  }

  return (
    <div className="space-y-4">
      {Object.entries(factorCategories).map(([category, factors]) => (
        <div key={category} className="space-y-2">
          <h4 className="font-medium text-gray-700">{category}</h4>
          <div className="flex flex-wrap gap-2">
            {factors.map((factor) => (
              <Badge
                key={factor}
                variant={selectedFactors.includes(factor) ? "default" : "outline"}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => toggleFactor(factor)}
              >
                {factor}
              </Badge>
            ))}
          </div>
        </div>
      ))}

      {selectedFactors.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 font-medium">已選擇的影響因素：</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedFactors.map((factor) => (
              <Badge key={factor} variant="secondary">
                {factor}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
