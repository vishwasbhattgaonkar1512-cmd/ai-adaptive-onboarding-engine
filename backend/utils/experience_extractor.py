import re

LEVEL_KEYWORDS = {
    "advanced": ["advanced", "expert", "proficient", "strong", "deep experience"],
    "intermediate": ["intermediate", "hands-on", "working knowledge", "practical experience"],
    "beginner": ["beginner", "basic", "familiar", "introductory", "foundation"]
}

YEAR_PATTERNS = [
    (r'(\d+)\+?\s+years?', "advanced"),
    (r'(\d+)\+?\s+yrs?', "advanced"),
]


def infer_level_from_text(skill: str, text: str) -> str:
    text_lower = text.lower()
    skill_lower = skill.lower()

    for match in re.finditer(re.escape(skill_lower), text_lower):
        start = max(0, match.start() - 80)
        end = min(len(text_lower), match.end() + 80)
        context = text_lower[start:end]

        for level, keywords in LEVEL_KEYWORDS.items():
            for keyword in keywords:
                if keyword in context:
                    return level

        for pattern, mapped_level in YEAR_PATTERNS:
            if re.search(pattern, context):
                return mapped_level

    return "intermediate"


def extract_skill_levels(skills: list[str], text: str) -> dict:
    result = {}
    for skill in skills:
        result[skill] = infer_level_from_text(skill, text)
    return result