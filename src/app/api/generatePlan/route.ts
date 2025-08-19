import { NextRequest, NextResponse } from "next/server";
import { GptPlan, GPTPrompt } from "@/types/GPTPrompt";
import { openai } from "@/lib/openai";
import { generatePrompt } from "@/lib/generatePrompt";

export async function POST(req: NextRequest) {
  const body: GPTPrompt = await req.json();
  const { location, duration, style } = body;

  const prompt = generatePrompt({ location, duration, style });

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "あなたはプロの旅行プランナーです。ユーザーの条件に沿ってJSON形式で旅行プランを作成してください。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const jsonText = chat.choices[0]?.message?.content || "[]";
    const plan: GptPlan[] = JSON.parse(jsonText);

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("GPT error:", error);
    return NextResponse.json(
      { error: "プラン生成に失敗しました" },
      { status: 500 },
    );
  }
}
