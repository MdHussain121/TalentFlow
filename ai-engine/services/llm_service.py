import os
from dotenv import load_dotenv
import google.generativeai as genai
from openai import OpenAI

load_dotenv()

class LLMService:
    def __init__(self):
        self.provider = "nvidia" if os.getenv("NVIDIA_API_KEY") else "gemini"
        
        # Initialize Gemini
        if os.getenv("GEMINI_API_KEY"):
            genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
            self.gemini_model = genai.GenerativeModel('gemini-2.5-flash')
            
        # Initialize NVIDIA NIM
        if os.getenv("NVIDIA_API_KEY"):
            self.nvidia_client = OpenAI(
                base_url="https://integrate.api.nvidia.com/v1",
                api_key=os.getenv("NVIDIA_API_KEY")
            )
            self.nvidia_model = "meta/llama-3.1-405b-instruct" # Standard high-perf model

    async def generate_content(self, prompt: str) -> str:
        if self.provider == "nvidia":
            try:
                response = self.nvidia_client.chat.completions.create(
                    model=self.nvidia_model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.5,
                    top_p=1,
                    max_tokens=2048,
                    stream=False
                )
                return response.choices[0].message.content
            except Exception as e:
                print(f"NVIDIA API Error: {e}")
                # Fallback to Gemini if possible
                if hasattr(self, 'gemini_model'):
                    resp = self.gemini_model.generate_content(prompt)
                    return resp.text
                raise e
        else:
            resp = self.gemini_model.generate_content(prompt)
            return resp.text

llm_service = LLMService()
