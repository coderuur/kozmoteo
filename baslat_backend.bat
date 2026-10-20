@echo off
cd /d "%~dp0backend"
echo Kozmo-Teo Backend Baslatiliyor...
echo API Dokumantasyonu: http://127.0.0.1:8000/docs
..\.venv\Scripts\uvicorn.exe main:app --reload --port 8000
pause
