import React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import ScreenContainer from "@/components/shared/ScreenContainer/ScreenContainer";

type Exam = {
    _id: string;
    title: string;
    slug: string;
    description: string;
    durationMinutes: number;
    status: string;
};

export default function TeacherDashboard({ exams }: { exams: Exam[] }) {
    return (
        <ScreenContainer className="pt-30" >
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900">
                        ENGINEERING <span className="text-emerald-600">HUB</span>
                    </h1>
                    <p className="text-sm text-zinc-500 uppercase tracking-widest mt-1">
                        Exam Management Control
                    </p>
                </div>

                <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 transition-all shadow-sm">
                    CREATE NEW EXAM
                </button>
            </div>

            {/* THE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exams.map((exam) => (
                    <div key={exam._id} className="bg-white border border-zinc-200 rounded-xl p-6 hover:border-emerald-300 transition-all shadow-sm group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-bold tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase">
                                {exam.status}
                            </span>
                            <span className="text-xs text-zinc-400 font-medium">
                                {exam.durationMinutes} MINS
                            </span>
                        </div>

                        <h2 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-emerald-600 transition-colors">
                            {exam.title}
                        </h2>
                        <p className="text-sm text-zinc-500 mb-6 line-clamp-2 italic">
                            "{exam.description}"
                        </p>

                        <div className="flex gap-3">
                            <Link href={`/engineering/exams/${exam.slug}`} className="flex-1">
                                <button className="w-full py-2 border border-zinc-200 text-zinc-700 text-xs font-bold rounded-lg hover:bg-zinc-50 transition-all">
                                    VIEW QUESTIONS
                                </button>
                            </Link>
                            <button className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-all">
                                ANALYTICS
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ScreenContainer>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    // Fetching from your own API route
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams`);
    const exams = await res.json();

    return {
        props: { exams },
    };
};