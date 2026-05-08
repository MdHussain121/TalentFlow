from dotenv import load_dotenv
load_dotenv()
import json
import os
from typing import List, Dict, Any

class LocalStorageService:
    def __init__(self, db_name: str = "talentflow_db.json"):
        self.db_path = os.path.join(os.path.dirname(__file__), "..", "data", db_name)
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        if not os.path.exists(self.db_path):
            with open(self.db_path, 'w') as f:
                json.dump({"students": [], "jobs": []}, f)

    def _read_db(self) -> Dict[str, Any]:
        with open(self.db_path, 'r') as f:
            return json.load(f)

    def _write_db(self, data: Dict[str, Any]):
        with open(self.db_path, 'w') as f:
            json.dump(data, f, indent=4)

    def save_student(self, student_data: Dict[str, Any]):
        db = self._read_db()
        db["students"].append(student_data)
        self._write_db(db)

    def get_all_students(self) -> List[Dict[str, Any]]:
        return self._read_db()["students"]

    def save_job(self, job_data: Dict[str, Any]):
        db = self._read_db()
        db["jobs"].append(job_data)
        self._write_db(db)

    def get_all_jobs(self) -> List[Dict[str, Any]]:
        return self._read_db()["jobs"]

local_db = LocalStorageService()
