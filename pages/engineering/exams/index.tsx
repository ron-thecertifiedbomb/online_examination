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
};

export default function ExamHomePage({ exams }: { exams: Exam[] }) {
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
                    instant MongoDB state persistence. Select an assessment below to initialize.
                </p>

                {/* DYNAMIC EXAM SELECTION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center mb-12">
                    {exams.map((exam) => (
                        <Link key={exam._id} href={`/engineering/exams/${exam._id}`}>
                            <motion.div
                                whileHover={{ scale: 1.02, borderColor: '#10b981' }}
                                whileTap={{ scale: 0.98 }}
                                className=" min-h-30 p-6 border-2 border-zinc-100 bg-white rounded-2xl text-left cursor-pointer transition-all shadow-sm group"
                            >
                                <h3 className="font-black text-zinc-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                                    {exam.title}
                                </h3>
                                <p className="text-xs text-zinc-400 mt-1 uppercase font-bold tracking-widest">
                                    Initialize Assessment →
                                </p>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Secondary Actions */}
                <div className="flex justify-center border-t border-zinc-100 pt-8">
                    <Link href="/toolkit">
                        <button className="text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-[0.2em]">
                            ← Back to Toolkit
                        </button>
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
                <div className="p-8 rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <h3 className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-3">Anti-Cheat</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed italic">"Detection of tab-switching and window-blurring events."</p>
                </div>
                <div className="p-8 rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <h3 className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-3">Instant Save</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed italic text-balance">"Progress is synced to lizrd_core MongoDB cluster in real-time."</p>
                </div>
                <div className="p-8 rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <h3 className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-3">Auto-Grading</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed italic">"Server-side logic calculates results immediately upon submission."</p>
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
            .project({ title: 1, slug: 1, description: 1 })
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