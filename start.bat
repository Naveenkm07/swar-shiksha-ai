@echo off
echo Starting Swar-Shiksha...

echo 1. Starting FastAPI Backend...
start cmd /k "pip install -r requirements.txt && python main.py"

echo 2. Starting React Frontend...
cd frontend
start cmd /k "npm install && npm run dev"

echo Swar-Shiksha is running! Check the opened console windows for logs.
