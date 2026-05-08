from dotenv import load_dotenv
load_dotenv()
import os
import google.generativeai as genai
from typing import List, Dict

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
        """Generates a response for the AI Career Co-Pilot."""
        try:
            # Configure Gemini if not already configured
            if not genai._client:
                genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

            model = genai.GenerativeModel('gemini-2.5-flash')

            # Format conversation history for Gemini
            formatted_history = []
            for h in history:
                role = "user" if h["role"] == "user" else "model"
                formatted_history.append({
                    "role": role,
                    "parts": [h["content"]]
                })

            # Build the full prompt with system instruction and history
            if not history:
                full_prompt = f"{self.system_instruction}\n\nUser: {message}"
            else:
                full_prompt = message

            # Generate response using chat with history
            chat = model.start_chat(history=formatted_history)
            response = chat.send_message(full_prompt)

            return response.text
        except Exception as e:
            return f"I'm having trouble syncing with the neural engine. Please try again in a moment. Error: {str(e)}"

chat_service = ChatService()
