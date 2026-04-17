import { useState } from "react";
import { GptPlan } from "@/types/GPTPrompt";
import { GPTPrompt } from "@/app/components/GptForm";
import { generatePlan } from "@/app/api/generatePlan/generatePlan";

export const useGeneratePlan = () => {
  const [plan, setPlan] = useState<GptPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (form: GPTPrompt) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await generatePlan(form);
      setPlan(data.plan);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "予期しないエラーが発生しました。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    plan,
    isLoading,
    error,
    handleSubmit,
  };
};
