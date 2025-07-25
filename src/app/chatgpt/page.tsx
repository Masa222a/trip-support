'use client'

import { useState } from "react"
import { GPTForm, GPTPrompt } from "../components/GptForm"
import { TravelPlan } from "./TravelPlan"

type GptPlan = {
  day: string
  activities: string[]
}

const chatgptPage = () => {
  const [plan, setPlan] = useState<GptPlan[]>([])

  const handleFormSubmit = async (form: GPTPrompt) => {
    const res = await fetch("/api/generatePlan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setPlan(data.plan)
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">AI旅行プラン作成</h1>
      <GPTForm onSubmit={handleFormSubmit} />
      <TravelPlan plan={plan} />
    </main>
  )
}

export default chatgptPage

// uiとどのように実行するかの流れから考える
// 選択肢を考える

// 生成AIの他の候補を余裕があれば探す
// 予算感を調べる
