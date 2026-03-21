def level_score(level: str) -> int:
    mapping = {
        "beginner": 1,
        "intermediate": 2,
        "advanced": 3
    }
    return mapping.get(level, 2)


def analyze_skill_gap(resume_skills, jd_skills, resume_levels=None, jd_levels=None):
    resume_levels = resume_levels or {}
    jd_levels = jd_levels or {}

    resume_set = set(resume_skills)
    jd_set = set(jd_skills)

    matched = []
    partial = []
    missing = []

    for skill in sorted(jd_set):
        if skill not in resume_set:
            missing.append(skill)
        else:
            resume_level = resume_levels.get(skill, "intermediate")
            jd_level = jd_levels.get(skill, "intermediate")

            if level_score(resume_level) >= level_score(jd_level):
                matched.append(skill)
            else:
                partial.append(skill)

    total = len(jd_skills) if jd_skills else 1
    weighted_score = ((len(matched) * 1.0) + (len(partial) * 0.5)) / total * 100

    if weighted_score >= 80:
        readiness = "High"
    elif weighted_score >= 55:
        readiness = "Medium"
    else:
        readiness = "Low"

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "partial_skills": partial,
        "match_score": round(weighted_score, 2),
        "readiness_level": readiness
    }