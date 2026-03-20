def generate_reasoning_trace(jd_skills, matched_skills, missing_skills, roadmap):
    trace = []

    recommended_modules = []
    for phase in roadmap:
        recommended_modules.extend(phase["modules"])

    for skill in jd_skills:
        if skill in matched_skills:
            trace.append({
                "skill": skill,
                "status": "matched",
                "reason": "Required in JD and found in resume",
                "recommended_module": None
            })
        elif skill in missing_skills:
            recommended_module = recommended_modules[0] if recommended_modules else None
            trace.append({
                "skill": skill,
                "status": "missing",
                "reason": "Required in JD but not found in resume",
                "recommended_module": recommended_module
            })

    return trace