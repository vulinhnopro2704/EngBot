"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type MascotEncouragementProps = {
	message: string;
	mood: "happy" | "sad" | "excited" | "neutral";
	onComplete?: () => void;
	duration?: number;
	position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
};

const mascotImages = {
	happy: "/svg/exciting.svg",
	sad: "/svg/sad.svg",
	excited: "/svg/exciting.svg",
	neutral: "/svg/normal.svg",
};

export function MascotEncouragement({
	message,
	mood,
	onComplete,
	duration = 3000,
}: MascotEncouragementProps) {
	const [visible, setVisible] = useState(true);

	// Auto-dismiss after duration
	useEffect(() => {
		const timer = setTimeout(() => {
			setVisible(false);
		}, duration);

		return () => clearTimeout(timer);
	}, [duration]);

	// Call onComplete when animation is done
	const handleAnimationComplete = () => {
		if (!visible && onComplete) {
			onComplete();
		}
	};

	return (
		<AnimatePresence onExitComplete={handleAnimationComplete}>
			{visible && (
				<motion.div
					className="absolute bottom-4 right-4 z-50 flex items-end gap-3 pointer-events-none"
					initial={{ opacity: 0, y: 20, scale: 0.9 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 10, scale: 0.9 }}
					transition={{ type: "spring", bounce: 0.4 }}
				>
					{/* Speech bubble */}
					<motion.div
						className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg relative max-w-xs"
						initial={{ opacity: 0, scale: 0, x: 20 }}
						animate={{ opacity: 1, scale: 1, x: 0 }}
						exit={{ opacity: 0, scale: 0.8, x: 10 }}
						transition={{ delay: 0.1 }}
					>
						{/* Triangle pointer */}
						<div className="absolute bottom-3 -right-2 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45" />

						{/* Message text */}
						<p className="text-sm font-medium text-gray-800 dark:text-gray-200">
							{message}
						</p>
					</motion.div>

					{/* Mascot image */}
					<motion.div
						className="relative"
						initial={{ y: 20 }}
						animate={{ y: [0, -8, 0] }}
						transition={{ repeat: 2, duration: 1 }}
					>
						<Image
							src={mascotImages[mood] || "/placeholder.svg"}
							width={120}
							height={120}
							alt={`Mascot with ${mood} expression`}
							className="object-contain"
						/>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
