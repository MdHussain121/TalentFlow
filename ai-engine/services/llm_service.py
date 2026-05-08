import os
import httpx
import asyncio
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("NVIDIA_API_KEY")
        self.base_url = "https://integrate.api.nvidia.com/v1/chat/completions"
        self.model = "nvidia_nim/z-ai/glm-4.7"
        
        if not self.api_key:
            print("Warning: NVIDIA_API_KEY not found in environment.")

    async def generate_content(self, prompt: str, system_instruction: str = "") -> str:
        if not self.api_key:
            return "Error: NVIDIA_API_KEY is missing. Please configure it in your .env file."
            
        try:
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})

            payload = {
                "model": self.model,
                "messages": messages,
                "temperature": 0.5,
                "top_p": 1,
                "max_tokens": 2048,
                "stream": False
            }
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(self.base_url, json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
    async def generate_chat(self, messages: List[Dict[str, str]], temperature: float = 0.7, max_tokens: int = 1024) -> str:
        if not self.api_key:
            return "Error: NVIDIA_API_KEY is missing. Please configure it in your .env file."
            
        try:
            payload = {
                "model": self.model,
                "messages": messages,
                "temperature": temperature,
                "top_p": 1,
                "max_tokens": max_tokens,
                "stream": False
            }
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(self.base_url, json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"NVIDIA Chat API Error: {e}")
            raise e

llm_service = LLMService()
