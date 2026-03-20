import json
import os
from rapidfuzz import fuzz

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SKILL_FILE = os.path.join(BASE_DIR, "data", "skill_taxonomy.json")

with open(SKILL_FILE, "r", encoding="utf-8") as f:
    SKILL_TAXONOMY = json.load(f)


def extract_skills(text: str):
    text_lower = text.lower()
    found_skills = set()

    for canonical_skill, aliases in SKILL_TAXONOMY.items():
        for alias in aliases:
            if alias in text_lower:
                found_skills.add(canonical_skill)
                break

    joined_text = " ".join(text_lower.split())

    for canonical_skill, aliases in SKILL_TAXONOMY.items():
        if canonical_skill in found_skills:
            continue
        for alias in aliases:
            score = fuzz.partial_ratio(alias, joined_text)
            if score > 88:
                found_skills.add(canonical_skill)
                break

    return sorted(list(found_skills))