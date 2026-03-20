import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = None

if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


def save_analysis(result: dict):
    if supabase is None:
        print("Supabase not configured")
        return None

    payload = {
        "candidate_name": result.get("candidate_name"),
        "target_role": result.get("target_role"),
        "match_score": result.get("match_score"),
        "readiness_level": result.get("readiness_level"),
        "extracted_resume_skills": result.get("resume_skills", []),
        "extracted_jd_skills": result.get("jd_skills", []),
        "matched_skills": result.get("matched_skills", []),
        "missing_skills": result.get("missing_skills", []),
        "roadmap": result.get("roadmap", []),
        "reasoning_trace": result.get("reasoning_trace", [])
    }

    response = supabase.table("analyses").insert(payload).execute()
    print("Saved to Supabase")
    return response