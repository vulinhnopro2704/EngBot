"use client";

import { useState, useEffect } from "react";
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

	const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

	useEffect(() => {
		// Initialize AudioContext on client-side only
		if (typeof window !== "undefined" && !audioContext) {
			const AudioContextClass =
				window.AudioContext || (window as any).webkitAudioContext;
			if (AudioContextClass) {
				setAudioContext(new AudioContextClass());
			}
		}

		// Cleanup
		return () => {
			if (audioContext) {
				audioContext.close();
			}
		};
	}, [audioContext]);

	const speakWord = (word: string, rate = 0.8) => {
		if ("speechSynthesis" in window) {
			// Cancel any ongoing speech first
			window.speechSynthesis.cancel();

			const utterance = new SpeechSynthesisUtterance(word);
			utterance.rate = rate;
			utterance.volume = (masterVolume / 100) * (speechVolume / 100);
			speechSynthesis.speak(utterance);
			return true;
		}
		return false;
	};

	const playSound = async (
		soundType: "correct" | "incorrect" | "complete" | "click"
	) => {
		if (!audioContext) return false;

		try {
			// In a real app, we would load actual sound files
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			// Configure sound based on type
			switch (soundType) {
				case "correct":
					oscillator.type = "sine";
					oscillator.frequency.setValueAtTime(
						800,
						audioContext.currentTime
					);
					oscillator.frequency.exponentialRampToValueAtTime(
						1200,
						audioContext.currentTime + 0.1
					);
					gainNode.gain.value =
						(masterVolume / 100) * (effectsVolume / 100) * 0.1;
					break;
				case "incorrect":
					oscillator.type = "sawtooth";
					oscillator.frequency.setValueAtTime(
						400,
						audioContext.currentTime
					);
					oscillator.frequency.exponentialRampToValueAtTime(
						200,
						audioContext.currentTime + 0.2
					);
					gainNode.gain.value =
						(masterVolume / 100) * (effectsVolume / 100) * 0.1;
					break;
				case "complete":
					oscillator.type = "sine";
					oscillator.frequency.setValueAtTime(
						600,
						audioContext.currentTime
					);
					oscillator.frequency.exponentialRampToValueAtTime(
						1000,
						audioContext.currentTime + 0.1
					);
					gainNode.gain.value =
						(masterVolume / 100) * (effectsVolume / 100) * 0.1;
					break;
				case "click":
					oscillator.type = "sine";
					oscillator.frequency.setValueAtTime(
						800,
						audioContext.currentTime
					);
					gainNode.gain.value =
						(masterVolume / 100) * (effectsVolume / 100) * 0.05;
					break;
			}

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.start();
			oscillator.stop(
				audioContext.currentTime + (soundType === "click" ? 0.05 : 0.3)
			);

			return true;
		} catch (error) {
			console.error("Error playing sound:", error);
			return false;
		}
	};

	const playAudio = (audioUrl: string) => {
		if (!audioContext) return false;

		try {
			// Create an audio element
			const audio = new Audio(audioUrl);

			// Apply volume settings
			audio.volume = (masterVolume / 100) * (speechVolume / 100);

			// Play the audio
			audio.play().catch((error) => {
				console.error("Error playing audio:", error);
				return false;
			});

			return true;
		} catch (error) {
			console.error("Error setting up audio playback:", error);
			return false;
		}
	};

	const cancelSpeech = () => {
		if ("speechSynthesis" in window) {
			window.speechSynthesis.cancel();
		}
	};

	return {
		// Audio state
		masterVolume,
		speechVolume,
		effectsVolume,
		autoPlayAudio,

		// Audio state update methods
		updateMasterVolume,
		updateSpeechVolume,
		updateEffectsVolume,
		toggleAutoPlayAudio,

		// Audio playback methods
		speakWord,
		playSound,
		playAudio,
		cancelSpeech,
	};
}
