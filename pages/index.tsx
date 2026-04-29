// File: pages/index.tsx
import { ObjectId } from 'mongodb'; // Keep ObjectId for toString()
import { GetServerSideProps } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import ScreenContainer from "@/components/shared/ScreenContainer/ScreenContainer";
import clientPromise from "../lib/mongodb"; // Import clientPromise
import { Exam } from "../lib/types"; // Import Exam type from shared types
import SEO from '@/components/shared/SEO/SEO';

export default function ExamHomePage({ exams = [] }: { exams: Exam[] }) {
  return (
    <ScreenContainer>
      <SEO
        title="Secure Proctoring & Exam Engine"
        url="/"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl m-auto"
      >
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 mb-6 uppercase leading-[0.9]">
          Secure <span className="text-emerald-600">Proctoring</span> <br />
          & Exam Engine
        </h1>

        <p className="text-sm md:text-base text-zinc-500 mb-10 leading-relaxed max-w-xl mx-auto font-medium uppercase tracking-widest opacity-80">
          High-integrity certification protocols. Equipped with <span className="text-zinc-900 font-bold">real-time tab-monitoring</span> and
          <span className="text-zinc-900 font-bold"> instant MongoDB state persistence</span>. Initialize your assessment below.
        </p>

        {/* Action Buttons */}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap mt-8">
          {exams.map((exam) => {
            // Format the category for the URL (e.g., "Frontend Dev" -> "frontend-dev")
            const categorySlug = exam.category ? exam.category.toLowerCase().replace(/\s+/g, '-') : 'general';
            return (
              <Link key={exam._id.toString()} href={`/exams/${categorySlug}/${exam._id}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-64 h-24 text-left px-6 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-sm transition-all border-2 border-emerald-600 flex flex-col justify-center"
                >
                  {exam.category && (
                    <span className="block text-[10px] font-bold text-emerald-200 uppercase tracking-widest">{exam.category}</span>
                  )}
                  <span className="block font-black text-sm uppercase tracking-widest mt-1">
                    {exam.title}
                  </span>
                </motion.button>
              </Link>
            );
          })}


        </div>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full"
      >
        <div className="p-8 rounded-[2rem] border-2 border-zinc-100 bg-white shadow-sm">
          <h3 className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-3">Anti-Cheat</h3>
          <p className="text-sm text-zinc-500 italic">Detection of tab-switching and window-blurring events.</p>
        </div>
        <div className="p-8 rounded-[2rem] border-2 border-zinc-100 bg-white shadow-sm">
          <h3 className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-3">Instant Save</h3>
          <p className="text-sm text-zinc-500 italic">Progress is synced to MongoDB cluster in real-time.</p>
        </div>
        <div className="p-8 rounded-[2rem] border-2 border-zinc-100 bg-white shadow-sm">
          <h3 className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-3">Auto-Grading</h3>
          <p className="text-sm text-zinc-500 italic">Server-side logic calculates results immediately.</p>
        </div>
      </motion.div>
    </ScreenContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const client = await clientPromise; // Use the shared clientPromise
    const db = client.db('lizrd_core'); // Get the database instance
    const exams = await db.collection('exams')
      .find({ status: 'published' })
      .project({ title: 1, slug: 1, description: 1, category: 1 })
      .toArray();

    return {
      props: {
        exams: JSON.parse(JSON.stringify(exams)),
      },
    };
  } catch (error) {
    return { props: { exams: [] } };
  }
};