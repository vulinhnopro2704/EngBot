interface ResponsiveVoiceParameters {
  pitch?: number; // 0 to 2
  rate?: number; // 0 to 1.5
  volume?: number; // 0 to 1
  onstart?: () => void;
  onend?: () => void;
  onerror?: (error: any) => void; // Add error callback
}

interface ResponsiveVoice {
  speak(text: string, voice?: string, parameters?: ResponsiveVoiceParameters): void;
  cancel(): void;
  pause(): void;
  resume(): void;
  isPlaying(): boolean;
  voiceSupport(): boolean;
  getVoices(): string[];
  setDefaultVoice(voice: string): void;
  setDefaultRate(rate: number): void;
  setDefaultPitch(pitch: number): void; // Add missing method
  setDefaultVolume(volume: number): void; // Add missing method
}