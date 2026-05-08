from dotenv import load_dotenv
load_dotenv()
import os
from typing import Dict, Any

from services.llm_service import llm_service

class SimulationService:
    def __init__(self):
        self.model = llm_service

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
        Generate a unique and highly specialized technical mock interview for a {role} position at {company}.
        DO NOT use generic questions. Focus on actual technical challenges, edge cases, and architectural patterns relevant to {role}.
        
        The interview must include:
        - 3 Multiple Choice Questions (MCQ) - specifically testing deep technical understanding.
        - 2 Short Answer Questions (1-2 sentences) - testing conceptual clarity.
        - 1 Long Answer Question (Problem-solving or Architectural) - a realistic scenario-based challenge.
        
        Ensure the questions are DIFFERENT every time by focusing on different sub-topics of {role}.

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

    async def evaluate_interview(self, questions: List[Dict[str, Any]], answers: Dict[str, Any]):
        import json
        prompt = f"""
        Evaluate a candidate's mock interview performance.
        
        Questions and the candidate's answers are provided below:
        {json.dumps([{"id": q['id'], "q": q['question'], "a": answers.get(str(q['id']), "No answer")} for q in questions], indent=2)}
        
        For each question, analyze the response based on technical accuracy and clarity.
        Provide:
        1. Status: 'Correct', 'Partial', or 'Incorrect'.
        2. Mistake: Identify exactly what was wrong or missing in the answer.
        3. Correct Answer: Provide the ideal, technically sound answer.
        4. Feedback: A short tip on how to improve.
        
        Format the response as a valid JSON object:
        {{
            "total_score": 75,
            "evaluations": [
                {{
                    "question_id": 1,
                    "status": "Correct",
                    "mistake": "None",
                    "correct_answer": "...",
                    "feedback": "..."
                }}
            ],
            "overall_feedback": "A summary of the candidate's performance and areas for growth."
        }}
        """
        try:
            response = await self.model.generate_content(prompt)
            text = response
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            return json.loads(text)
        except Exception as e:
            return {"error": str(e), "total_score": 0, "evaluations": [], "overall_feedback": "Evaluation failed."}

simulation_service = SimulationService()
