from dotenv import load_dotenv
load_dotenv()
import os
import google.generativeai as genai
from typing import Dict, Any, List

from services.llm_service import llm_service

class RoadmapService:
    def __init__(self):
        self.model = llm_service

    async def generate_cracking_roadmap(self, role: str, target_company: str, user_skills: List[str]):
        """Generates a structured roadmap for cracking a specific role/company."""
        prompt = f"""
        Generate a high-intensity, structured roadmap for a candidate aiming to crack a {role} internship at {target_company}.
        Current Skills: {', '.join(user_skills)}
        
        The roadmap should include:
        1. Technical Gaps to bridge.
        2. Specific Projects to build.
        3. Interview prep focus (DSA, System Design, etc.)
        4. A 4-week timeline.
        
        Format as JSON:
        {{
            "target": "{role} at {target_company}",
            "weeks": [
                {{
                    "week": 1,
                    "focus": "Core Fundamentals",
                    "tasks": ["Task 1", "Task 2"]
                }}
            ],
            "resources": ["Link/Book 1", "Link/Book 2"]
        }}
        """
        try:
            response = await self.model.generate_content(prompt)
            text = response
            import json
            import re
            
            # Extract JSON from markdown
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
            
            # Fallback if parsing fails
            return {
                "target": f"{role} at {target_company}",
                "weeks": [
                    {"week": 1, "focus": "Tech Stack Mastery", "tasks": [f"Deep dive into role-specific requirements", "Bridge fundamental gaps"]},
                    {"week": 2, "focus": "Advanced Systems", "tasks": ["Implement core logic modules", "Review architectural patterns"]},
                    {"week": 3, "focus": "Interview Preparation", "tasks": ["Practice company-specific scenarios", "Optimize coding efficiency"]},
                    {"week": 4, "focus": "Final Readiness", "tasks": ["Simulate technical assessments", "Finalize portfolio alignment"]}
                ],
                "resources": ["Industry Best Practices", "TalentFlow AI Labs"]
            }
        except Exception as e:
            return {"error": str(e)}

roadmap_service = RoadmapService()
