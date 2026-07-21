@echo off
title AgriGuard AI Runner
echo ===================================================
echo   Starting AgriGuard AI Backend and Frontend
echo ===================================================

echo [1/2] Starting Flask Backend...
start "AgriGuard Backend" cmd /k "cd backend && py app.py"

echo [2/2] Starting Vite Frontend...
start "AgriGuard Frontend" cmd /k "cd frontend && npm run dev"

echo ===================================================
echo Both servers have been launched in separate windows!
echo - Backend API: http://127.0.0.1:5000
echo - Frontend App: http://localhost:5173 (or http://localhost:5174 depending on availability)
echo ===================================================
pause
