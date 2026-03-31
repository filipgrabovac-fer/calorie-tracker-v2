"use client";

import { useState, useCallback } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { _useAudioRecorder } from "./hooks/_useAudioRecorder";
import { voiceRecorderApi } from "./_voice-recorder.api";

export type VoiceRecorderProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const WAVEFORM_BARS = [
  { duration: "0.6s", delay: "0s", height: "45%" },
  { duration: "0.9s", delay: "0.15s", height: "80%" },
  { duration: "0.7s", delay: "0.3s", height: "60%" },
  { duration: "1.0s", delay: "0.1s", height: "90%" },
  { duration: "0.8s", delay: "0.25s", height: "55%" },
];

export const VoiceRecorder = ({ open, onOpenChange }: VoiceRecorderProps) => {
  const [transcription, setTranscription] = useState("");

  const { mutate: transcribeAudio, isPending } =
    voiceRecorderApi.useTranscribeAudio((data) =>
      setTranscription(data.transcription)
    );

  const handleChunk = useCallback(
    (blob: Blob) => {
      if (!isPending) {
        transcribeAudio({ audio: blob });
      }
    },
    [isPending, transcribeAudio]
  );

  const { state, start, stop, error } = _useAudioRecorder({
    chunkIntervalMs: 5000,
    onChunk: handleChunk,
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && state === "recording") {
      stop();
    }
    if (!nextOpen) {
      setTranscription("");
    }
    onOpenChange(nextOpen);
  };

  const isRecording = state === "recording";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Voice Input</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-2">
          <div className="relative flex items-center justify-center min-h-[140px]">
            {isRecording && (
              <>
                <span className="absolute inline-flex h-24 w-24 rounded-full bg-red-500/20 animate-ping" />
                <span className="absolute inline-flex h-32 w-32 rounded-full bg-red-500/10 animate-ping [animation-delay:0.3s]" />
              </>
            )}

            <button
              onClick={isRecording ? stop : start}
              className={[
                "relative z-10 flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                isRecording
                  ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/40 focus-visible:ring-red-500 scale-110"
                  : "bg-primary hover:bg-primary/90 shadow-md focus-visible:ring-primary",
              ].join(" ")}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? (
                <Square className="h-6 w-6 text-white fill-white" />
              ) : (
                <Mic className="h-6 w-6 text-primary-foreground" />
              )}
            </button>
          </div>

          {isRecording && (
            <div className="flex items-center gap-1 h-10 w-full justify-center">
              {WAVEFORM_BARS.map((bar, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-red-500 rounded-full animate-bounce"
                  style={{
                    height: bar.height,
                    animationDuration: bar.duration,
                    animationDelay: bar.delay,
                  }}
                />
              ))}
            </div>
          )}

          {!isRecording && (
            <p className="text-sm text-muted-foreground text-center">
              {state === "stopped" ? "Recording stopped" : "Tap to start recording"}
            </p>
          )}

          {isPending && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Transcribing…
            </div>
          )}

          {error && (
            <p className="text-xs text-center text-destructive">{error}</p>
          )}

          {state !== "idle" && (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={isRecording ? stop : start}
                className="text-xs text-muted-foreground"
              >
                {isRecording ? "Stop recording" : "Record again"}
              </Button>
            </div>
          )}

          {(transcription || isPending) && (
            <div className="w-full flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                Transcription
              </p>
              <div className="bg-muted rounded-lg p-3">
                <Textarea
                  value={transcription}
                  readOnly
                  rows={4}
                  className="resize-none text-sm border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                  placeholder={isPending ? "Transcribing…" : ""}
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
