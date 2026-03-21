import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
COURSE_FILE = os.path.join(BASE_DIR, "data", "course_catalog.json")

with open(COURSE_FILE, "r", encoding="utf-8") as f:
    COURSE_CATALOG = json.load(f)


def generate_roadmap(target_skills):
    selected_modules = []

    for module in COURSE_CATALOG:
        module_skills = set(module["skills"])
        if any(skill in target_skills for skill in module_skills):
            selected_modules.append(module)

    selected_titles = {m["title"] for m in selected_modules}
    extra_modules = []

    for module in selected_modules:
        for prereq_skill in module.get("prerequisites", []):
            for course in COURSE_CATALOG:
                if prereq_skill in course["skills"] and course["title"] not in selected_titles:
                    extra_modules.append(course)

    all_modules = selected_modules + extra_modules

    unique_modules = []
    seen = set()
    for module in all_modules:
        if module["title"] not in seen:
            seen.add(module["title"])
            unique_modules.append(module)

    phase_order = ["Foundations", "Core Role Skills", "Job Readiness"]
    roadmap = []
    phase_number = 1

    for phase_name in phase_order:
        phase_modules = [m for m in unique_modules if m["phase"] == phase_name]
        if phase_modules:
            roadmap.append({
                "phase": f"Phase {phase_number}",
                "title": phase_name,
                "modules": [m["title"] for m in phase_modules]
            })
            phase_number += 1

    return roadmap