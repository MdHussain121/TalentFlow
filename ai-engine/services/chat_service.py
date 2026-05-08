from typing import List, Dict
from .llm_service import llm_service

class ChatService:
    def __init__(self):
        self.system_instruction = """
You are the TalentFlow AI Career Co-Pilot. Your goal is to help students:
1. Improve their technical profiles.
2. Understand job requirements.
3. Prepare for interviews.
4. Navigate the TalentFlow platform features (Skill Heatmap, Shadow Projects, etc.)

Keep responses professional, encouraging, and technically accurate.
"""

    async def get_chat_response(self, message: str, history: List[Dict[str, str]] = []):
        """Generates a response for the AI Career Co-Pilot using NVIDIA NIM."""
        try:
            # Build history for NVIDIA (OpenAI format)
            messages = [{"role": "system", "content": self.system_instruction}]
            for h in history:
                messages.append({"role": h["role"], "content": h["content"]})
            
            messages.append({"role": "user", "content": message})

            # Use the underlying client directly for complex chat or just call a method
            # For simplicity, we can use the llm_service's client
            response = await llm_service.client.chat.completions.create(
                model=llm_service.model,
                messages=messages,
                temperature=0.7,
                max_tokens=1024
            )

            return response.choices[0].message.content
        except Exception as e:
            return f"I'm having trouble syncing with the neural engine. Please try again in a moment. Error: {str(e)}"

chat_service = ChatService()
