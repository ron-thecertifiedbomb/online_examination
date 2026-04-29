import React from "react";
import { Education, Experience, Personal, Reference } from "../../../interfaces";


interface ModernMinimalistPreviewProps {
    personal: Personal;
    experience: Experience[];
    education: Education[];
    references: Reference[];
    skills: string[];
    className?: string;
}

export const ModernMinimalistPreview: React.FC<ModernMinimalistPreviewProps> = ({
    personal,
    experience = [],
    education = [],
    references = [],
    skills = [],
    className = ""
}) => {
    return (
        <div className={`modern-minimalist-preview bg-white text-gray-800 p-8 rounded-lg border border-gray-200 ${className}`}>

            {/* Header Section */}
            <header className="text-center mb-8 pb-6 border-b-2 border-gray-300">
                <h1 className="font-bold mb-2 text-gray-900">{personal.fullName}</h1>
                {personal.title && <div className="text-gray-600 mb-4 font-medium"><p>{personal.title}</p></div>}
                <div className="flex justify-center flex-wrap gap-4 text-gray-500">
                    {personal.email && <div>{personal.email}</div>}
                    {personal.phone && <div>{personal.phone}</div>}
                    {personal.location && <div>{personal.location}</div>}
                </div>
            </header>

            {/* Scrollable container for small screens */}
            <div className="overflow-x-auto">
                <div className="flex gap-10 min-w-[700px]">

                    {/* Main Content Column */}
                    <main className="flex-1 space-y-6">
                        {personal.summary && (
                            <section className="space-y-4">
                                <h2 className="font-bold text-gray-800 uppercase tracking-wide">Professional Profile</h2>
                                <div className="rounded-lg font-sm">{personal.summary}</div>
                            </section>
                        )}

                        {experience.length > 0 && (
                            <section className="space-y-2">
                                <h2 className="font-bold text-gray-800 uppercase tracking-wide">Work Experience</h2>
                                <div className="space-y-2">
                                    {experience.map((exp) => (
                                        <div key={exp.id}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-semibold text-gray-900 mb-2">{exp.company}</div>
                                                    <div className="text-gray-600 font-medium">{exp.role}</div>
                                                </div>
                                                <div className="text-gray-500 px-3 py-1 rounded-full text-xs whitespace-nowrap">
                                                    {exp.start} - {exp.end}
                                                </div>
                                            </div>
                                            <div className="text-gray-700 text-sm mt-2">- {exp.details}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>

                    {/* Sidebar Column */}
                    <aside className="w-80 space-y-2">
                        {skills.length > 0 && (
                            <section className="space-y-2">
                                <h2 className="font-bold text-gray-800 uppercase tracking-wide">Technical Skills</h2>
                                <div className="grid grid-cols-2 gap-1">
                                    {skills.map((skill, index) => (
                                        <div key={index} className="text-start py-1 rounded-lg text-sm font-light">{skill}</div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className="space-y-2">
                                <h2 className="font-bold text-gray-800 uppercase tracking-wide">Education</h2>
                                <div className="space-y-2">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <div className="font-light text-gray-900">{edu.degree}</div>
                                                    <div className="text-gray-600 font-light">{edu.school}</div>
                                                </div>
                                                <div className="text-gray-500 px-2 py-1 rounded-full text-xs">{edu.start} - {edu.end}</div>
                                            </div>
                                            {edu.details && <div className="mt-2 text-gray-700">{edu.details}</div>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {references.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="font-bold text-gray-800 uppercase tracking-wide">References</h2>
                                <div className="space-y-2">
                                    {references.map((ref) => (
                                        <div key={ref.id}>
                                            <div className="font-light text-gray-900">{ref.name}</div>
                                            <div className="text-gray-600">{ref.relation}</div>
                                            <div className="text-gray-500 text-sm">{ref.contact}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
};