import { GptPlan } from "@/types/GPTPrompt";
import { GPTPrompt } from "@/app/components/GptForm";

type GeneratePlanResponse = {
  plan: GptPlan[];
};

export const generatePlan = async (
  form: GPTPrompt
): Promise<GeneratePlanResponse> => {
  const res = await fetch("/api/generatePlan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  if (!res.ok) {
    throw new Error("旅行プランの生成に失敗しました。");
  }

  return res.json();
};
