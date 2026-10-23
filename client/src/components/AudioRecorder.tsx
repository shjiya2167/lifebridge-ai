import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Check, AlertCircle } from 'lucide-react';

interface AudioRecorderProps {
  onAudioRecorded: (file: File) => void;
  onCancel: () => void;
  isHindiOrRegional?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAudioRecorded,
  onCancel,
  isHindiOrRegional = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    startRecording();
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  const startRecording = async () => {
    setPermissionError(null);
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Audio recording is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/ogg';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      mediaRecorder.start(250);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      setPermissionError(
        err.message || 'Microphone access denied. Please enable microphone permissions in your browser.'
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlayback = () => {
    if (!audioElementRef.current && audioUrl) {
      const audio = new Audio(audioUrl);
      audioElementRef.current = audio;
      audio.onended = () => setIsPlaying(false);
    }

    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        audioElementRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleConfirmAudio = () => {
    if (audioBlob) {
      const extension = audioBlob.type.includes('mp4') ? 'm4a' : 'webm';
      const file = new File([audioBlob], `voice_inquiry_${Date.now()}.${extension}`, {
        type: audioBlob.type
      });
      onAudioRecorded(file);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white border-2 border-brand-500 rounded-2xl p-5 shadow-lg my-4 transition-all">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          <h4 className="font-semibold text-slate-800 text-sm">
            {isHindiOrRegional ? 'आवाज संदेश रिकॉर्डिंग' : 'Voice Message Recording'}
          </h4>
        </div>
        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
          {formatTime(recordingSeconds)}
        </span>
      </div>

      {permissionError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
          <div>
            <p className="font-semibold">Microphone Permission Needed</p>
            <p className="text-xs text-red-600 mt-1">{permissionError}</p>
            <button
              onClick={onCancel}
              className="mt-3 text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      ) : isRecording ? (
        <div className="flex flex-col items-center justify-center py-4">
          {/* Animated Waveform Visualizer */}
          <div className="flex items-center justify-center gap-1.5 h-12 mb-4">
            <span className="w-1.5 bg-brand-500 rounded-full h-4 animate-audio-bar-1" />
            <span className="w-1.5 bg-brand-600 rounded-full h-8 animate-audio-bar-2" />
            <span className="w-1.5 bg-brand-500 rounded-full h-11 animate-audio-bar-3" />
            <span className="w-1.5 bg-brand-400 rounded-full h-7 animate-audio-bar-4" />
            <span className="w-1.5 bg-brand-600 rounded-full h-10 animate-audio-bar-5" />
            <span className="w-1.5 bg-brand-500 rounded-full h-5 animate-audio-bar-2" />
          </div>

          <p className="text-xs text-slate-600 mb-4 text-center">
            {isHindiOrRegional
              ? 'कृपया अपनी समस्या स्पष्ट बोलें। पूरा होने पर लाल बटन दबाएं।'
              : 'Speak clearly into your microphone. Click Stop when finished.'}
          </p>

          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-transform active:scale-95"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>Stop Recording</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center py-3">
          <p className="text-xs text-slate-600 mb-3 font-medium">Recording Complete. Preview audio:</p>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl mb-4">
            <button
              type="button"
              onClick={togglePlayback}
              className="w-9 h-9 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center transition-colors shadow-sm"
              aria-label="Play audio"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Voice Note</span> ({formatTime(recordingSeconds)})
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                cleanup();
                startRecording();
              }}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-2 rounded-lg"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>Re-record</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-slate-700 px-3 py-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmAudio}
              className="flex items-center gap-1.5 text-xs bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Attach Voice Note</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
