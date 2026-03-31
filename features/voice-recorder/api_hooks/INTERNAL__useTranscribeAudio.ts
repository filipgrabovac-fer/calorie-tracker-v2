"use client";

import { useMutation } from "@tanstack/react-query";
import { baseApiUrl } from "@/app/schema/apiClient";

export type TranscribeAudioPayload = {
  audio: Blob;
};

export type TranscribeAudioResponse = {
  transcription: string;
};

export const INTERNAL__useTranscribeAudio = (
  onSuccess?: (data: TranscribeAudioResponse) => void
) => {
  return useMutation({
    mutationFn: async ({ audio }: TranscribeAudioPayload) => {
      const formData = new FormData();
      formData.append("audio", audio, "audio.webm");
      const response = await fetch(`${baseApiUrl}/api/transcribe-audio/`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }
      return response.json() as Promise<TranscribeAudioResponse>;
    },
    onSuccess,
  });
};
