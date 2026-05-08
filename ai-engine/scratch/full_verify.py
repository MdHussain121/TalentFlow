import httpx
import asyncio

async def test_resume_upload():
    url = "http://localhost:8000/resume/suggest"
    file_path = "test_resume.txt"
    
    with open(file_path, "w") as f:
        f.write("Full Stack Developer with expertise in React, Node.js, and Python FastAPI. Looking for AI internships.")

    print(f"Testing resume upload to {url}...")
    try:
        with open(file_path, "rb") as f:
            files = {"file": ("resume.txt", f, "text/plain")}
            async with httpx.AsyncClient() as client:
                response = await client.post(url, files=files, timeout=30.0)
                
        print(f"Status Code: {response.status_code}")
        print("Response Data:")
        import json
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_resume_upload())
