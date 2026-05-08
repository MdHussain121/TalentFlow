from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from typing import Dict, Any
from services.matching_engine import matching_engine
from utils.embeddings import get_embedding

load_dotenv()

from services.roadmap_service import roadmap_service

app = FastAPI(title="TalentFlow AI Engine")

# Simple In-Memory Cache to prevent redundant API calls
request_cache = {}

@app.post("/roadmap/generate")
async def generate_custom_roadmap(data: Dict[str, Any] = Body(...)):
    cache_key = f"roadmap_{data.get('role')}_{data.get('company')}"
    if cache_key in request_cache:
        return request_cache[cache_key]
        
    try:
        result = await roadmap_service.generate_cracking_roadmap(
            data.get("role", "Software Engineer"), 
            data.get("company", "a tech company"), 
            data.get("skills", ["React", "Python"])
        )
        if isinstance(result, dict) and "error" not in result:
            request_cache[cache_key] = result
        return result
    except Exception as e:
        if "429" in str(e):
            return {"error": "AI Quota Exceeded. Please try again in 1 minute.", "retry_after": 60}
        return {"error": str(e)}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from services.local_storage_service import local_db

# ... existing code ...

@app.post("/index/student")
async def index_student(student_data: Dict[str, Any] = Body(...)):
    text = f"{student_data.get('name')} {student_data.get('skills')} {student_data.get('projects')}"
    vector = get_embedding(text)
    
    # Save to Local Storage instead of Pinecone
    local_db.save_student({
        "id": student_data.get("id", "test-student"),
        "embedding": vector,
        "metadata": student_data
    })
    return {"status": "indexed", "id": student_data.get("id")}

@app.post("/match")
async def match_job(data: Dict[str, Any] = Body(...)):
    # data contains student_data and job_data
    result = await matching_engine.match_student_to_job(
        data.get("student_data", {}),
        data.get("job_data", {})
    )
    return result

from services.vernacular_bridge import vernacular_bridge
from services.external_integrations import external_integrations

# ... existing routes ...

@app.post("/translate")
async def translate_text(data: Dict[str, str] = Body(...)):
    text = data.get("text", "")
    source_lang = data.get("source_lang", "Hindi")
    result = await vernacular_bridge.translate_and_formalize(text, source_lang)
    return {"original": text, "formalized": result}

@app.get("/stipend/{location}")
async def get_stipend(location: str):
    return await external_integrations.get_smart_stipend(location)

@app.get("/stats/github/{username}")
async def get_github_stats(username: str):
    return await external_integrations.fetch_github_stats(username)

from services.simulation_service import simulation_service
from services.communication_analyzer import communication_analyzer

# ... existing routes ...

@app.get("/simulate/{role}")
async def start_simulation(role: str):
    return await simulation_service.generate_day_in_life(role)

@app.post("/analyze/pitch")
async def analyze_pitch(data: Dict[str, str] = Body(...)):
    transcript = data.get("transcript", "")
    return await communication_analyzer.analyze_pitch(transcript)

@app.post("/interview/generate")
async def generate_interview(data: Dict[str, str] = Body(...)):
    # Cache removed to ensure specialized questions every time as per user request
    try:
        role = data.get("role", "Software Engineer")
        company = data.get("company", "a tech company")
        result = await simulation_service.generate_technical_interview(role, company)
        
        if isinstance(result, dict):
            return result
            
        import json
        try:
            parsed = json.loads(result)
            return parsed
        except Exception as e:
            print(f"JSON Parse Error: {e}\nRaw result: {result}")
            return {"error": "Failed to parse AI response", "raw": result}
    except Exception as e:
        if "429" in str(e):
            return {"error": "AI Quota Exceeded. Please try again shortly.", "retry_after": 60}
        return {"error": str(e)}

from services.resume_service import resume_service
from fastapi import FastAPI, Body, UploadFile, File

@app.post("/resume/suggest")
async def suggest_jobs(file: UploadFile = File(...)):
    print(f"DEBUG: Received file upload request: {file.filename} ({file.content_type})")
    file_content = await file.read()
    print(f"DEBUG: Read {len(file_content)} bytes")
    return await resume_service.parse_resume_and_suggest_jobs(file_content, file.filename)

@app.post("/search")
async def search_jobs(data: Dict[str, str] = Body(...)):
    query = data.get("query", "")
    from services.jsearch_service import jsearch_service
    results = await jsearch_service.search_internships(query)
    return {"results": results}

from services.chat_service import chat_service

@app.post("/chat")
async def chat_with_copilot(data: Dict[str, Any] = Body(...)):
    message = data.get("message", "")
    history = data.get("history", [])
    response = await chat_service.get_chat_response(message, history)
    return {"response": response}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-engine"}

@app.get("/")
def read_root():
    return {"message": "Welcome to TalentFlow AI Engine"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
