import os
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("NVIDIA_API_KEY")
        if not self.api_key:
            print("Warning: NVIDIA_API_KEY not found in environment.")
            
        self.client = AsyncOpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=self.api_key
        )
        self.model = "meta/llama-3.1-405b-instruct"

    async def generate_content(self, prompt: str, system_instruction: str = "") -> str:
        try:
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.5,
                top_p=1,
                max_tokens=2048,
                stream=False
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"NVIDIA API Error: {e}")
            raise e

llm_service = LLMService()
