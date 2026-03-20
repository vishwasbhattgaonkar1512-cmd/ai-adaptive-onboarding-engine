from pydantic import BaseModel
from typing import List, Optional


class RoadmapPhase(BaseModel):
    phase: str
    title: str
    modules: List[str]


class ReasoningItem(BaseModel):
    skill: str
    status: str
    reason: str
    recommended_module: Optional[str] = None


class AnalysisResponse(BaseModel):
    candidate_name: str
    target_role: str
    resume_skills: List[str]
    jd_skills: List[str]
    matched_skills: List[str]
    missing_skills: List[str]
    partial_skills: List[str]
    match_score: float
    readiness_level: str
    roadmap: List[RoadmapPhase]
    reasoning_trace: List[ReasoningItem]