import os
from typing import List
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY")
)

def get_embedding(text: str) -> List[float]:
    """Generates a 1024-dimensional embedding using NVIDIA NIM."""
    try:
        response = client.embeddings.create(
            input=[text],
            model="nvidia/nv-embedqa-e5-v5"
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Error generating embedding: {e}")
        # Return a mock vector of 1024 zeros if it fails
        return [0.0] * 1024

def get_batch_embeddings(texts: List[str]) -> List[List[float]]:
    """Generates embeddings for a batch of texts using NVIDIA NIM."""
    try:
        response = client.embeddings.create(
            input=texts,
            model="nvidia/nv-embedqa-e5-v5"
        )
        return [item.embedding for item in response.data]
    except Exception as e:
        print(f"Error generating batch embeddings: {e}")
        return [[0.0] * 1024 for _ in texts]
