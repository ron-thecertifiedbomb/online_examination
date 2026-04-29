import { MongoClient } from 'mongodb';
import { GetServerSideProps } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import ScreenContainer from "@/components/shared/ScreenContainer/ScreenContainer";

type Exam = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category?: string;
};

export default function ExamHomePage({ exams = [] }: { exams: Exam[] }) {
  return (
    <ScreenContainer>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl m-auto"
      >
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 mb-6 uppercase">
          Secure <span className="text-emerald-600">Proctoring</span> &
          Exam Engine
        </h1>

        <p className="text-lg text-zinc-500 mb-10 leading-relaxed max-w-2xl mx-auto">
          High-integrity certifications featuring real-time tab-monitoring and
          instant MongoDB state persistence. Select an assessment protocol to initialize.
        </p>

        {/* Action Buttons */}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap mt-8">
          {exams.map((exam) => (
            <Link key={exam._id} href={`/engineering/exams/${exam._id}`}>
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
          ))}

          {/* NEW: Exam Categories Button - Matches "Start" buttons in size */}
          <Link href="/engineering/exams/categories">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-64 px-8 py-4 border-2 border-zinc-200 text-zinc-900 font-black text-sm rounded-xl hover:bg-zinc-50 transition-all uppercase tracking-widest"
            >
              Exam Categories
            </motion.button>
          </Link>

          {/* Back to Toolkit - Same width for balance */}
          <Link href="/engineering/toolkit">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-64 px-8 py-4 border-2 border-transparent text-zinc-400 font-black text-xs hover:text-zinc-900 transition-all uppercase tracking-widest"
            >
              ← Back to Toolkit
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
  const client = new MongoClient(process.env.MONGODB_URI!);
  try {
    await client.connect();
    const db = client.db('lizrd_core');
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
  } finally {
    await client.close();
  }
};