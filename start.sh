#!/bin/bash

echo "Starting Swar-Shiksha..."

# Start FastAPI Backend
echo "1. Starting FastAPI Backend..."
pip install -r requirements.txt
python main.py &
BACKEND_PID=$!

# Start React Frontend
echo "2. Starting React Frontend..."
cd frontend || exit
npm install
npm run dev &
FRONTEND_PID=$!

echo "Swar-Shiksha is running! Press Ctrl+C to stop both servers."

# Wait for Ctrl+C to kill background processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
