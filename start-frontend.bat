@echo off
title Hospital OP Frontend Server
echo ========================================================
echo Starting Hospital OP React Frontend (Port 5173)...
echo ========================================================

set "PATH=C:\Program Files\nodejs;%PATH%"

cd /d "%~dp0frontend"
npm run dev
pause
