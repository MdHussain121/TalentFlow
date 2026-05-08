import os
import httpx
from typing import List
from dotenv import load_dotenv

load_dotenv()

# We'll use a functional approach to avoid module-level initialization crashes
def _get_nvidia_client():
    api_key = os.getenv("NVIDIA_API_KEY")
    return api_key, "https://integrate.api.nvidia.com/v1"

def get_embedding(text: str) -> List[float]:
    """Generates a 1024-dimensional embedding using NVIDIA NIM."""
    api_key, base_url = _get_nvidia_client()
    if not api_key:
        print("Warning: NVIDIA_API_KEY not found. Returning zero vector.")
        return [0.0] * 1024

    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(
                f"{base_url}/embeddings",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "input": [text],
                    "model": "nvidia/nv-embedqa-e5-v5",
                    "input_type": "query"
                }
            )
            
            if response.status_code != 200:
                print(f"NVIDIA Embedding Error: {response.text}")
                return [0.0] * 1024
                
            data = response.json()
            return data["data"][0]["embedding"]
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return [0.0] * 1024

def get_batch_embeddings(texts: List[str]) -> List[List[float]]:
    """Generates embeddings for a batch of texts using NVIDIA NIM."""
    api_key, base_url = _get_nvidia_client()
    if not api_key:
        return [[0.0] * 1024 for _ in texts]

    try:
        with httpx.Client(timeout=60.0) as client:
            response = client.post(
                f"{base_url}/embeddings",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "input": texts,
                    "model": "nvidia/nv-embedqa-e5-v5",
                    "input_type": "passage"
                }
            )
            
            if response.status_code != 200:
                print(f"NVIDIA Batch Embedding Error: {response.text}")
                return [[0.0] * 1024 for _ in texts]
                
            data = response.json()
            return [item["embedding"] for item in data["data"]]
    except Exception as e:
        print(f"Error generating batch embeddings: {e}")
        return [[0.0] * 1024 for _ in texts]
