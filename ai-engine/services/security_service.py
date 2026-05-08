from dotenv import load_dotenv
load_dotenv()
import hashlib
import json
import time
from typing import Dict, Any

class SecurityService:
    def generate_sbt_hash(self, student_id: str, project_id: str, company_id: str) -> str:
        """Generates a cryptographic hash representing a Soulbound Token (SBT)."""
        data = {
            "student_id": student_id,
            "project_id": project_id,
            "company_id": company_id,
            "timestamp": time.time(),
            "type": "SoulboundToken"
        }
        encoded = json.dumps(data, sort_keys=True).encode()
        return hashlib.sha256(encoded).hexdigest()

    def verify_credential(self, hash_str: str, original_data: Dict[str, Any]) -> bool:
        """Verifies if the hash matches the provided credential data."""
        # In a real Web3 app, we'd check the blockchain
        check_hash = hashlib.sha256(json.dumps(original_data, sort_keys=True).encode()).hexdigest()
        return hash_str == check_hash

security_service = SecurityService()
