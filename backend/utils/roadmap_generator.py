import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
COURSE_FILE = os.path.join(BASE_DIR, "data", "course_catalog.json")

with open(COURSE_FILE, "r", encoding="utf-8") as f:
    COURSE_CATALOG = json.load(f)


def generate_roadmap(missing_skills):
    selected_modules = []

    for module in COURSE_CATALOG:
        module_skills = set(module["skills"])
        if any(skill in missing_skills for skill in module_skills):
            selected_modules.append(module)

    phases = {}
    for module in selected_modules:
        phase = module["phase"]
        if phase not in phases:
            phases[phase] = []
        phases[phase].append(module["title"])

    roadmap = []
    phase_order = ["Foundations", "Core Role Skills", "Job Readiness"]

    phase_number = 1
    for phase_name in phase_order:
        if phase_name in phases:
            roadmap.append({
                "phase": f"Phase {phase_number}",
                "title": phase_name,
                "modules": phases[phase_name]
            })
            phase_number += 1

    return roadmap