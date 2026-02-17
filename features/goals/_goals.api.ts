import { INTERNAL__useGetGoal } from "./api_hooks/INTERNAL__useGetGoal";
import { INTERNAL__usePatchGoal } from "./api_hooks/INTERNAL__usePatchGoal";

export type PersonGoal = {
  id: number;
  person_type: string;
  daily_goal_calories: number;
  updated_at: string;
};

export const goalsApi = {
  useGetGoal: INTERNAL__useGetGoal,
  usePatchGoal: INTERNAL__usePatchGoal,
};
