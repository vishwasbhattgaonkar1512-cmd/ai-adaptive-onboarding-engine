"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

type RoadmapPhase = {
  phase: string;
  title: string;
  modules: string[];
};

type ReasoningItem = {
  skill: string;
  status: string;
  reason: string;
  recommended_module: string | null;
};

type AnalysisResult = {
  candidate_name: string;
  target_role: string;
  resume_skills: string[];
  jd_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
  partial_skills: string[];
  match_score: number;
  readiness_level: string;
  roadmap: RoadmapPhase[];
  reasoning_trace: ReasoningItem[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function Home() {
  const[resumeFile, setResumeFile] = useState<File | null>(null);
  const[jdFile, setJdFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const[error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!resumeFile || !jdFile) {
      setError("Please upload both resume and job description files.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jd", jdFile);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const SkillBadge = ({ text, type = "neutral" }: { text: string; type?: "neutral" | "matched" | "missing" | "partial" }) => {
    let colors = "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 hover:border-gray-300";
    if (type === "matched") colors = "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300";
    if (type === "missing") colors = "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300";
    if (type === "partial") colors = "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300";

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ease-out hover:-translate-y-0.5 shadow-sm hover:shadow cursor-default ${colors}`}>
        {text}
      </span>
    );
  };

  const getReadinessBadge = (level: string) => {
    const lower = level.toLowerCase();
    if (lower.includes("ready") || lower.includes("high")) {
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 shadow-sm">Ready</span>;
    }
    if (lower.includes("partial") || lower.includes("medium")) {
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">{level}</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 shadow-sm">{level}</span>;
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-8 text-center group cursor-default">
      <svg className="w-8 h-8 text-gray-300 mb-3 group-hover:text-blue-400 group-hover:-translate-y-1 transition-all duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p className="text-sm text-gray-400 italic group-hover:text-gray-500 transition-colors duration-300">{message}</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#111318] font-sans selection:bg-blue-100 selection:text-blue-900 pb-24 relative overflow-hidden">
      
      <motion.div 
        className="max-w-5xl mx-auto px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/50 border border-blue-100/60 mb-5 shadow-sm">
            <span className="flex w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
              Onboarding Intelligence
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#111318] tracking-tight leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">AI-Adaptive</span> Onboarding Engine
          </h1>
          <p className="text-gray-500 mt-4 text-base md:text-lg max-w-2xl leading-relaxed">
            Upload a candidate's resume and target job description to generate a personalized, data-driven learning roadmap.
          </p>
        </motion.div>
        
        <motion.hr variants={itemVariants} className="mb-10 border-t border-gray-200" />

        {/* Upload Cards Grid */}
        <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
          
          {/* Resume Upload */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 p-6 flex flex-col transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#111318]">Resume</h2>
            <p className="text-sm text-gray-500 mb-4">Upload candidate profile</p>
            
            {resumeFile ? (
              <div className="flex items-center justify-between mt-auto p-4 border border-blue-200 rounded-lg bg-blue-50/30 h-[104px] group hover:bg-blue-50/60 transition-colors duration-200">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 bg-white shadow-sm border border-gray-100 text-blue-600 rounded-md shrink-0 group-hover:scale-105 transition-transform duration-300 ease-out">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#111318] truncate">{resumeFile.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button 
                  onClick={() => setResumeFile(null)}
                  className="p-1.5 ml-2 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:scale-110 active:scale-95 rounded-md transition-all duration-200 shrink-0"
                  aria-label="Remove resume file"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center mt-auto w-full h-[104px] border-2 border-dashed border-gray-300 rounded-lg bg-[#F7F8FA] hover:bg-white hover:border-blue-400 hover:shadow-sm transition-all duration-200 cursor-pointer group active:scale-[0.99] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="sr-only"
                />
                <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 group-hover:-translate-y-1 transition-all duration-300 ease-out mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <p className="text-sm text-gray-500 transition-colors">
                  <span className="text-blue-600 font-medium group-hover:underline">Browse file</span>
                </p>
              </label>
            )}
          </div>

          {/* JD Upload */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 p-6 flex flex-col transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-[#111318]">Job Description</h2>
            <p className="text-sm text-gray-500 mb-4">Upload target role requirements</p>
            
            {jdFile ? (
              <div className="flex items-center justify-between mt-auto p-4 border border-blue-200 rounded-lg bg-blue-50/30 h-[104px] group hover:bg-blue-50/60 transition-colors duration-200">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 bg-white shadow-sm border border-gray-100 text-blue-600 rounded-md shrink-0 group-hover:scale-105 transition-transform duration-300 ease-out">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#111318] truncate">{jdFile.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{(jdFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button 
                  onClick={() => setJdFile(null)}
                  className="p-1.5 ml-2 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:scale-110 active:scale-95 rounded-md transition-all duration-200 shrink-0"
                  aria-label="Remove job description file"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center mt-auto w-full h-[104px] border-2 border-dashed border-gray-300 rounded-lg bg-[#F7F8FA] hover:bg-white hover:border-blue-400 hover:shadow-sm transition-all duration-200 cursor-pointer group active:scale-[0.99] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => setJdFile(e.target.files?.[0] || null)}
                  className="sr-only"
                />
                <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 group-hover:-translate-y-1 transition-all duration-300 ease-out mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <p className="text-sm text-gray-500 transition-colors">
                  <span className="text-blue-600 font-medium group-hover:underline">Browse file</span>
                </p>
              </label>
            )}
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div variants={itemVariants} className="mt-6 flex">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-48 bg-blue-600 text-white rounded-lg px-6 py-2.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              "Analyze Profile"
            )}
          </button>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div variants={itemVariants} className="mt-6 border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg flex items-start gap-3 shadow-sm">
            <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </motion.div>
        )}

      </motion.div>

      {/* Analysis Results Orchestration */}
      {result && (
        <motion.div 
          className="max-w-5xl mx-auto px-6 space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          
          {/* Overview Strip */}
          <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Candidate</p>
              <p className="text-lg font-semibold text-[#111318] truncate">{result.candidate_name}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Target Role</p>
              <p className="text-lg font-semibold text-[#111318] truncate">{result.target_role}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-t-2 border-t-blue-600 p-6 flex flex-col justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 relative z-10">Match Score</p>
              <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-3xl font-bold text-[#111318]">{result.match_score}</span>
                <span className="text-lg font-bold text-blue-600">%</span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center items-start hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Readiness</p>
              {getReadinessBadge(result.readiness_level)}
            </div>
          </motion.div>

          {/* Source Skills */}
          <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-[#111318]">Resume Skills</h3>
                <p className="text-sm text-gray-500">Extracted from candidate profile</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.resume_skills.length > 0 ? (
                  result.resume_skills.map((skill) => <SkillBadge key={skill} text={skill} />)
                ) : (
                  <EmptyState message="No skills found" />
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-[#111318]">Required Skills</h3>
                <p className="text-sm text-gray-500">Extracted from job description</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.jd_skills.length > 0 ? (
                  result.jd_skills.map((skill) => <SkillBadge key={skill} text={skill} />)
                ) : (
                  <EmptyState message="No skills found" />
                )}
              </div>
            </div>
          </motion.div>

          {/* Skill Matches & Gaps */}
          <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#111318]">Matched Skills</h3>
                  <p className="text-sm text-gray-500">Candidate meets requirements</p>
                </div>
                <div className="p-2 bg-green-50 rounded-full text-green-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.matched_skills.length > 0 ? (
                  result.matched_skills.map((skill) => <SkillBadge key={skill} text={skill} type="matched" />)
                ) : (
                  <EmptyState message="No matched skills" />
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#111318]">Skill Gaps</h3>
                  <p className="text-sm text-gray-500">Missing from candidate profile</p>
                </div>
                <div className="p-2 bg-red-50 rounded-full text-red-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.missing_skills.length > 0 ? (
                  result.missing_skills.map((skill) => <SkillBadge key={skill} text={skill} type="missing" />)
                ) : (
                  <EmptyState message="No missing skills" />
                )}
              </div>
            </div>
          </motion.div>

          {/* Roadmap Stepper */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#111318]">Adaptive Learning Roadmap</h3>
              <p className="text-sm text-gray-500">Recommended sequential path to proficiency</p>
            </div>
            
            {result.roadmap.length > 0 ? (
              <div className="relative border-l-2 border-gray-100 ml-4 pb-4">
                {result.roadmap.map((phase, index) => (
                  <div key={phase.phase} className="relative pl-8 mb-10 last:mb-0 group cursor-default">
                    <div className="absolute w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold -left-[15px] top-0 ring-4 ring-white shadow-sm transition-transform duration-300 ease-out group-hover:scale-125">
                      {index + 1}
                    </div>
                    <div className="pt-0.5 group-hover:translate-x-1 transition-transform duration-300 ease-out">
                      <span className="text-xs font-bold text-blue-600 tracking-wide uppercase">{phase.phase}</span>
                      <h4 className="text-base font-semibold text-[#111318] mt-1 mb-4">{phase.title}</h4>
                      <ul className="space-y-2.5">
                        {phase.modules.map((module) => (
                          <li key={module} className="flex items-start text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                            <span className="text-gray-300 mr-2 mt-0.5 group-hover:text-blue-400 transition-colors duration-300">•</span>
                            <span className="leading-relaxed">{module}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No roadmap generated" />
            )}
          </motion.div>

          {/* Reasoning Trace Table */}
          <motion.div variants={itemVariants} className="pt-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#111318]">Reasoning Trace</h3>
              <p className="text-sm text-gray-500">Engine analysis logs and mapping</p>
            </div>
            
            {result.reasoning_trace.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full table-auto text-left">
                  <thead className="bg-gray-50/80 border-b border-gray-200">
                    <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4">Skill</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Reason</th>
                      <th className="px-6 py-4">Recommended Module</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {result.reasoning_trace.map((item, index) => {
                      let statusType: "matched" | "missing" | "partial" | "neutral" = "neutral";
                      if (item.status.toLowerCase() === "matched") statusType = "matched";
                      if (item.status.toLowerCase() === "missing") statusType = "missing";
                      if (item.status.toLowerCase() === "partial") statusType = "partial";

                      return (
                        <tr key={index} className="even:bg-gray-50/50 odd:bg-white hover:bg-blue-50/40 transition-colors duration-200 group">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111318] group-hover:text-blue-700 transition-colors">
                            {item.skill}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <SkillBadge text={item.status} type={statusType} />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 min-w-[250px] group-hover:text-gray-900 transition-colors">
                            {item.reason}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap group-hover:text-gray-700 transition-colors">
                            {item.recommended_module || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <EmptyState message="No trace logs available" />
              </div>
            )}
          </motion.div>

        </motion.div>
      )}
    </main>
  );
}