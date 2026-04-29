import { MongoClient, ObjectId } from 'mongodb';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import ScreenContainer from "@/components/shared/ScreenContainer/ScreenContainer";

export type Question = {
    id: string;
    text: string;
    options: string[];
    correctOption: number;
    points: number;
};

export type Exam = {
    _id: string;
    title: string;
    questions: Question[];
};

interface ExamEngineProps {
    category: string;
    examId: string;
    attemptId: string;
    studentId: string;
    studentName: string;
    exam: Exam;
}

export default function LiveExamEngine({ category, examId, attemptId, studentId, studentName, exam }: ExamEngineProps) {
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});

    const handleOptionChange = (questionId: string, optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    return (
        <ScreenContainer>
            <div className="max-w-3xl m-auto p-10 border border-zinc-200 rounded-3xl bg-white shadow-xl">
                <div className="flex flex-col items-center text-center mb-8">
                    <span className="text-[10px] font-black tracking-[0.4em] text-emerald-600 uppercase mb-2">
                        Live Proctoring Active
                    </span>
                    <h1 className="text-3xl font-black text-zinc-900 leading-tight uppercase">
                        {exam.title}
                    </h1>
                </div>

                <div className="bg-zinc-50 rounded-2xl p-5 mb-8 space-y-3 font-mono text-sm border border-zinc-200">
                    <p><span className="text-zinc-400 font-bold uppercase tracking-widest mr-2">Category:</span> <span className="uppercase">{category.replace('-', ' ')}</span></p>
                    <p><span className="text-zinc-400 font-bold uppercase tracking-widest mr-2">Exam ID:</span> {examId}</p>
                    <p><span className="text-zinc-400 font-bold uppercase tracking-widest mr-2">Attempt ID:</span> {attemptId}</p>
                    <p><span className="text-zinc-400 font-bold uppercase tracking-widest mr-2">Student ID:</span> {studentId}</p>
                    <p><span className="text-zinc-400 font-bold uppercase tracking-widest mr-2">Student Name:</span> {studentName}</p>
                </div>

                {/* Exam Questions */}
                <div className="space-y-10">
                    {exam.questions.map((question, index) => (
                        <div key={question.id} className="p-6 border border-zinc-200 rounded-2xl bg-white">
                            <p className="font-bold text-zinc-800 leading-relaxed">
                                <span className="text-emerald-600 font-black mr-3">Q{index + 1}.</span>
                                {question.text}
                            </p>
                            <div className="mt-6 space-y-4">
                                {question.options.map((option, optionIndex) => (
                                    <label key={optionIndex} className="flex items-center p-4 rounded-xl border-2 border-zinc-100 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 transition-all cursor-pointer">
                                        <input
                                            type="radio"
                                            name={question.id}
                                            value={optionIndex}
                                            checked={answers[question.id] === optionIndex}
                                            onChange={() => handleOptionChange(question.id, optionIndex)}
                                            className="w-5 h-5 mr-4 accent-emerald-600"
                                        />
                                        <span className="font-medium text-zinc-700">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button className="mt-8 px-8 py-4 bg-emerald-600 text-white font-black text-sm rounded-xl hover:bg-emerald-700 shadow-sm transition-all uppercase tracking-widest">
                        Submit Assessment
                    </button>
                </div>
            </div>
        </ScreenContainer>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // Extract route parameters
    const { category, examId, attemptId } = context.params as { category: string; examId: string; attemptId: string };

    // Extract query parameters
    const studentId = context.query.studentId as string || 'Unknown';

    const client = new MongoClient(process.env.MONGODB_URI!);
    let studentName = "Unknown Student"; // Default fallback
    let exam = null;

    try {
        let objectId;
        try {
            objectId = new ObjectId(examId);
        } catch (error) {
            return { notFound: true }; // Invalid ID format
        }

        await client.connect();
        const db = client.db('lizrd_core');
        const foundExam = await db.collection('exams').findOne({ _id: objectId });

        if (!foundExam) return { notFound: true };

        if (studentId !== 'Unknown') {
            const student = await db.collection('students').findOne({ studentId });
            if (student) {
                studentName = student.name;
            }
        }

        exam = JSON.parse(JSON.stringify(foundExam));
    } catch (e) {
        return { notFound: true };
    } finally {
        await client.close();
    }

    return {
        props: {
            category,
            examId,
            attemptId,
            studentId,
            studentName,
            exam
        }
    };
};