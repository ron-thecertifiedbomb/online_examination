'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import ScreenContainer from "@/components/shared/ScreenContainer/ScreenContainer";

export default function ExamHomePage() {
  return (
    <ScreenContainer className="pt-24 pb-12 flex flex-col items-center justify-center min-h-[80vh]">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl m-auto"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
          Secure <span className="text-green-500">Proctoring</span> &
          Exam Engine
        </h1>
        <p className="text-lg text-gray-400 mb-10 leading-relaxed">
          Engineered for high-integrity certifications. Featuring real-time tab-monitoring,
          instant MongoDB state persistence, and sub-100ms response times.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/engineering/exams/start">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Start Entrance Exam
            </motion.button>
          </Link>

          <Link href="/engineering/toolkit">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border border-gray-700 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
            >
              Back to Toolkit
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full"
      >
        <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
          <h3 className="text-green-500 font-bold mb-2">Anti-Cheat</h3>
          <p className="text-sm text-gray-400">Automatic detection of tab-switching and window-blurring events.</p>
        </div>
        <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
          <h3 className="text-green-500 font-bold mb-2">Instant Save</h3>
          <p className="text-sm text-gray-400">Progress is synced to your lizard_core MongoDB cluster in real-time.</p>
        </div>
        <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
          <h3 className="text-green-500 font-bold mb-2">Auto-Grading</h3>
          <p className="text-sm text-gray-400">Server-side logic calculates results immediately upon submission.</p>
        </div>
      </motion.div>
    </ScreenContainer>
  );
}