# TalentFlow AI ⚡️

> **The Editorial Brutalist Career OS.** TalentFlow is a high-craft, AI-native platform designed to bridge the gap between student potential and industry reality. It synthesizes technical DNA from raw resumes and transforms it into an actionable preparation ecosystem.

## 🌌 Overview

TalentFlow AI is a career-acceleration platform that treats preparation like an engineering project. By utilizing the NVIDIA NIM (Llama 3) engine and the JSearch API, it provides a high-fidelity environment where candidates don't just "apply" for jobs—they simulate their way into them.

## 🛠 Features in Detail

### 1. Personalized Growth Engine
The core intelligence layer of the TalentFlow dashboard. It uses a custom **NorthStar Orbit** visualization to track two critical metrics:
- **Market Readiness**: A composite score calculating your alignment with current industry standards.
- **Technical Synergy**: An index measuring how well your specific tech stack works together (e.g., the synergy between React and Next.js).
The interface follows an **Editorial Brutalist** design, utilizing bold typography and asymmetric bento-grids to present data with high clarity and authority.

### 2. Skill DNA Heatmap (with Aura Intensity)
A sophisticated visualization of your technical profile, extracted via AI resume parsing.
- **Dynamic Aura Glow**: Expert-level skills (85%+) feature a rhythmic, breathing pulse effect, making your "power skills" instantly visible to you.
- **Tiered Competency**: Automatically categorizes your stack into *Expert*, *Advanced*, and *Intermediate* tiers.
- **Visual Mapping**: Uses a high-contrast color palette to differentiate between Frontend, Backend, and AI specialized tools.

### 3. Neural Gap Analysis
A geometric approach to career planning. Using a custom **SVG Radar Chart**, TalentFlow maps your profile against the "Ideal Candidate" profile for any target role.
- **Visual Overlays**: Instantly see the "gap" between your current skills and role requirements.
- **Real-time Sync**: Updates dynamically as you acquire new certifications or complete mock interviews.

### 4. AI-Generated Crack Roadmaps
When you select a role from the job search, TalentFlow synthesizes a custom **4-Week Preparation Sprint**.
- **Week-by-Week Focus**: Each week targets a specific domain (e.g., Week 1: Tech Stack Mastery, Week 2: System Architecture).
- **Synthesized Tasks**: AI generates specific, actionable tasks based on the job description (e.g., "Implement semantic search with Pinecone").
- **Gated Flow**: The roadmap tab remains locked until a target role is selected, ensuring every preparation step is purpose-driven.

### 5. Peer Circles (AI-Moderated Rooms)
A collaborative learning space that integrates AI candidate simulations.
- **Technical Study Groups**: Join rooms like "Frontend Alchemists" or "DS/Algo Grind."
- **AI Peer Integration**: Chat with AI bots that simulate high-tier candidates, helping you refine your technical explanations and logic.
- **Intensity Levels**: Choose between *Casual*, *Medium*, and *High* intensity study sessions based on your upcoming interview schedule.

### 6. Neural Job Search (JSearch Integration)
Deeply integrated search functionality that bypasses generic job filters.
- **Skill DNA Matching**: Jobs are recommended based on their proximity to your Skill Heatmap.
- **Instant Roadmap Generation**: Every job card allows for a single-click transition into a 4-week preparation plan.

## 🏗 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion (for high-end micro-animations).
- **AI Engine**: FastAPI (Python), NVIDIA NIM (Llama 3 / Mistral), JSearch API.
- **Styling**: Vanilla CSS + Tailwind V4 patterns for a custom design system.

## 🚀 Installation & Setup

### Prerequisites
- Node.js (V20+)
- Python 3.10+
- NVIDIA API Key

### Deployment

1. **Clone the repository**
   ```bash
   git clone https://github.com/MdHussain121/TalentFlow.git
   ```

2. **Frontend Initialization**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend AI Engine**
   ```bash
   cd ai-engine
   pip install -r requirements.txt
   # Set NVIDIA_API_KEY in .env
   uvicorn main:app --reload
   ```

## ⚖️ License
MIT License. Created for builders who treat their career like a product.
