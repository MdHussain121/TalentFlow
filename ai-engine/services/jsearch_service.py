from dotenv import load_dotenv
load_dotenv()
import httpx
import os
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

class JSearchService:
    def __init__(self):
        self.api_key = os.getenv("JSEARCH_API_KEY", "your_rapidapi_key_here")
        self.host = "jsearch.p.rapidapi.com"
        self.base_url = "https://jsearch.p.rapidapi.com/search"

    async def search_internships(self, query: str, location: str = "India"):
        """Fetches real-time internship data from JSearch API."""
        headers = {
            "X-RapidAPI-Key": self.api_key,
            "X-RapidAPI-Host": self.host
        }
        params = {
            "query": f"{query} internship in {location}",
            "num_pages": "1",
            "date_posted": "all"
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self.base_url, headers=headers, params=params, timeout=10.0)
                if response.status_code == 200:
                    data = response.json()
                    return self._format_results(data.get("data", []))
                else:
                    print(f"JSearch API Error: {response.status_code}")
                    return []
        except Exception as e:
            print(f"JSearch Connection Error: {e}")
            return []

    def _format_results(self, jobs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        formatted = []
        for job in jobs:
            formatted.append({
                "id": job.get("job_id"),
                "title": job.get("job_title"),
                "company": job.get("employer_name"),
                "location": job.get("job_city", "Remote"),
                "link": job.get("job_apply_link"),
                "match": "90%+" # Mock match for now, could be calculated
            })
        return formatted

jsearch_service = JSearchService()
