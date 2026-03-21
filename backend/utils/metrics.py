def calculate_metrics(jd_skills, matched_skills, missing_skills, partial_skills, roadmap):
    total_required = len(jd_skills)
    matched_count = len(matched_skills)
    missing_count = len(missing_skills)
    partial_count = len(partial_skills)

    total_hours = 0
    module_count = 0

    for phase in roadmap:
        for module in phase["modules"]:
            if isinstance(module, dict):
                total_hours += module.get("duration_hours", 0)
            module_count += 1

    redundant_training_saved = matched_count

    return {
        "total_required_skills": total_required,
        "matched_skills_count": matched_count,
        "missing_skills_count": missing_count,
        "partial_skills_count": partial_count,
        "estimated_learning_hours": total_hours,
        "recommended_modules_count": module_count,
        "redundant_training_saved": redundant_training_saved
    }