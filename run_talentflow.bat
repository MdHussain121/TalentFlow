@echo off
echo Starting TalentFlow AI Platform...

:: Start AI Engine
start "TalentFlow AI Engine" cmd /c "cd ai-engine && python -m uvicorn main:app --reload --port 8000"

:: Start API Gateway
start "TalentFlow API Gateway" cmd /c "cd api-gateway && node server.js"

:: Start Frontend
start "TalentFlow Frontend" cmd /c "cd frontend && npm run dev"

echo All services are starting up. 
echo 1. AI Engine: http://localhost:8000
echo 2. API Gateway: http://localhost:3000
echo 3. Frontend: http://localhost:5173
pause
