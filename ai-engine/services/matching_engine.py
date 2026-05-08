from dotenv import load_dotenv
load_dotenv()
from typing import List, Dict, Any
from utils.embeddings import get_embedding
from services.local_storage_service import local_db
import numpy as np

class MatchingEngine:
    def __init__(self):
        pass

    def cosine_similarity(self, v1, v2):
        v1 = np.array(v1)
        v2 = np.array(v2)
        return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

    async def match_student_to_job(self, student_id: str):
        """Matches a student to the best available jobs in local storage."""
        students = local_db.get_all_students()
        student = next((s for s in students if s["id"] == student_id), None)
        
        if not student:
            return {"error": "Student not found"}

        jobs = local_db.get_all_jobs()
        matches = []

        for job in jobs:
            score = self.cosine_similarity(student["embedding"], job["embedding"])
            if score > 0.7:
                matches.append({
                    "job_id": job["id"],
                    "title": job["title"],
                    "company": job["company"],
                    "score": float(score)
                })
        
        return sorted(matches, key=lambda x: x["score"], reverse=True)

matching_engine = MatchingEngine()
