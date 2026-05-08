from dotenv import load_dotenv
load_dotenv()
import os
import google.generativeai as genai
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

class SimulationService:
    def __init__(self):
        self.provider = "nvidia" if os.getenv("NVIDIA_API_KEY") else "gemini"

    async def generate_day_in_life(self, role: str, company: str = "a tech startup"):
        prompt = f"""
        Create a 15-minute interactive "Day-in-the-Life" simulation for a {role} at {company}.
        The simulation should consist of 3 critical decision-making scenarios.
        
        For each scenario, provide:
        1. Context/Problem description.
        2. 3 multiple-choice options.
        3. The 'Ideal' outcome and why.
        
        Format as JSON:
        {{
            "role": "{role}",
            "scenarios": [
                {{
                    "id": 1,
                    "title": "Scenario Title",
                    "context": "Scenario description...",
                    "options": [
                        {{"id": "A", "text": "Option A"}},
                        {{"id": "B", "text": "Option B"}},
                        {{"id": "C", "text": "Option C"}}
                    ],
                    "correct_id": "B",
                    "feedback": "Why B is the best professional choice."
                }}
            ]
        }}
        """
        try:
            response = await self.model.generate_content(prompt)
            return response
        except Exception as e:
            return {
                "error": str(e),
                "fallback": "Manual simulation mode triggered."
            }

    async def generate_technical_interview(self, role: str, company: str = "a tech company"):
        prompt = f"""
        Generate a comprehensive technical mock interview for a {role} position at {company}.
        The interview must include exactly:
        - 3 Multiple Choice Questions (MCQ)
        - 2 Short Answer Questions (1-2 sentences)
        - 1 Long Answer Question (Problem-solving or Architectural)

        Return the data as a clean JSON object with this structure:
        {{
            "role": "{role}",
            "questions": [
                {{
                    "id": 1,
                    "type": "mcq",
                    "question": "...",
                    "options": ["A", "B", "C", "D"],
                    "correct_answer": "...",
                    "explanation": "..."
                }},
                {{
                    "id": 4,
                    "type": "short",
                    "question": "...",
                    "ideal_keywords": ["keyword1", "keyword2"]
                }},
                {{
                    "id": 6,
                    "type": "long",
                    "question": "...",
                    "evaluation_criteria": "..."
                }}
            ]
        }}
        """
        try:
            response = await self.model.generate_content(prompt)
            # Basic cleanup of markdown if any
            text = response
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            return text
        except Exception as e:
            return {
                "error": str(e),
                "fallback": "Standard assessment mode triggered."
            }

simulation_service = SimulationService()
