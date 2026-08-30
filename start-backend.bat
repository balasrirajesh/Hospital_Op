@echo off
title Hospital OP Backend Server
echo ========================================================
echo Starting Hospital OP Spring Boot Backend (Port 8080)...
echo ========================================================

set "JAVA_HOME=C:\Users\lokes\.tools\jdk17"
set "PATH=%JAVA_HOME%\bin;C:\Users\lokes\.tools\maven\bin;%PATH%"

cd /d "%~dp0backend"
mvn spring-boot:run
pause
