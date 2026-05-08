import asyncio
import os
import sys

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.jsearch_service import jsearch_service

async def test_jsearch():
    print("Testing JSearch API...")
    results = await jsearch_service.search_internships("Python Developer")
    if results:
        print(f"Successfully fetched {len(results)} jobs!")
        for job in results[:3]:
            print(f"- {job['title']} at {job['company']} ({job['location']})")
    else:
        print("Failed to fetch jobs. Check your API key and network.")

if __name__ == "__main__":
    asyncio.run(test_jsearch())
