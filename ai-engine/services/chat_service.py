from typing import List, Dict, Any
from .llm_service import llm_service

class ChatService:
    def __init__(self):
        self.system_instruction = """You are TalentBot, the official AI Career Co-Pilot for TalentFlow AI - a revolutionary platform helping students land tech internships.

YOUR ROLE:
- Guide users through TalentFlow features (Skill Heatmap, Neural Job Search, Mock Interviews, Resume Analysis)
- Provide career advice for tech students seeking internships
- Explain how to use the platform effectively
- Help with technical interview preparation
- Suggest learning paths based on user goals

KEY TALENTFLOW FEATURES TO REFERENCE:
1. Skill Heatmap - Visualizes technical competencies powered by AI
2. Neural Job Search - Matches students to real-time internship opportunities
3. Mock Interviews - AI-powered technical interview simulations
4. Resume Upload - AI analysis to extract skills and suggest matches
5. Career Roadmap - 4-week preparation plans for target roles
6. Vernacular Bridge - Real-time translation for non-native speakers

PERSONALITY:
- Professional yet encouraging and friendly
- Technically accurate but accessible
- Action-oriented with specific next steps
- Always relate advice back to TalentFlow platform capabilities
- Use concise responses (100-200 words max)

FORMATTING:
- Use bullet points for lists
- Bold key terms sparingly
- End with actionable suggestion

IMPORTANT: Never mention you are an AI language model. You are specifically TalentBot from TalentFlow AI.
"""

    async def get_chat_response(self, message: str, history: List[Dict[str, str]] = []) -> str:
        """Generates a response for TalentBot Career Co-Pilot using NVIDIA API."""
        try:
            # Build messages array
            messages = [
                {"role": "system", "content": self.system_instruction}
            ]

            # Add conversation history (convert frontend format to API format)
            for h in history:
                # Map 'model' role from frontend to 'assistant' for NVIDIA API
                api_role = h.get("role", "user")
                if api_role == "model":
                    api_role = "assistant"
                messages.append({
                    "role": api_role,
                    "content": h.get("content", "")
                })

            # Add current message
            messages.append({"role": "user", "content": message})

            # Call LLM service with optimized parameters
            response = await llm_service.generate_chat(
                messages=messages,
                temperature=0.7,
                max_tokens=512
            )

            return response

        except Exception as e:
            error_msg = str(e)
            print(f"ChatService Error: {error_msg}")

            # Provide helpful fallback message
            if "NVIDIA_API_KEY" in error_msg or "400" in error_msg or "401" in error_msg:
                return """**TalentBot is temporarily unavailable.**

It looks like there's an issue with the API connection. Here's what you can do:

1. **Check your NVIDIA API Key** - Ensure it's valid in the .env file
2. **Get a free key** at https://build.nvidia.com/
3. **Try again in a few minutes**

Meanwhile, you can still:
- Upload your resume for AI analysis
- Use the Job Search feature
- Try the Mock Interview simulator
"""
            elif "429" in error_msg:
                return """**Rate limit reached!**

You've hit the maximum requests for today. Try again tomorrow or:

- Upgrade your NVIDIA API plan
- Use our built-in Mock Interview feature (unlimited!)
- Check out the Skill Heatmap for self-assessment
"""
            else:
                return f"""**I'm having trouble connecting right now.**

Error details: {error_msg[:100]}...

Please try again in a moment. In the meantime, feel free to:
- Explore the Job Search
- Review your Skill Heatmap
- Start a Mock Interview
"""

chat_service = ChatService()
