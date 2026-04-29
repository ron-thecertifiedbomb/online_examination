import { MongoClient, ObjectId } from 'mongodb';
import { GetServerSideProps } from 'next';
import ScreenContainer from "@/components/shared/ScreenContainer/ScreenContainer";

interface ExamEngineProps {
    examId: string;
    attemptId: string;
    studentId: string;
    examTitle: string;
}

export default function LiveExamEngine({ examId, attemptId, studentId, examTitle }: ExamEngineProps) {
    return (
        <ScreenContainer>
            <div className="max-w-3xl m-auto p-10 border border-zinc-200 rounded-3xl bg-white shadow-xl">
                <div className="flex flex-col items-center text-center mb-8">
                    <span className="text-[10px] font-black tracking-[0.4em] text-emerald-600 uppercase mb-2">
                        Live Proctoring Active
                    </span>
                    <h1 className="text-3xl font-black text-zinc-900 leading-tight uppercase">
                        {examTitle}
                    </h1>
                </div>

                <div className="bg-zinc-50 rounded-2xl p-5 space-y-3 font-mono text-sm border border-zinc-200">
                    <p><span className="text-zinc-400 font-bold uppercase tracking-widest mr-2">Exam ID:</span> {examId}</p>
                    <p><span className="text-zinc-400 font-bold uppercase tracking-widest mr-2">Attempt ID:</span> {attemptId}</p>
                    <p><span className="text-zinc-400 font-bold uppercase tracking-widest mr-2">Student ID:</span> {studentId}</p>
                </div>

                <div className="mt-12 text-center text-zinc-500 text-sm">
                    <p className="italic">The exam environment is now initialized. Good luck!</p>
                    {/* Exam questions and interactive logic will go here */}
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
    const { examId, attemptId } = context.params as { examId: string; attemptId: string };

    // Extract query parameters
    const studentId = context.query.studentId as string || 'Unknown';

    const client = new MongoClient(process.env.MONGODB_URI!);
    let examTitle = "Exam Engine"; // Default fallback

    try {
        let objectId;
        try {
            objectId = new ObjectId(examId);
        } catch (error) {
            return { notFound: true }; // Invalid ID format
        }

        await client.connect();
        const db = client.db('lizrd_core');
        const exam = await db.collection('exams').findOne({ _id: objectId });

        if (!exam) return { notFound: true };
        examTitle = exam.title;
    } catch (e) {
        return { notFound: true };
    } finally {
        await client.close();
    }

    return {
        props: {
            examId,
            attemptId,
            studentId,
            examTitle
        }
    };
};