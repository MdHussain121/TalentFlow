from dotenv import load_dotenv
load_dotenv()
import os
import google.generativeai as genai
from typing import Dict, Any, List
from services.jsearch_service import jsearch_service

import io
import PyPDF2
import docx

from services.llm_service import llm_service

class ResumeService:
    def __init__(self):
        self.model = llm_service

    def extract_text_from_pdf(self, file_content: bytes) -> str:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text

    def extract_text_from_docx(self, file_content: bytes) -> str:
        doc = docx.Document(io.BytesIO(file_content))
        return "\n".join([para.text for para in doc.paragraphs])

    async def parse_resume_and_suggest_jobs(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        """Parses resume file and fetches real jobs from JSearch."""
        
        # 1. Extract text based on file type
        text = ""
        try:
            if filename.endswith(".pdf"):
                text = self.extract_text_from_pdf(file_content)
            elif filename.endswith(".docx"):
                text = self.extract_text_from_docx(file_content)
            else:
                text = file_content.decode("utf-8")
        except Exception as e:
            return {"error": f"Failed to parse file: {str(e)}"}

        if not text.strip():
            return {"error": "Extracted text is empty. Please check the file content."}

        # 2. Parse Resume with Gemini
        prompt = f"""
        Analyze the following resume text and return a JSON object with:
        1. 'summary': A brief 2-sentence summary of the candidate.
        2. 'skills': A list of top 5 technical skills.
        3. 'job_search_query': A concise 3-4 word string for searching related internships (e.g., 'Frontend Developer React').
        
        Resume Text:
        {text[:4000]}  # Limit text to avoid token overflow
        """
        
        try:
            ai_text = await self.model.generate_content(prompt)
            
            # Extract JSON from potential markdown code blocks
            import json
            import re
            
            search_query = "Software Engineer"
            skills = ["React", "Python", "Cloud Architecture"]
            summary = "Experienced candidate with technical depth."
            
            try:
                # Find JSON block
                json_match = re.search(r'\{.*\}', ai_text, re.DOTALL)
                if json_match:
                    data = json.loads(json_match.group(0))
                    search_query = data.get("job_search_query", search_query)
                    skills = data.get("skills", skills)
                    summary = data.get("summary", summary)
            except:
                # Fallback to regex if JSON fails
                match = re.search(r'"job_search_query":\s*"([^"]+)"', ai_text)
                if match:
                    search_query = match.group(1)
            
            # 3. Fetch real jobs
            real_jobs = await jsearch_service.search_internships(search_query)
            
            return {
                "profile": {
                    "summary": summary,
                    "skills": skills
                },
                "suggested_jobs": real_jobs
            }
        except Exception as e:
            return {"error": f"AI Processing failed: {str(e)}"}

resume_service = ResumeService()
