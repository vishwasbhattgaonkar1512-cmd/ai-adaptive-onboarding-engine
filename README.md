# AI-Adaptive Onboarding Engine

An AI-driven onboarding prototype that analyzes a candidate’s resume against a target job description, identifies skill gaps, and generates a personalized learning roadmap to accelerate role readiness.

Presented by: Vishwas Bhattgaonkar (Team Leader), Saurav Jadhav, Mithilesh Deshpande, Brian Fernandes
Video And Presentation Link : https://drive.google.com/drive/folders/1ybPLM1U3SbknSEZnxWQiIrGPEBwYctMR?usp=sharing
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


Project Structure

ai-adaptive-onboarding/
│
├── backend/
│   ├── main.py
│   ├── models/
│   └── utils/
│       ├── parser.py
│       ├── skill_extractor.py
│       ├── gap_analysis.py
│       ├── roadmap_generator.py
│       ├── reasoning_trace.py
│       ├── experience_extractor.py
│       ├── metrics.py
│       └── supabase_client.py
│
├── frontend/
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── data/
│   ├── skill_taxonomy.json
│   └── course_catalog.json
│
├── sample_resume.txt
├── sample_jd.txt
├── simple.txt
├── simple-jd.txt
├── intermediate.txt
├── inetrmediate-jd.txt
├── README.md
└── .gitignore

How the Engine Works
Step 1: Text Extraction

The uploaded Resume and Job Description are parsed into plain text.

Step 2: Skill Extraction

The engine scans both texts against a predefined skill taxonomy and identifies relevant skills.

Step 3: Experience Level Inference

For each detected skill, nearby keywords are analyzed to infer approximate proficiency:

Beginner
Intermediate
Advanced
Step 4: Skill Gap Analysis

The system compares candidate skills with target role skills and classifies them into:

Matched Skills
Partial Skills
Missing Skills
Matching logic:
Matched → Skill found and proficiency is sufficient
Partial → Skill found but candidate level is below JD expectation
Missing → Skill required by JD but absent from Resume
Step 5: Adaptive Roadmap Generation

Missing and partial skills are mapped to modules in the course catalog.

The roadmap is organized into phases such as:

Foundations
Core Role Skills
Job Readiness
Step 6: Reasoning Trace

The final response includes a reasoning trace explaining:

why a skill is matched / partial / missing
why certain modules were recommended
Internal Logic Used for Skill-Gap Analysis

This project uses a hybrid logical approach rather than relying completely on external hosted LLM APIs.

Why?

For hackathon demos, stability and reproducibility matter more than flashy but unreliable remote inference.

Current logic includes:
Rule-based skill detection
Taxonomy-based matching
Experience keyword extraction
Proficiency-level comparison
Gap scoring
Catalog-grounded training recommendation
Phase-wise roadmap generation

This ensures:

Lower demo risk
Faster inference
Better transparency
Easier debugging
Higher reliability
Match Score and Readiness

The system computes a weighted match score based on:

Fully matched skills
Partial skills
Missing skills
Readiness levels:
High
Medium
Low

These provide a quick view of how close a candidate is to the target role.

Metrics Generated

The backend also computes useful metrics such as:

Total required skills
Matched skills count
Missing skills count
Partial skills count
Estimated learning hours
Recommended modules count
Redundant training saved

These metrics help measure the efficiency of adaptive onboarding.

Datasets / Data Sources Used

This project is designed to work with publicly available data sources and structured skill catalogs.

Potential and referenced sources include:

Resume Dataset
Kaggle Resume Dataset
ONET Database
ONET job role and skill database
Job Description Dataset
Kaggle Jobs and Job Description dataset

These datasets are useful for:

skill taxonomy building
role requirement mapping
testing across domains
Transparency and Compliance

This project follows the challenge requirement that:

all datasets and open-source tools/models should be clearly disclosed
adaptive recommendation logic should be original
Important note:

The recommendation logic in this project is our own implementation.

The system does not generate random course suggestions.
All roadmap recommendations are grounded in the predefined course catalog.

Sample Use Cases

This engine can be used across different job categories, such as:

Software / Frontend roles
Data / Reporting roles
Operations / Coordination roles
Entry-level office support workflows

This demonstrates cross-domain scalability.

Example Output

The system returns a structured analysis including:

Candidate Name
Target Role
Resume Skills
JD Skills
Resume Skill Levels
JD Skill Levels
Matched Skills
Missing Skills
Partial Skills
Match Score
Readiness Level
Roadmap
Reasoning Trace
Metrics


Local Setup Instructions
1. Clone the repository

git clone https://github.com/vishwasbhattgaonkar1512-cmd/ai-adaptive-onboarding-engine.git
cd ai-adaptive-onboarding-engine

2. Backend setup

cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Backend runs at:

http://127.0.0.1:8000

Swagger docs:

http://127.0.0.1:8000/docs

3. Frontend setup

Open a new terminal:

cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:3000

Environment Variables

Create a backend/.env file and add:

SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

Sample Demo Files

You can test the prototype using:

sample_resume.txt
sample_jd.txt
simple.txt
simple-jd.txt
intermediate.txt
inetrmediate-jd.txt

These files help demonstrate:

high match cases
medium match cases
simple office role cases
different domain adaptability
Strengths of Our Approach
Transparent logic
Hackathon-friendly stability
No dependency on expensive paid APIs
Grounded recommendations
Good explainability through reasoning trace
Personalized training pathways
Suitable for multiple job domains
Current Limitations
Experience level extraction is heuristic-based
Skill extraction currently depends on skill taxonomy quality
Resume/JD formatting variety may affect parsing quality
Some advanced semantic matching features can still be improved
Frontend UI is minimal and designed for functional clarity
Future Improvements
Add stronger semantic similarity using embedding models
Add fuzzy skill normalization with richer synonym mapping
Improve experience estimation using more robust NLP techniques
Add authentication and user dashboards
Add persistent onboarding history
Add downloadable reports
Add recruiter/admin analytics panel
Add Dockerized deployment for smoother judging environment
Evaluation Alignment

This project is designed to align with the hackathon criteria:

Technical Sophistication → skill extraction + adaptive logic
Grounding and Reliability → course-catalog-based recommendations
Reasoning Trace → explicit recommendation explanations
Product Impact → reduced redundant training
User Experience → clear roadmap visualization
Cross-Domain Scalability → usable beyond only coding roles
Communication & Documentation → structured README and demo flow
Team Contribution

This project was built as a collaborative hackathon prototype covering:

frontend interface
backend APIs
parsing and analysis logic
adaptive training recommendation
documentation and demo preparation
Conclusion

AI-Adaptive Onboarding Engine is a practical prototype that rethinks onboarding as a dynamic, candidate-specific process rather than a fixed curriculum.

By combining parsing, skill-gap analysis, grounded recommendations, and explainable reasoning, the system helps move candidates toward role readiness in a faster and more efficient way.

Repository

GitHub Repository:
https://github.com/vishwasbhattgaonkar1512-cmd/ai-adaptive-onboarding-engine
