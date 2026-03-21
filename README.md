# AI-Adaptive Onboarding Engine

An AI-driven onboarding prototype that analyzes a candidate’s resume against a target job description, identifies skill gaps, and generates a personalized learning roadmap to accelerate role readiness.

---

## Problem Statement

Traditional onboarding programs often follow a fixed, one-size-fits-all structure. This creates two major problems:

- Experienced hires waste time revisiting skills they already possess
- Beginners may be pushed into advanced content without a proper foundation

Our solution addresses this by building an adaptive onboarding engine that:

- Extracts skills from a Resume and Job Description
- Compares the candidate profile against role requirements
- Identifies matched, missing, and partial skills
- Generates a structured training roadmap based on the detected skill gap
- Provides a reasoning trace for transparency and trust

---

## Solution Overview

The AI-Adaptive Onboarding Engine is a web-based prototype that helps personalize corporate training and onboarding.

### Core workflow:
1. User uploads a Resume
2. User uploads a target Job Description
3. The backend extracts text from both files
4. The system detects skills and experience indicators
5. A skill-gap analysis is performed
6. The engine classifies skills into:
   - Matched Skills
   - Partial Skills
   - Missing Skills
7. A custom learning roadmap is generated from the course catalog
8. A reasoning trace explains why each recommendation was made

This makes onboarding more efficient, more personalized, and more role-specific.

---

## Key Features

### 1. Intelligent Parsing
- Resume text extraction
- Job description text extraction
- Skill identification from both documents
- Experience/proficiency level inference for extracted skills

### 2. Skill Gap Analysis
- Finds overlapping skills between candidate and target role
- Detects missing skills
- Detects partial matches where candidate proficiency is lower than expected

### 3. Adaptive Learning Roadmap
- Generates a phase-wise custom roadmap
- Uses course catalog mapping
- Includes prerequisite-aware logic for more structured recommendations

### 4. Reasoning Trace
- Explains why a skill was marked matched, partial, or missing
- Shows which modules are recommended and why

### 5. Web Interface
- Upload Resume and Job Description
- View extracted skills
- View match score
- View readiness level
- View roadmap and reasoning trace

### 6. Grounded Recommendations
- Recommendations are generated strictly from the internal course catalog
- This avoids unsupported or hallucinated training suggestions

---

## Why This Project Matters

Organizations want onboarding that is:
- Faster
- Personalized
- Scalable
- Transparent
- Efficient

This project reduces redundant learning and directs candidates only toward the modules they actually need.

That means:
- Reduced onboarding time
- Better learning alignment
- Higher role readiness
- Stronger internal training outcomes

---

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- FastAPI
- Python

### Storage / Backend Services
- Supabase

### NLP / Matching Logic
- Rule-based skill extraction
- Experience keyword detection
- Skill-gap comparison logic
- Adaptive roadmap generation

### Tools / Utilities
- Git & GitHub
- Uvicorn
- Pydantic
- PyMuPDF / text extraction utilities
- JSON-based skill taxonomy and course catalog

---

## System Architecture

### High-Level Flow

```text
User Uploads Resume + JD
        ↓
Frontend (Next.js UI)
        ↓
FastAPI Backend
        ↓
Document Parsing
        ↓
Skill Extraction
        ↓
Experience Level Extraction
        ↓
Skill Gap Analysis
        ↓
Adaptive Roadmap Generation
        ↓
Reasoning Trace Generation
        ↓
Result Display + Optional Supabase Save



