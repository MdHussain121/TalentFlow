import os
import google.generativeai as genai
from typing import List
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_embedding(text: str) -> List[float]:
    """Generates a 768-dimensional embedding using Gemini."""
    try:
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type="retrieval_document",
            title="TalentFlow Profile"
        )
        return result['embedding']
    except Exception as e:
        print(f"Error generating embedding: {e}")
        # Return a mock vector of 768 zeros if it fails (for development without API key)
        return [0.0] * 768

def get_batch_embeddings(texts: List[str]) -> List[List[float]]:
    """Generates embeddings for a batch of texts."""
    try:
        result = genai.embed_content(
            model="models/embedding-001",
            content=texts,
            task_type="retrieval_document"
        )
        return result['embeddings']
    except Exception as e:
        print(f"Error generating batch embeddings: {e}")
        return [[0.0] * 768 for _ in texts]
