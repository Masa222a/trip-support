import { GPTPrompt } from "@/types/GPTPrompt";

function parseDurationToDays(duration: string): number {
  if (duration === "日帰り") return 1;
  if (duration.includes("1泊2日")) return 2;
  if (duration.includes("2泊3日")) return 3;
  if (duration.includes("3泊4日")) return 4;
  const match = duration.match(/(\d)泊(\d)日/);
  if (match) return parseInt(match[2], 10);
  return 2;
}

export function generatePrompt({
  location,
  duration,
  style,
}: GPTPrompt): string {
  const days = parseDurationToDays(duration);

  return `
行き先: ${location}
期間: ${duration}（${days}日）
スタイル: ${style}

${days}日分の旅行プランをJSON形式で作成してください。
形式:
[
  {
    "day": "Day 1",
    "activities": ["午前: ○○", "昼: ○○", "夜: ○○"]
  }
]

条件:
- 各日1オブジェクト（Day 1〜Day ${days}）
- JSONのみ出力（挨拶・説明不要）
`;
}
