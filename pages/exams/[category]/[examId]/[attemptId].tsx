// File: pages/exams/[category]/[examId]/[attemptId].tsx
import { ObjectId } from 'mongodb';
import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import ScreenContainer from "@/components/shared/ScreenContainer/ScreenContainer";
import SEO from '@/components/shared/SEO/SEO';

export type Question = {
    id: string;
    text: string;
    options: string[];
    correctOption: number;
    points: number;
};

export type Exam = {
    _id: ObjectId;
    title: string;
    durationMinutes: number;
    passingScore: number;
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
   
    <SEO title="Active Exam Session" noIndex={true} />
   
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [passed, setPassed] = useState(false);
    const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60 || 3600); // default to 60 min if undefined

    const handleOptionChange = (questionId: string, optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // 1. Auto-Grade the Exam
        let totalPoints = 0;
        let earnedPoints = 0;

        exam.questions.forEach(q => {
            totalPoints += q.points;
            if (answers[q.id] === q.correctOption) {
                earnedPoints += q.points;
            }
        });

        const scorePercentage = Math.round((earnedPoints / (totalPoints || 1)) * 100);
        const hasPassed = scorePercentage >= exam.passingScore;

        // 2. Persist to MongoDB
        try {
            const response = await fetch('/api/attempts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    attemptId,
                    examId,
                    studentId,
                    answers,
                    score: scorePercentage,
                    passed: hasPassed
                })
            });

            if (!response.ok) {
                let errorMessage = `Failed to save attempt. Status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch (e) {
                    // The response body was not JSON or was empty.
                }
                throw new Error(errorMessage);
            }

            // 3. Update UI
            setFinalScore(scorePercentage);
            setPassed(hasPassed);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Submission error:', (error as Error).message);
            alert(`There was an error submitting your exam: ${(error as Error).message}. Please try again.`);
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (isSubmitted || isSubmitting) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isSubmitted, isSubmitting]);

    useEffect(() => {
        // Auto-submit when time runs out
        if (timeLeft === 0 && !isSubmitted && !isSubmitting) {
            handleSubmit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft, isSubmitted, isSubmitting]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (isSubmitted) {
        return (
            <ScreenContainer>
                <div className="max-w-xl m-auto p-10 border border-zinc-200 rounded-3xl bg-white shadow-xl text-center">
                    <span className="text-[10px] font-black tracking-[0.4em] text-zinc-400 uppercase mb-2 block">
                        Protocol Terminated
                    </span>
                    <h1 className="text-3xl font-black text-zinc-900 mb-4 uppercase">Assessment Complete</h1>
                    <p className="text-zinc-500 mb-8 italic">Your results have been securely synchronized with the Lizrd Core.</p>
                    <div className={`p-8 rounded-2xl border-2 ${passed ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                        <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Final Score</div>
                        <div className={`text-6xl font-black ${passed ? 'text-emerald-600' : 'text-red-600'}`}>{finalScore}%</div>
                        <div className={`mt-4 text-sm font-black uppercase tracking-widest ${passed ? 'text-emerald-600' : 'text-red-600'}`}>
                            {passed ? 'Passed - Certification Granted' : 'Failed - Minimum Score Not Met'}
                        </div>
                    </div>
                </div>
            </ScreenContainer>
        );
    }

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

                {/* TIMER COMPONENT */}
                <div className="bg-zinc-900 text-white rounded-2xl p-6 mb-8 flex justify-between items-center shadow-lg sticky top-4 z-10 border-2 border-zinc-800">
                    <span className="font-black uppercase tracking-[0.2em] text-xs text-zinc-400">Time Remaining</span>
                    <span className={`text-3xl font-black font-mono tracking-widest ${timeLeft <= 60 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                        {formatTime(timeLeft)}
                    </span>
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
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="mt-8 px-8 py-4 bg-emerald-600 text-white font-black text-sm rounded-xl hover:bg-emerald-700 shadow-sm transition-all uppercase tracking-widest disabled:opacity-50"
                    >
                        {isSubmitting ? 'Synchronizing...' : 'Submit Assessment'}
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

    const client = await import('../../../../lib/mongodb').then(m => m.default); // Use the shared clientPromise
    let studentName = "Unknown Student"; // Default fallback
    let exam = null;

    try {
        let objectId;
        try {
            objectId = new ObjectId(examId);
        } catch (error) {
            return { notFound: true }; // Invalid ID format
        }

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