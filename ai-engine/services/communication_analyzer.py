from dotenv import load_dotenv
load_dotenv()
import os
from typing import Dict, Any
from services.llm_service import llm_service

class CommunicationAnalyzer:
    def __init__(self):
        self.model = llm_service

    async def analyze_pitch(self, transcript: str):
        prompt = f"""
        Analyze the following video pitch transcript for a job application.
        Provide scores (0-100) and specific feedback on:
        1. Clarity: How well-articulated is the technical content?
        2. Sentiment: Does the candidate sound confident and enthusiastic?
        3. Professionalism: Is the tone appropriate for a global recruiter?
        
        Transcript: "{transcript}"
        
        Format as JSON:
        {{
            "scores": {{ "clarity": 85, "sentiment": 90, "professionalism": 80 }},
            "strengths": ["list of 2 strengths"],
            "improvements": ["list of 2 improvements"],
            "overall_summary": "Short paragraph summary"
        }}
        """
        try:
            response = await self.model.generate_content(prompt)
            return response
        except Exception as e:
            return {"error": str(e)}

communication_analyzer = CommunicationAnalyzer()
