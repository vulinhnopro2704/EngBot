"use client";
import { useVocabStore } from "@/lib/store";

export function useAudio() {
	const {
		masterVolume,
		speechVolume,
		effectsVolume,
		autoPlayAudio,
		updateMasterVolume,
		updateSpeechVolume,
		updateEffectsVolume,
		toggleAutoPlayAudio,
	} = useVocabStore();

	const speakWord = (word: string, rate = 0.8) => {
		if ("speechSynthesis" in window) {
			window.speechSynthesis.cancel();

			const utterance = new SpeechSynthesisUtterance(word);
			utterance.rate = rate;
			utterance.volume = (masterVolume / 100) * (speechVolume / 100);
			speechSynthesis.speak(utterance);
			return true;
		}
		return false;
	};

	const playSound = (
		soundType: "correct" | "incorrect" | "complete" | "click"
	) => {
		// Mock implementation
		console.log(`Playing sound: ${soundType}`);
		return true;
	};

	const playAudio = (audioUrl: string) => {
		// Mock implementation
		console.log(`Playing audio: ${audioUrl}`);
		return true;
	};

	const cancelSpeech = () => {
		if ("speechSynthesis" in window) {
			window.speechSynthesis.cancel();
		}
	};

	return {
		masterVolume,
		speechVolume,
		effectsVolume,
		autoPlayAudio,
		updateMasterVolume,
		updateSpeechVolume,
		updateEffectsVolume,
		toggleAutoPlayAudio,
		speakWord,
		playSound,
		playAudio,
		cancelSpeech,
	};
}
