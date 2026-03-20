"use client";

import { useState } from "react";
import axios from "axios";

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

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

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

  const SkillBadge = ({ text }: { text: string }) => (
    <span className="rounded-full bg-black text-white px-3 py-1 text-sm">
      {text}
    </span>
  );

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">AI-Adaptive Onboarding Engine</h1>
          <p className="text-gray-600 mt-2">
            Upload a resume and job description to generate a personalized onboarding roadmap.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="block w-full border rounded-lg p-3"
            />
            {resumeFile && (
              <p className="mt-3 text-sm text-gray-600">Selected: {resumeFile.name}</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Job Description</h2>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => setJdFile(e.target.files?.[0] || null)}
              className="block w-full border rounded-lg p-3"
            />
            {jdFile && (
              <p className="mt-3 text-sm text-gray-600">Selected: {jdFile.name}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="rounded-xl bg-black text-white px-6 py-3 font-medium disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-10 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-xl bg-gray-100 p-4">
                  <p className="text-sm text-gray-500">Candidate</p>
                  <p className="font-semibold">{result.candidate_name}</p>
                </div>
                <div className="rounded-xl bg-gray-100 p-4">
                  <p className="text-sm text-gray-500">Target Role</p>
                  <p className="font-semibold">{result.target_role}</p>
                </div>
                <div className="rounded-xl bg-gray-100 p-4">
                  <p className="text-sm text-gray-500">Match Score</p>
                  <p className="font-semibold">{result.match_score}%</p>
                </div>
                <div className="rounded-xl bg-gray-100 p-4">
                  <p className="text-sm text-gray-500">Readiness</p>
                  <p className="font-semibold">{result.readiness_level}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-xl font-semibold mb-4">Resume Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.resume_skills.length > 0 ? (
                    result.resume_skills.map((skill) => <SkillBadge key={skill} text={skill} />)
                  ) : (
                    <p className="text-gray-500">No skills found.</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-xl font-semibold mb-4">JD Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.jd_skills.length > 0 ? (
                    result.jd_skills.map((skill) => <SkillBadge key={skill} text={skill} />)
                  ) : (
                    <p className="text-gray-500">No skills found.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-xl font-semibold mb-4">Matched Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.matched_skills.length > 0 ? (
                    result.matched_skills.map((skill) => <SkillBadge key={skill} text={skill} />)
                  ) : (
                    <p className="text-gray-500">No matched skills.</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-xl font-semibold mb-4">Missing Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing_skills.length > 0 ? (
                    result.missing_skills.map((skill) => <SkillBadge key={skill} text={skill} />)
                  ) : (
                    <p className="text-gray-500">No missing skills.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-xl font-semibold mb-4">Adaptive Learning Roadmap</h3>
              <div className="space-y-4">
                {result.roadmap.length > 0 ? (
                  result.roadmap.map((phase) => (
                    <div key={phase.phase} className="rounded-xl border p-4">
                      <p className="text-sm text-gray-500">{phase.phase}</p>
                      <h4 className="text-lg font-semibold">{phase.title}</h4>
                      <ul className="list-disc list-inside mt-2 text-gray-700">
                        {phase.modules.map((module) => (
                          <li key={module}>{module}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No roadmap generated.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-xl font-semibold mb-4">Reasoning Trace</h3>
              <div className="space-y-4">
                {result.reasoning_trace.length > 0 ? (
                  result.reasoning_trace.map((item, index) => (
                    <div key={index} className="rounded-xl border p-4">
                      <p><span className="font-semibold">Skill:</span> {item.skill}</p>
                      <p><span className="font-semibold">Status:</span> {item.status}</p>
                      <p><span className="font-semibold">Reason:</span> {item.reason}</p>
                      <p>
                        <span className="font-semibold">Recommended Module:</span>{" "}
                        {item.recommended_module || "None"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No reasoning trace available.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}