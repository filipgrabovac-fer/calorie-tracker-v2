"use client";

import { useRef, useState, useCallback } from "react";

export type AudioRecorderState = "idle" | "recording" | "stopped";

export type UseAudioRecorderOptions = {
  chunkIntervalMs?: number;
  onChunk?: (blob: Blob) => void;
};

export type UseAudioRecorderReturn = {
  state: AudioRecorderState;
  start: () => Promise<void>;
  stop: () => void;
  error: string | null;
};

export const _useAudioRecorder = ({
  chunkIntervalMs = 5000,
  onChunk,
}: UseAudioRecorderOptions = {}): UseAudioRecorderReturn => {
  const [state, setState] = useState<AudioRecorderState>("idle");
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const start = useCallback(async () => {
    setError(null);
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          const cumulativeBlob = new Blob(chunksRef.current, { type: mimeType });
          onChunk?.(cumulativeBlob);
        }
      };

      recorder.onerror = () => {
        setError("Recording failed unexpectedly.");
        setState("stopped");
      };

      recorder.start(chunkIntervalMs);
      setState("recording");
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError(
          "Microphone access denied. Please allow microphone access and try again."
        );
      } else {
        setError("Could not start recording.");
      }
      setState("idle");
    }
  }, [chunkIntervalMs, onChunk]);

  const stop = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.requestData();
      recorder.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setState("stopped");
  }, []);

  return { state, start, stop, error };
};
