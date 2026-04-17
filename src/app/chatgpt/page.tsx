"use client";
import { GPTForm, GPTPrompt } from "../components/GptForm";
import { TravelPlan } from "./TravelPlan";
import Header from "../components/layouts/header/header";
import { useGeneratePlan } from "@/hooks/useGeneratePlan";

const ChatgptPage = () => {
  const { plan, isLoading, error, handleSubmit } = useGeneratePlan();

  const handleFormSubmit = async (form: GPTPrompt) => {
    await handleSubmit(form);
  };

  return (
    <div>
      <Header />
      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          AI旅行プラン作成
        </h1>

        <GPTForm onSubmit={handleFormSubmit} />

        {isLoading && (
          <p className="text-center text-gray-500 mt-4">プランを生成中です...</p>
        )}

        {error && (
          <p className="text-center text-red-500 mt-4">{error}</p>
        )}
        
        <TravelPlan plan={plan} />
      </main>
    </div>
  );
};

export default ChatgptPage;
