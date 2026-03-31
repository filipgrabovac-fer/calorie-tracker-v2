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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Voice Input</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-3">
            {state === "idle" || state === "stopped" ? (
              <Button onClick={start} className="gap-2">
                <Mic className="h-4 w-4" />
                {state === "stopped" ? "Record again" : "Start recording"}
              </Button>
            ) : (
              <Button onClick={stop} variant="destructive" className="gap-2">
                <Square className="h-4 w-4" />
                Stop recording
              </Button>
            )}
            {isPending && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {state === "recording" && (
            <p className="text-xs text-center text-muted-foreground animate-pulse">
              Recording…
            </p>
          )}

          {error && (
            <p className="text-xs text-center text-destructive">{error}</p>
          )}

          {(transcription || isPending) && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                Transcription
              </p>
              <Textarea
                value={transcription}
                readOnly
                rows={5}
                className="resize-none text-sm"
                placeholder={isPending ? "Transcribing…" : ""}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
