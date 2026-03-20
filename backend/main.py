from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from utils.parser import extract_text
from utils.skill_extractor import extract_skills
from utils.gap_analysis import analyze_skill_gap
from utils.roadmap_generator import generate_roadmap
from utils.reasoning_trace import generate_reasoning_trace
from utils.supabase_client import save_analysis

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

        gap_result = analyze_skill_gap(resume_skills, jd_skills)
        roadmap = generate_roadmap(gap_result["missing_skills"])
        reasoning_trace = generate_reasoning_trace(
            jd_skills=jd_skills,
            matched_skills=gap_result["matched_skills"],
            missing_skills=gap_result["missing_skills"],
            roadmap=roadmap
        )

        result = {
            "candidate_name": "Candidate",
            "target_role": "Target Role",
            "resume_skills": resume_skills,
            "jd_skills": jd_skills,
            "matched_skills": gap_result["matched_skills"],
            "missing_skills": gap_result["missing_skills"],
            "partial_skills": gap_result["partial_skills"],
            "match_score": gap_result["match_score"],
            "readiness_level": gap_result["readiness_level"],
            "roadmap": roadmap,
            "reasoning_trace": reasoning_trace
        }

        save_analysis(result)

        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")