"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { GPTPrompt } from "@/types/GPTPrompt";
import { useState } from "react";

type Props = {
  onSubmit: (form: GPTPrompt) => void;
};

export const GPTForm = ({ onSubmit }: Props) => {
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [style, setStyle] = useState("");

  const handleSubmit = () => {
    if (location && duration && style) {
      onSubmit({ location, duration, style });
    } else {
      alert("すべての項目を選択してください");
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto p-6">
      <Select onValueChange={setLocation}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="行き先を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="大阪">大阪</SelectItem>
          <SelectItem value="東京">東京</SelectItem>
          <SelectItem value="京都">京都</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={setDuration}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="日数を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="日帰り">日帰り</SelectItem>
          <SelectItem value="1泊2日">1泊2日</SelectItem>
          <SelectItem value="2泊3日">2泊3日</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={setStyle}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="旅スタイルを選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="一人旅">一人旅</SelectItem>
          <SelectItem value="カップル">カップル</SelectItem>
          <SelectItem value="家族旅行">家族旅行</SelectItem>
        </SelectContent>
      </Select>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        🌍 プランを作成する
      </button>
    </div>
  );
};
export type { GPTPrompt };
