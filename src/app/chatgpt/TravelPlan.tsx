"use client";

import { TravelPlanProps } from "@/types/GPTPrompt";
import React from "react";

export const TravelPlan: React.FC<TravelPlanProps> = ({ plan }) => {
  if (!plan || plan.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-10">
        旅行プランがまだ生成されていません。
      </p>
    );
  }

  return (
    <div className="mt-10 space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center">🎒 あなたの旅行プラン</h2>
      {plan.map((dayPlan, index) => (
        <div
          key={index}
          className="bg-white shadow-sm border-l-4 border-blue-500 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-blue-600 mb-2">
            {dayPlan.day}
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {dayPlan.activities.map((activity, i) => (
              <li key={i}>{activity}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
