def generate_reasoning_trace(
    jd_skills,
    matched_skills,
    missing_skills,
    roadmap,
    partial_skills=None,
    resume_levels=None,
    jd_levels=None
):
    partial_skills = partial_skills or []
    resume_levels = resume_levels or {}
    jd_levels = jd_levels or {}

    trace = []

    recommended_modules = []
    for phase in roadmap:
        for module in phase["modules"]:
            if isinstance(module, dict):
                recommended_modules.append(module.get("title"))
            else:
                recommended_modules.append(module)

    for skill in jd_skills:
        if skill in matched_skills:
            trace.append({
                "skill": skill,
                "status": "matched",
                "reason": f"Required in JD and found in resume with sufficient proficiency ({resume_levels.get(skill, 'intermediate')} vs required {jd_levels.get(skill, 'intermediate')})",
                "recommended_module": None
            })
        elif skill in partial_skills:
            recommended_module = recommended_modules[0] if recommended_modules else None
            trace.append({
                "skill": skill,
                "status": "partial",
                "reason": f"Skill found in resume, but current proficiency ({resume_levels.get(skill, 'intermediate')}) is below required level ({jd_levels.get(skill, 'intermediate')})",
                "recommended_module": recommended_module
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