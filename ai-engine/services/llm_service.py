import os
import httpx
import json
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("NVIDIA_API_KEY")
        self.base_url = "https://integrate.api.nvidia.com/v1"
        self.model = "nvidia_nim/z-ai/glm-4.7"

    async def generate_content(self, prompt: str, system_instruction: str = "", messages: list = None) -> str:
        if not self.api_key:
            return "Error: NVIDIA_API_KEY not found. Please check your .env file."

        if messages is None:
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": messages,
                        "temperature": 0.5,
                        "top_p": 1,
                        "max_tokens": 2048,
                        "stream": False
                    }
                )
                
                if response.status_code != 200:
                    return f"NVIDIA API Error ({response.status_code}): {response.text}"
                
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"NVIDIA Request Error: {e}")
            return f"I'm having trouble syncing with the neural engine. Error: {str(e)}"

llm_service = LLMService()
