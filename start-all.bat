@echo off
title Hospital OP Management System Launcher
echo ========================================================
echo Launching Hospital OP Full-Stack Application...
echo ========================================================

start "Hospital Backend (Port 8080)" cmd /k "%~dp0start-backend.bat"
timeout /t 4 /nobreak >nul
start "Hospital Frontend (Port 5173)" cmd /k "%~dp0start-frontend.bat"
timeout /t 2 /nobreak >nul

echo Both servers are starting!
echo Opening http://localhost:5173 in browser...
start http://localhost:5173
