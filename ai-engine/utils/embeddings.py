import os
import httpx
from typing import List
from dotenv import load_dotenv

load_dotenv()

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
BASE_URL = "https://integrate.api.nvidia.com/v1/embeddings"
MODEL = "nvidia/nv-embedqa-e5-v5"

def get_embedding(text: str) -> List[float]:
    """Generates a 1024-dimensional embedding using NVIDIA NIM via direct API call."""
    if not NVIDIA_API_KEY:
        print("Warning: NVIDIA_API_KEY not found. Returning zero vector.")
        return [0.0] * 1024
        
    try:
        headers = {
            "Authorization": f"Bearer {NVIDIA_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "input": [text],
            "model": MODEL,
            "input_type": "query",
            "encoding_format": "float"
        }
        
        with httpx.Client(timeout=30.0) as client:
            response = client.post(BASE_URL, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            return data["data"][0]["embedding"]
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return [0.0] * 1024

def get_batch_embeddings(texts: List[str]) -> List[List[float]]:
    """Generates embeddings for a batch of texts using NVIDIA NIM via direct API call."""
    if not NVIDIA_API_KEY:
        print("Warning: NVIDIA_API_KEY not found. Returning zero vectors.")
        return [[0.0] * 1024 for _ in texts]
        
    try:
        headers = {
            "Authorization": f"Bearer {NVIDIA_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "input": texts,
            "model": MODEL,
            "input_type": "query",
            "encoding_format": "float"
        }
        
        with httpx.Client(timeout=60.0) as client:
            response = client.post(BASE_URL, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            return [item["embedding"] for item in data["data"]]
    except Exception as e:
        print(f"Error generating batch embeddings: {e}")
        return [[0.0] * 1024 for _ in texts]
