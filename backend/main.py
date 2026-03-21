from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from utils.parser import extract_text
from utils.skill_extractor import extract_skills
from utils.gap_analysis import analyze_skill_gap
from utils.roadmap_generator import generate_roadmap
from utils.reasoning_trace import generate_reasoning_trace
from utils.supabase_client import save_analysis
from utils.experience_extractor import extract_skill_levels
from utils.metrics import calculate_metrics

app = FastAPI(title="AI Adaptive Onboarding Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Backend is running"}


@app.post("/analyze")
async def analyze_documents(
    resume: UploadFile = File(...),
    jd: UploadFile = File(...)
):
    try:
        resume_bytes = await resume.read()
        jd_bytes = await jd.read()

        resume_text = extract_text(resume.filename, resume_bytes)
        jd_text = extract_text(jd.filename, jd_bytes)

        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Resume text could not be extracted")

        if not jd_text.strip():
            raise HTTPException(status_code=400, detail="JD text could not be extracted")

        resume_skills = extract_skills(resume_text)
        jd_skills = extract_skills(jd_text)

        # NEW: skill level extraction
        resume_levels = extract_skill_levels(resume_skills, resume_text)
        jd_levels = extract_skill_levels(jd_skills, jd_text)

        # UPDATED: pass levels into gap analysis
        gap_result = analyze_skill_gap(
            resume_skills,
            jd_skills,
            resume_levels=resume_levels,
            jd_levels=jd_levels
        )

        # UPDATED: roadmap now also includes partial skills for improvement
        roadmap = generate_roadmap(
            gap_result["missing_skills"] + gap_result["partial_skills"]
        )

        # UPDATED: richer reasoning trace
        reasoning_trace = generate_reasoning_trace(
            jd_skills=jd_skills,
            matched_skills=gap_result["matched_skills"],
            missing_skills=gap_result["missing_skills"],
            roadmap=roadmap,
            partial_skills=gap_result["partial_skills"],
            resume_levels=resume_levels,
            jd_levels=jd_levels
        )

        # NEW: metrics block
        metrics = calculate_metrics(
            jd_skills=jd_skills,
            matched_skills=gap_result["matched_skills"],
            missing_skills=gap_result["missing_skills"],
            partial_skills=gap_result["partial_skills"],
            roadmap=roadmap
        )

        result = {
            "candidate_name": "Candidate",
            "target_role": "Target Role",

            # existing fields
            "resume_skills": resume_skills,
            "jd_skills": jd_skills,
            "matched_skills": gap_result["matched_skills"],
            "missing_skills": gap_result["missing_skills"],
            "partial_skills": gap_result["partial_skills"],
            "match_score": gap_result["match_score"],
            "readiness_level": gap_result["readiness_level"],
            "roadmap": roadmap,
            "reasoning_trace": reasoning_trace,

            # NEW fields added only, nothing removed
            "resume_skill_levels": resume_levels,
            "jd_skill_levels": jd_levels,
            "metrics": metrics
        }

        # Keep existing Supabase save
        # If schema is old, this may fail; so we keep safe fallback
        try:
            save_analysis(result)
        except Exception as save_error:
            print(f"Supabase save skipped: {save_error}")

        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")