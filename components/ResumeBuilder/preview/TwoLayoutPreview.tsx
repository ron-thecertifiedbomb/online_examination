
import React, { ButtonHTMLAttributes, useRef } from "react";
import { Education, Experience, Personal, Reference } from "../../../interfaces";

interface TwoLayoutPreviewProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    personal: Personal,
    experience: Experience[],
    education: Education[],
    references: Reference[],
    skills: string[]
}

export function TwoLayoutPreview({ personal, experience, education, references, skills }: TwoLayoutPreviewProps) {

    const previewRef = useRef<HTMLDivElement | null>(null);

    return (
        <div
            ref={previewRef}
            className="preview bg-white border rounded shadow text-gray-700 p-4 text-xs"
            suppressHydrationWarning
        >
            {/* Header Section */}
            <div className="text-center mb-3 border-b pb-2">
                <h1 className="font-bold text-lg mb-1">{personal.fullName}</h1>
                <div className="flex justify-center flex-wrap gap-3 text-gray-600">
                    <span>{personal.title}</span>
                    <span>•</span>
                    <span>{personal.email}</span>
                    <span>•</span>
                    <span>{personal.phone}</span>
                    <span>•</span>
                    <span>{personal.location}</span>
                </div>
            </div>

            <div className="flex gap-4">
                {/* Left Column */}
                <div className="w-2/3 space-y-3">
                    {/* Summary */}
                    {personal.summary && (
                        <div>
                            <h3 className="font-bold text-sm border-b border-gray-300 pb-1 mb-1">PROFESSIONAL SUMMARY</h3>
                            <p className="text-justify">{personal.summary}</p>
                        </div>
                    )}

                    {/* Experience */}
                    <div>
                        <h3 className="font-bold text-sm border-b border-gray-300 pb-1 mb-1">EXPERIENCE</h3>
                        <div className="space-y-2">
                            {experience.map(exp => (
                                <div key={exp.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold">{exp.role}</div>
                                            <div className="text-gray-600">{exp.company}</div>
                                        </div>
                                        <div className="text-gray-500 text-xs whitespace-nowrap">
                                            {exp.start} - {exp.end}
                                        </div>
                                    </div>
                                    <div className="mt-1">{exp.details}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="w-1/3 space-y-3">
                    {/* Skills */}
                    <div>
                        <h3 className="font-bold text-sm border-b border-gray-300 pb-1 mb-1">SKILLS</h3>
                        <div className="flex flex-wrap gap-1">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-100 px-2 py-1 rounded text-xs"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div>
                        <h3 className="font-bold text-sm border-b border-gray-300 pb-1 mb-1">EDUCATION</h3>
                        <div className="space-y-2">
                            {education.map(edu => (
                                <div key={edu.id}>
                                    <div className="font-semibold">{edu.degree}</div>
                                    <div className="text-gray-600">{edu.school}</div>
                                    <div className="text-gray-500 text-xs">
                                        {edu.start} - {edu.end}
                                    </div>
                                    {edu.details && (
                                        <div className="mt-1 text-xs">{edu.details}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* References */}
                    {references.length > 0 && (
                        <div>
                            <h3 className="font-bold text-sm border-b border-gray-300 pb-1 mb-1">REFERENCES</h3>
                            <div className="space-y-2">
                                {references.map(ref => (
                                    <div key={ref.id}>
                                        <div className="font-semibold">{ref.name}</div>
                                        <div className="text-gray-600 text-xs">{ref.relation}</div>
                                        <div className="text-gray-500 text-xs">{ref.contact}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
