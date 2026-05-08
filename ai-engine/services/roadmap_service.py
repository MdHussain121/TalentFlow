from dotenv import load_dotenv
load_dotenv()
import os
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
                    "tasks": [
                        {{"title": "Task 1", "description": "Short 1-sentence description"}},
                        {{"title": "Task 2", "description": "Short 1-sentence description"}}
                    ]
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
                    {
                        "week": 1, 
                        "focus": "Tech Stack Mastery", 
                        "tasks": [
                            {"title": "Role Alignment", "description": "Deep dive into the specific tech stack and role-specific requirements."},
                            {"title": "Core Gaps", "description": "Identify and bridge fundamental gaps in your current skill set."}
                        ]
                    },
                    {
                        "week": 2, 
                        "focus": "Advanced Systems", 
                        "tasks": [
                            {"title": "Logic Implementation", "description": "Implement core logic modules and business requirements for the target role."},
                            {"title": "Architecture Review", "description": "Review and apply architectural patterns used by the target company."}
                        ]
                    },
                    {
                        "week": 3, 
                        "focus": "Interview Preparation", 
                        "tasks": [
                            {"title": "Scenario Practice", "description": "Practice company-specific scenarios and technical interview questions."},
                            {"title": "Efficiency Optimization", "description": "Focus on optimizing your coding efficiency and problem-solving speed."}
                        ]
                    },
                    {
                        "week": 4, 
                        "focus": "Final Readiness", 
                        "tasks": [
                            {"title": "Simulation Drills", "description": "Simulate end-to-end technical assessments and peer interviews."},
                            {"title": "Portfolio Lock", "description": "Finalize portfolio alignment and polish your presentation materials."}
                        ]
                    }
                ],
                "resources": ["Industry Best Practices", "TalentFlow AI Labs"]
            }
        except Exception as e:
            return {"error": str(e)}

roadmap_service = RoadmapService()
