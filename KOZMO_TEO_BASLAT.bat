@echo off
title Kozmo-Teo Baslatici
echo ===================================================
echo           KOZMO-TEO SISTEMI BASLATILIYOR           
echo ===================================================
echo.

echo 1/2 Backend (FastAPI) ayaga kaldiriliyor...
start "Kozmo-Teo Backend (Port 8000)" cmd /k "cd /d C:\PROJELER\backend && ..\.venv\Scripts\uvicorn.exe main:app --reload --port 8000"

echo 2/2 Frontend (Next.js) ayaga kaldiriliyor...
start "Kozmo-Teo Arayuz (Port 3000)" cmd /k "cd /d C:\PROJELER\arayuz && npm.cmd run dev"

echo.
echo Sunucular baslatildi!
echo Tarayici aciliyor...
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo Her iki servis de ayri pencerelerde calisiyor.
timeout /t 3 >nul
exit
