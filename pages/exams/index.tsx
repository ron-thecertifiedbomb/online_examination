// File: pages/exams/index.tsx
import { MongoClient, ObjectId, WithId, Document } from 'mongodb';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import React from 'react';
import ScreenContainer from "../../components/shared/ScreenContainer/ScreenContainer";

// It's a good practice to have a specific type for the props
interface StartExamPageProps {
    exam: WithId<Document>;
}

export default function StartExamPage({ exam }: StartExamPageProps) {
    const router = useRouter();
    const [studentId, setStudentId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleBegin = async () => {
        if (!studentId) return alert("Please enter your Student ID to proceed.");

        setIsLoading(true);

        try {
            // 1. Verify the student exists in the database
            const studentRes = await fetch(`/api/students/${encodeURIComponent(studentId)}`);
            if (!studentRes.ok) {
                setIsLoading(false);
                return alert("Student ID not found. Please check your credentials.");
            }

            // 2. Generate a local attempt ID (mocking a 24-character MongoDB ObjectId)
            const localAttemptId = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

            // 3. We push to the new [examId]/[attemptId] route structure
            router.push(`/engineering/exams/${exam._id}/${localAttemptId}?studentId=${encodeURIComponent(studentId)}`);
        } catch (error) {
            console.error("Lizard Engine Error:", error);
            setIsLoading(false);
        }
    };

    return (
        <ScreenContainer >
            <div className="max-w-md m-auto w-full p-10 border border-zinc-200 rounded-3xl bg-white shadow-xl shadow-zinc-200/50 ">
                <div className="flex flex-col items-center text-center mb-8">
                    <span className="text-[10px] font-black tracking-[0.4em] text-emerald-600 uppercase mb-2">
                        System Protocol 04
                    </span>
                    <h1 className="text-3xl font-black text-zinc-900 leading-tight uppercase">
                        {exam.title}
                    </h1>
                </div>

                <div className="bg-zinc-50 rounded-2xl p-5 mb-8 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400 font-bold uppercase tracking-widest">Duration</span>
                        <span className="text-zinc-900 font-black">{exam.durationMinutes} MINS</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400 font-bold uppercase tracking-widest">Passing Score</span>
                        <span className="text-zinc-900 font-black">{exam.passingScore}%</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-200 flex justify-between items-center text-[10px]">
                        <span className="text-emerald-600 font-bold uppercase tracking-tighter">Proctoring Active</span>
                        <span className="text-zinc-400">v2.0.4-LIZARD</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 ml-1">
                            Credential Entry
                        </label>
                        <input
                            type="text"
                            placeholder="STUDENT ID / EMAIL"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl border-2 border-zinc-100 bg-zinc-50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-zinc-900 placeholder:text-zinc-300"
                        />
                    </div>

                    <button
                        onClick={handleBegin}
                        disabled={isLoading}
                        className="w-full py-5 bg-zinc-900 text-white font-black text-sm rounded-2xl hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-[0.97] disabled:opacity-50 uppercase tracking-widest"
                    >
                        {isLoading ? "Synchronizing..." : "Initialize Exam"}
                    </button>
                </div>
            </div>
        </ScreenContainer>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { examId: id } = context.params as { examId: string };
    const client = new MongoClient(process.env.MONGODB_URI!);

    try {
        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch (error) {
            return { notFound: true }; // Invalid ID format
        }

        await client.connect();
        const db = client.db('lizrd_core');
        const exam = await db.collection('exams').findOne({ _id: objectId });

        if (!exam) return { notFound: true };

        return { props: { exam: JSON.parse(JSON.stringify(exam)) } };
    } catch (e) {
        return { notFound: true };
    } finally {
        await client.close();
    }
};