export type GptPlan = {
  day: string;
  activities: string[];
};

export type GPTPrompt = {
  location: string;
  duration: string;
  style: string;
};

export type TravelPlanProps = {
  plan: GptPlan[];
};