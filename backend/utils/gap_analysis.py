def analyze_skill_gap(resume_skills, jd_skills):
    resume_set = set(resume_skills)
    jd_set = set(jd_skills)

    matched = sorted(list(resume_set & jd_set))
    missing = sorted(list(jd_set - resume_set))
    partial = []

    total = len(jd_skills) if jd_skills else 1
    score = (len(matched) / total) * 100

    if score >= 80:
        readiness = "High"
    elif score >= 55:
        readiness = "Medium"
    else:
        readiness = "Low"

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "partial_skills": partial,
        "match_score": round(score, 2),
        "readiness_level": readiness
    }