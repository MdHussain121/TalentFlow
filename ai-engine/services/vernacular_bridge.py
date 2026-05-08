from dotenv import load_dotenv
load_dotenv()
import os
from services.llm_service import llm_service

class VernacularBridge:
    def __init__(self):
        self.model = llm_service

    async def translate_and_formalize(self, text: str, source_lang: str = "Hindi"):
        prompt = f"""
        Translate the following {source_lang} text into professional corporate English.
        Ensure technical accuracy and maintain a confident, professional tone suitable for a global recruiter.
        
        Input text: {text}
        
        Return only the formalized English translation.
        """
        try:
            response = await self.model.generate_content(prompt)
            return response.strip()
        except Exception as e:
            print(f"Translation error: {e}")
            return f"[Error in translation: {text}]"

vernacular_bridge = VernacularBridge()
