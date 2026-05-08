from dotenv import load_dotenv
load_dotenv()
import httpx
import os
from typing import Dict, Any

class ExternalIntegrations:
    async def fetch_github_stats(self, username: str) -> Dict[str, Any]:
        """Mock GitHub stats fetching."""
        # In production, use httpx to call GitHub API
        return {
            "username": username,
            "top_languages": ["TypeScript", "Python", "Rust"],
            "contributions_last_year": 450,
            "verified_skills": ["React", "FastAPI", "Docker"]
        }

    async def fetch_kaggle_stats(self, username: str) -> Dict[str, Any]:
        """Mock Kaggle stats fetching."""
        return {
            "username": username,
            "rank": "Grandmaster",
            "competitions_won": 3,
            "specialization": "NLP & Computer Vision"
        }

    async def get_smart_stipend(self, location: str) -> Dict[str, Any]:
        """Calculates fair stipend based on mock PPP and inflation data."""
        # Mock economic data
        ppp_index = {
            "India": 0.35,
            "USA": 1.0,
            "UK": 0.9,
            "Germany": 0.85
        }
        base_stipend_usd = 2000
        factor = ppp_index.get(location, 0.5)
        recommended = base_stipend_usd * factor
        
        return {
            "location": location,
            "recommended_stipend_usd": recommended,
            "local_currency_approx": f"{recommended * 83:.2f} INR" if location == "India" else f"{recommended:.2f} USD"
        }

external_integrations = ExternalIntegrations()
