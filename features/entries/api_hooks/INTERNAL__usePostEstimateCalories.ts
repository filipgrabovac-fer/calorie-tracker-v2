"use client";

import { useMutation } from "@tanstack/react-query";
import { baseApiUrl } from "@/app/schema/apiClient";

export type EstimateCaloriesPayload = {
  title?: string;
  description?: string;
  ingredients: Array<{ name: string; weight_grams?: number | null }>;
  image?: File | null;
};

export type EstimateCaloriesResponse = {
  estimated_calories: number;
};

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const INTERNAL__usePostEstimateCalories = (onSuccess?: (data: EstimateCaloriesResponse) => void) => {
  return useMutation({
    mutationFn: async ({ image, ...payload }: EstimateCaloriesPayload) => {
      const image_base64 = image ? await fileToBase64(image) : undefined;
      const response = await fetch(`${baseApiUrl}/api/estimate-calories/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, image_base64 }),
      });
      if (!response.ok) {
        throw new Error("Failed to estimate calories");
      }
      return response.json() as Promise<EstimateCaloriesResponse>;
    },
    onSuccess,
  });
};
